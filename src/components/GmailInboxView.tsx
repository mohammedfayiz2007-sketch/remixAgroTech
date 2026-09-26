import React, { useState, useEffect } from 'react';
import {
  Mail,
  Send,
  Search,
  RefreshCw,
  Clock,
  User as UserIcon,
  ChevronLeft,
  CheckCircle2,
  Inbox,
  SendHorizontal,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  FileSpreadsheet,
} from 'lucide-react';
import {
  fetchGmailMessages,
  fetchGmailMessageDetails,
  fetchGmailProfile,
  GmailMessageSummary,
  GmailMessageDetail,
  GmailProfile,
} from '../services/gmailService';
import { GmailComposeModal } from './GmailComposeModal';
import { TrackedPlant } from '../types';

interface GmailInboxViewProps {
  accessToken: string | null;
  currentUserEmail: string | null;
  currentUserName: string | null;
  onRequireAuth: () => void;
  plants?: TrackedPlant[];
}

export const GmailInboxView: React.FC<GmailInboxViewProps> = ({
  accessToken,
  currentUserEmail,
  currentUserName,
  onRequireAuth,
  plants = [],
}) => {
  const [profile, setProfile] = useState<GmailProfile | null>(null);
  const [messages, setMessages] = useState<GmailMessageSummary[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<GmailMessageDetail | null>(null);
  const [isLoadingMessages, setIsLoadingMessages] = useState<boolean>(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFolder, setActiveFolder] = useState<'INBOX' | 'SENT' | 'ALL'>('INBOX');
  const [error, setError] = useState<string | null>(null);
  const [isComposeOpen, setIsComposeOpen] = useState<boolean>(false);
  const [selectedPlantForEmail, setSelectedPlantForEmail] = useState<TrackedPlant | null>(null);

  // Load messages when token or activeFolder changes
  const loadMessages = async () => {
    if (!accessToken) return;
    setIsLoadingMessages(true);
    setError(null);

    try {
      // Load profile info if not loaded
      if (!profile) {
        try {
          const prof = await fetchGmailProfile(accessToken);
          setProfile(prof);
        } catch {
          // ignore non-critical profile error
        }
      }

      let q = '';
      if (activeFolder === 'INBOX') q = 'label:INBOX';
      else if (activeFolder === 'SENT') q = 'label:SENT';

      if (searchQuery.trim()) {
        q = q ? `${q} ${searchQuery.trim()}` : searchQuery.trim();
      }

      const { messages: fetched } = await fetchGmailMessages(accessToken, {
        maxResults: 15,
        q,
      });

      setMessages(fetched);
    } catch (err: any) {
      console.error('Failed to load Gmail messages:', err);
      setError(err.message || 'Unable to retrieve messages from Gmail API');
    } finally {
      setIsLoadingMessages(false);
    }
  };

  useEffect(() => {
    if (accessToken) {
      loadMessages();
    }
  }, [accessToken, activeFolder]);

  // Load full message details
  const handleSelectMessage = async (msgSummary: GmailMessageSummary) => {
    if (!accessToken) return;
    setIsLoadingDetail(true);
    try {
      const detail = await fetchGmailMessageDetails(accessToken, msgSummary.id);
      setSelectedMessage(detail);
    } catch (err: any) {
      console.error('Failed to fetch message details:', err);
      setSelectedMessage({
        ...msgSummary,
        bodyText: msgSummary.snippet,
      });
    } finally {
      setIsLoadingDetail(false);
    }
  };

  // If not authenticated with Gmail
  if (!accessToken) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-[#0F1611] border border-[#223526] rounded-2xl p-8 sm:p-12 text-center max-w-xl mx-auto shadow-2xl relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#00FF66]/10 blur-3xl rounded-full pointer-events-none" />

          <div className="w-16 h-16 rounded-2xl bg-[#162419] border border-[#00FF66]/30 flex items-center justify-center mx-auto mb-6 text-[#00FF66] shadow-neon-sm">
            <Mail className="w-8 h-8" />
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
            Connect Your Gmail Account
          </h2>
          <p className="text-stone-300 text-xs sm:text-sm leading-relaxed mb-6">
            Link your Google account with official Gmail authorization to send foliar disease diagnostic alerts, receive agronomist advisories, and track agricultural correspondence directly within AGRO.
          </p>

          <div className="bg-[#0A100C] border border-[#1A281E] rounded-xl p-4 mb-8 text-left space-y-2.5">
            <div className="flex items-center gap-2 text-xs text-[#00FF66] font-semibold">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Google Verified Workspace Integration</span>
            </div>
            <ul className="text-[11px] text-stone-400 space-y-1.5 pl-6 list-disc">
              <li>Direct RFC-822 email transmission with no third-party relay</li>
              <li>Pre-formatted crop pathology cards with treatment regimes</li>
              <li>Explicit user confirmation dialog before any email is dispatched</li>
            </ul>
          </div>

          {/* Official Google Sign-in Button style per workspace-integration SKILL */}
          <button
            onClick={onRequireAuth}
            className="inline-flex items-center justify-center gap-3 px-6 py-3 rounded-xl bg-white text-stone-900 font-semibold text-sm hover:bg-stone-100 transition-all shadow-lg hover:shadow-xl cursor-pointer active:scale-95"
          >
            <svg className="w-5 h-5" viewBox="0 0 48 48">
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
              />
              <path
                fill="#4285F4"
                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
              />
              <path
                fill="#FBBC05"
                d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
              />
              <path
                fill="#34A853"
                d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
              />
            </svg>
            <span>Sign in with Google for Gmail Access</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Top Banner / Workspace Bar */}
      <div className="bg-[#0E1510] border border-[#203223] rounded-2xl p-4 sm:p-5 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#142317] border border-[#00FF66]/30 flex items-center justify-center text-[#00FF66] shadow-neon-sm shrink-0">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-white">Gmail Farm Dispatch &amp; Inbox</h1>
              <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="w-3 h-3" />
                Connected
              </span>
            </div>
            <p className="text-xs text-stone-400 mt-0.5">
              Account: <span className="text-stone-200 font-mono font-medium">{profile?.emailAddress || currentUserEmail}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Quick Plant Report Dispatch */}
          {plants.length > 0 && (
            <div className="relative">
              <select
                onChange={(e) => {
                  const p = plants.find((item) => item.id === e.target.value);
                  if (p) {
                    setSelectedPlantForEmail(p);
                    setIsComposeOpen(true);
                  }
                  e.target.value = '';
                }}
                defaultValue=""
                className="bg-[#142116] border border-[#223526] hover:border-[#00FF66]/50 rounded-xl px-3 py-2 text-xs font-semibold text-[#00FF66] transition-colors cursor-pointer"
              >
                <option value="" disabled>
                  📤 Email Crop Report...
                </option>
                {plants.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.plantName} — {p.currentDisease} ({p.currentSeverity})
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={() => {
              setSelectedPlantForEmail(null);
              setIsComposeOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#00FF66] text-[#0A0E0B] hover:bg-[#33FF85] shadow-neon-sm transition-all cursor-pointer"
          >
            <SendHorizontal className="w-3.5 h-3.5" />
            <span>Compose Mail</span>
          </button>
        </div>
      </div>

      {/* Main Mail View (Sidebar + Content/Detail) */}
      <div className="bg-[#0C120D] border border-[#1E2E20] rounded-2xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-12 min-h-[580px]">
        {/* Left Column / Folder Tabs & Message List */}
        <div className="md:col-span-5 border-r border-[#1B291D] flex flex-col bg-[#0A0F0B]">
          {/* Search & Filter Header */}
          <div className="p-3.5 border-b border-[#18251A] space-y-3">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && loadMessages()}
                  placeholder="Search Gmail messages..."
                  className="w-full bg-[#121A14] border border-[#223124] focus:border-[#00FF66] rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-stone-600 transition-all"
                />
              </div>
              <button
                onClick={loadMessages}
                disabled={isLoadingMessages}
                title="Refresh messages"
                className="p-2 rounded-xl bg-[#121A14] border border-[#223124] hover:bg-[#1A261D] text-stone-300 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingMessages ? 'animate-spin text-[#00FF66]' : ''}`} />
              </button>
            </div>

            {/* Folder switch buttons */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  setActiveFolder('INBOX');
                  setSelectedMessage(null);
                }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeFolder === 'INBOX'
                    ? 'bg-[#182B1C] text-[#00FF66] border border-[#00FF66]/30'
                    : 'text-stone-400 hover:text-white hover:bg-[#121A14]'
                }`}
              >
                <Inbox className="w-3.5 h-3.5" />
                <span>Inbox</span>
              </button>
              <button
                onClick={() => {
                  setActiveFolder('SENT');
                  setSelectedMessage(null);
                }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeFolder === 'SENT'
                    ? 'bg-[#182B1C] text-[#00FF66] border border-[#00FF66]/30'
                    : 'text-stone-400 hover:text-white hover:bg-[#121A14]'
                }`}
              >
                <SendHorizontal className="w-3.5 h-3.5" />
                <span>Sent</span>
              </button>
              <button
                onClick={() => {
                  setActiveFolder('ALL');
                  setSelectedMessage(null);
                }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeFolder === 'ALL'
                    ? 'bg-[#182B1C] text-[#00FF66] border border-[#00FF66]/30'
                    : 'text-stone-400 hover:text-white hover:bg-[#121A14]'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>All Mail</span>
              </button>
            </div>
          </div>

          {/* Message List */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#152017]">
            {isLoadingMessages ? (
              <div className="p-8 text-center text-xs text-stone-500 space-y-2">
                <div className="w-6 h-6 border-2 border-[#00FF66] border-t-transparent rounded-full animate-spin mx-auto" />
                <p>Retrieving Gmail messages...</p>
              </div>
            ) : error ? (
              <div className="p-6 text-center text-xs text-rose-400 space-y-2">
                <AlertCircle className="w-6 h-6 mx-auto text-rose-500" />
                <p>{error}</p>
                <button
                  onClick={loadMessages}
                  className="px-3 py-1 bg-[#1A261D] text-white rounded-lg text-xs hover:bg-[#233526] transition-colors cursor-pointer"
                >
                  Retry
                </button>
              </div>
            ) : messages.length === 0 ? (
              <div className="p-8 text-center text-xs text-stone-500 space-y-2">
                <Inbox className="w-8 h-8 text-stone-600 mx-auto" />
                <p>No messages found in this folder</p>
              </div>
            ) : (
              messages.map((msg) => {
                const isSelected = selectedMessage?.id === msg.id;
                return (
                  <div
                    key={msg.id}
                    onClick={() => handleSelectMessage(msg)}
                    className={`p-3.5 transition-colors cursor-pointer relative ${
                      isSelected
                        ? 'bg-[#142317] border-l-2 border-[#00FF66]'
                        : 'hover:bg-[#111A13]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span
                        className={`text-xs font-semibold truncate ${
                          msg.isUnread ? 'text-white font-bold' : 'text-stone-300'
                        }`}
                      >
                        {msg.from.replace(/<.*>/, '').trim() || msg.from}
                      </span>
                      <span className="text-[10px] text-stone-500 whitespace-nowrap">
                        {msg.date ? new Date(msg.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : ''}
                      </span>
                    </div>

                    <div
                      className={`text-xs truncate mb-1 ${
                        msg.isUnread ? 'text-[#00FF66] font-semibold' : 'text-stone-300'
                      }`}
                    >
                      {msg.subject}
                    </div>

                    <p className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed">
                      {msg.snippet}
                    </p>

                    {msg.isUnread && (
                      <span className="inline-block w-2 h-2 rounded-full bg-[#00FF66] absolute right-2 bottom-3" />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column / Message Detail Viewer */}
        <div className="md:col-span-7 flex flex-col bg-[#0D140F]">
          {isLoadingDetail ? (
            <div className="flex-1 flex flex-col items-center justify-center text-xs text-stone-400 p-8 space-y-2">
              <div className="w-7 h-7 border-2 border-[#00FF66] border-t-transparent rounded-full animate-spin" />
              <p>Loading email content...</p>
            </div>
          ) : selectedMessage ? (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Detail Header */}
              <div className="p-5 border-b border-[#1A281E] bg-[#101912] space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-sm sm:text-base font-bold text-white leading-snug">
                    {selectedMessage.subject}
                  </h2>
                  <button
                    onClick={() => {
                      setSelectedPlantForEmail(null);
                      setIsComposeOpen(true);
                    }}
                    className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-[#18271C] text-[#00FF66] hover:bg-[#203525] border border-[#00FF66]/30 transition-colors cursor-pointer shrink-0"
                  >
                    <Send className="w-3 h-3" />
                    <span>Reply</span>
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-stone-400">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#18291B] border border-[#223526] flex items-center justify-center text-stone-300">
                      <UserIcon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-stone-200 font-medium">
                        {selectedMessage.from}
                      </div>
                      <div className="text-[10px] text-stone-500">
                        To: {selectedMessage.to}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-stone-500">
                    <Clock className="w-3 h-3" />
                    <span>{selectedMessage.date}</span>
                  </div>
                </div>
              </div>

              {/* Detail Body */}
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 text-xs text-stone-200 leading-relaxed">
                {selectedMessage.bodyHtml ? (
                  <div
                    className="gmail-rendered-body prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: selectedMessage.bodyHtml }}
                  />
                ) : (
                  <pre className="whitespace-pre-wrap font-sans text-xs text-stone-300 leading-relaxed">
                    {selectedMessage.bodyText || selectedMessage.snippet}
                  </pre>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-stone-500">
              <Mail className="w-12 h-12 mb-3 stroke-1 text-stone-600" />
              <p className="text-xs text-stone-400 font-medium">Select an email to view full conversation</p>
              <p className="text-[11px] text-stone-600 mt-1 max-w-xs">
                You can also compose new diagnostic reports directly to agricultural extension agents.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Compose Modal */}
      <GmailComposeModal
        isOpen={isComposeOpen}
        onClose={() => setIsComposeOpen(false)}
        token={accessToken}
        onRequireAuth={onRequireAuth}
        senderEmail={profile?.emailAddress || currentUserEmail || ''}
        senderName={currentUserName || 'Farmer'}
        initialPlant={selectedPlantForEmail}
        onSuccess={() => {
          loadMessages();
        }}
      />
    </div>
  );
};
