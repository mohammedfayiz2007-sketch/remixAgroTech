/**
 * Gmail Service for AGRO platform
 * Direct client-side integration using Firebase OAuth access token.
 */

import { TrackedPlant } from '../types';

export interface GmailProfile {
  emailAddress: string;
  messagesTotal: number;
  threadsTotal: number;
  historyId: string;
}

export interface GmailMessageHeader {
  name: string;
  value: string;
}

export interface GmailMessageSummary {
  id: string;
  threadId: string;
  snippet: string;
  subject: string;
  from: string;
  date: string;
  to: string;
  isUnread: boolean;
  labelIds: string[];
}

export interface GmailMessageDetail extends GmailMessageSummary {
  bodyHtml?: string;
  bodyText?: string;
}

export interface SendEmailPayload {
  to: string;
  subject: string;
  htmlBody: string;
  textBody?: string;
}

/**
 * Encodes a string to RFC 4648 Base64URL without padding
 */
function base64UrlEncode(str: string): string {
  // Support UTF-8 encoding in Base64
  const encoded = btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) =>
      String.fromCharCode(parseInt(p1, 16))
    )
  );
  return encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * Decodes RFC 4648 Base64URL string to UTF-8
 */
function base64UrlDecode(base64UrlStr: string): string {
  try {
    let base64 = base64UrlStr.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    const binary = atob(base64);
    const bytes = Uint8Array.from(binary, (m) => m.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  } catch {
    return '';
  }
}

/**
 * Fetch authenticated user's Gmail profile
 */
export async function fetchGmailProfile(token: string): Promise<GmailProfile> {
  const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/profile', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to fetch profile: HTTP ${res.status}`);
  }

  return res.json();
}

/**
 * Fetch list of messages with query and pagination
 */
export async function fetchGmailMessages(
  token: string,
  options: { maxResults?: number; q?: string; pageToken?: string } = {}
): Promise<{ messages: GmailMessageSummary[]; nextPageToken?: string }> {
  const { maxResults = 15, q = '', pageToken = '' } = options;

  const params = new URLSearchParams();
  params.set('maxResults', maxResults.toString());
  if (q) params.set('q', q);
  if (pageToken) params.set('pageToken', pageToken);

  const listRes = await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/me/messages?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!listRes.ok) {
    const errorData = await listRes.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to fetch messages: HTTP ${listRes.status}`);
  }

  const listData = await listRes.json();
  const rawList: { id: string; threadId: string }[] = listData.messages || [];

  if (rawList.length === 0) {
    return { messages: [], nextPageToken: listData.nextPageToken };
  }

  // Fetch headers & snippet for each message in parallel
  const detailPromises = rawList.slice(0, maxResults).map(async (item) => {
    try {
      const msgRes = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${item.id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From&metadataHeaders=Date&metadataHeaders=To`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!msgRes.ok) return null;
      const data = await msgRes.json();

      const headers: GmailMessageHeader[] = data.payload?.headers || [];
      const getHeader = (name: string) =>
        headers.find((h) => h.name.toLowerCase() === name.toLowerCase())?.value || '';

      const isUnread = (data.labelIds || []).includes('UNREAD');

      return {
        id: data.id,
        threadId: data.threadId,
        snippet: data.snippet || '',
        subject: getHeader('Subject') || '(No Subject)',
        from: getHeader('From') || 'Unknown Sender',
        date: getHeader('Date') || '',
        to: getHeader('To') || '',
        isUnread,
        labelIds: data.labelIds || [],
      } as GmailMessageSummary;
    } catch {
      return null;
    }
  });

  const resolved = await Promise.all(detailPromises);
  const messages = resolved.filter((m): m is GmailMessageSummary => m !== null);

  return {
    messages,
    nextPageToken: listData.nextPageToken,
  };
}

/**
 * Fetch full message details including body
 */
export async function fetchGmailMessageDetails(
  token: string,
  messageId: string
): Promise<GmailMessageDetail> {
  const res = await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}?format=full`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to fetch message detail: HTTP ${res.status}`);
  }

  const data = await res.json();
  const headers: GmailMessageHeader[] = data.payload?.headers || [];
  const getHeader = (name: string) =>
    headers.find((h) => h.name.toLowerCase() === name.toLowerCase())?.value || '';

  let bodyHtml = '';
  let bodyText = '';

  const extractParts = (part: any) => {
    if (!part) return;
    if (part.mimeType === 'text/html' && part.body?.data) {
      bodyHtml = base64UrlDecode(part.body.data);
    } else if (part.mimeType === 'text/plain' && part.body?.data) {
      bodyText = base64UrlDecode(part.body.data);
    }

    if (part.parts && Array.isArray(part.parts)) {
      part.parts.forEach(extractParts);
    }
  };

  extractParts(data.payload);

  if (!bodyHtml && data.payload?.body?.data) {
    bodyText = base64UrlDecode(data.payload.body.data);
  }

  return {
    id: data.id,
    threadId: data.threadId,
    snippet: data.snippet || '',
    subject: getHeader('Subject') || '(No Subject)',
    from: getHeader('From') || 'Unknown Sender',
    date: getHeader('Date') || '',
    to: getHeader('To') || '',
    isUnread: (data.labelIds || []).includes('UNREAD'),
    labelIds: data.labelIds || [],
    bodyHtml,
    bodyText,
  };
}

/**
 * Send an email via Gmail API
 * Note: Must be preceded by explicit user confirmation modal per Workspace security guidelines.
 */
export async function sendGmailMessage(
  token: string,
  payload: SendEmailPayload
): Promise<{ id: string; threadId: string }> {
  const boundary = `====_AGRO_BOUNDARY_${Date.now()}_====`;
  const cleanSubject = payload.subject.replace(/[\r\n]/g, ' ');

  const rfc822Lines = [
    `To: ${payload.to}`,
    `Subject: =?utf-8?B?${btoa(encodeURIComponent(cleanSubject).replace(/%([0-9A-F]{2})/g, (_, p1) => String.fromCharCode(parseInt(p1, 16))))}?=`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    '',
    `--${boundary}`,
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 7bit',
    '',
    payload.textBody || payload.htmlBody.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(),
    '',
    `--${boundary}`,
    'Content-Type: text/html; charset=UTF-8',
    'Content-Transfer-Encoding: 7bit',
    '',
    payload.htmlBody,
    '',
    `--${boundary}--`,
  ];

  const rawRfc822 = rfc822Lines.join('\r\n');
  const encodedRaw = base64UrlEncode(rawRfc822);

  const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      raw: encodedRaw,
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to send email: HTTP ${res.status}`);
  }

  return res.json();
}

/**
 * Generate a high-fidelity agronomic diagnostic report HTML template ready to email
 */
export function buildPlantReportEmailTemplate({
  plant,
  senderName,
  farmerNotes,
}: {
  plant: TrackedPlant;
  senderName: string;
  farmerNotes?: string;
}): { subject: string; htmlBody: string; textBody: string } {
  const severityColor =
    plant.currentSeverity === 'healthy'
      ? '#10b981'
      : plant.currentSeverity === 'moderate'
      ? '#f59e0b'
      : plant.currentSeverity === 'high'
      ? '#f97316'
      : '#ef4444';

  const subject = `[AGRO Field Diagnostic] ${plant.plantName} — ${plant.currentDisease} (${plant.healthStatusLabel.toUpperCase()})`;

  const textBody = `
AGRO CROP DIAGNOSTIC REPORT
Generated by: ${senderName}
Date: ${new Date().toLocaleDateString()}

Crop: ${plant.plantName} (${plant.cropType})
Detected Condition: ${plant.currentDisease}
Severity: ${plant.currentSeverity.toUpperCase()} (Health Score: ${plant.currentHealthScore}%)
Environment: ${plant.environmentTag || 'Outdoor'}
Last Scanned: ${plant.lastScannedDate}

Daily Action Protocol:
- Morning: ${plant.dailyActionPlan.morning}
- Irrigation: ${plant.dailyActionPlan.watering}
- Monitoring: ${plant.dailyActionPlan.monitoring}
- Next Follow-up: ${plant.dailyActionPlan.nextStep}

Farmer Notes:
${farmerNotes || 'No additional notes provided.'}

Sent via AGRO (Detect Early. Grow Better.)
`.trim();

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b110d; color: #e2e8f0; margin: 0; padding: 24px; }
    .card { background-color: #121c14; border: 1px solid #233726; border-radius: 14px; max-width: 600px; margin: 0 auto; overflow: hidden; }
    .header { background: linear-gradient(135deg, #162a1b 0%, #0d1a10 100%); padding: 20px 24px; border-bottom: 1px solid #233726; }
    .logo { font-size: 20px; font-weight: 800; color: #00ff66; letter-spacing: 0.05em; }
    .sub { font-size: 12px; color: #94a3b8; margin-top: 4px; }
    .content { padding: 24px; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; text-transform: uppercase; background-color: ${severityColor}20; color: ${severityColor}; border: 1px solid ${severityColor}60; }
    .stat-row { display: flex; justify-content: space-between; border-bottom: 1px solid #1a2c1e; padding: 10px 0; font-size: 13px; }
    .stat-label { color: #94a3b8; }
    .stat-val { font-weight: 600; color: #ffffff; }
    .section-title { font-size: 14px; font-weight: 700; color: #00ff66; margin-top: 20px; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.04em; }
    .action-box { background-color: #0d160f; border-left: 3px solid #00ff66; padding: 12px 14px; border-radius: 0 8px 8px 0; margin-bottom: 8px; font-size: 13px; }
    .notes-box { background-color: #18261b; border: 1px dashed #2d4532; border-radius: 8px; padding: 12px; font-size: 13px; color: #cbd5e1; margin-top: 14px; }
    .footer { text-align: center; padding: 16px; font-size: 11px; color: #64748b; border-top: 1px solid #1a2c1e; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="logo">🌿 AGRO — Crop Health Dispatch</div>
      <div class="sub">Direct Agronomic Field Diagnostic Report from ${senderName}</div>
    </div>
    <div class="content">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <h2 style="margin: 0; font-size: 18px; color: #ffffff;">${plant.plantName} (${plant.cropType})</h2>
        <span class="badge">${plant.healthStatusLabel}</span>
      </div>

      <div class="stat-row">
        <span class="stat-label">Identified Pathology:</span>
        <span class="stat-val">${plant.currentDisease}</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">Health Score:</span>
        <span class="stat-val" style="color: ${severityColor};">${plant.currentHealthScore}%</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">Canopy Environment:</span>
        <span class="stat-val">${plant.environmentTag || 'Outdoor'}</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">Record Date:</span>
        <span class="stat-val">${plant.lastScannedDate}</span>
      </div>

      <div class="section-title">Field Management &amp; Care Protocol</div>
      <div class="action-box">
        <strong>🌅 Morning Inspection:</strong> ${plant.dailyActionPlan.morning}
      </div>
      <div class="action-box">
        <strong>💧 Irrigation Guideline:</strong> ${plant.dailyActionPlan.watering}
      </div>
      <div class="action-box">
        <strong>✂️ Treatment &amp; Containment:</strong> ${plant.dailyActionPlan.monitoring}
      </div>
      <div class="action-box">
        <strong>📷 Follow-up Cadence:</strong> ${plant.dailyActionPlan.nextStep}
      </div>

      ${
        farmerNotes
          ? `
      <div class="section-title">Farmer Observations &amp; Questions</div>
      <div class="notes-box">
        ${farmerNotes.replace(/\n/g, '<br>')}
      </div>
      `
          : ''
      }
    </div>
    <div class="footer">
      Generated automatically by AGRO platform. For urgent crop disease outbreaks, consult your district agricultural extension officer.
    </div>
  </div>
</body>
</html>
  `.trim();

  return { subject, htmlBody, textBody };
}
