import React, { useState, useEffect } from 'react';
import { Mail, Send, X, FileText, CheckCircle2, AlertCircle, Eye, Edit3 } from 'lucide-react';
import { TrackedPlant } from '../types';
import { sendGmailMessage, buildPlantReportEmailTemplate } from '../services/gmailService';
import { GmailConfirmSendModal } from './GmailConfirmSendModal';

interface GmailComposeModalProps {
  isOpen: boolean;
  onClose: () => void;
  token: string | null;
  onRequireAuth: () => void;
  senderEmail: string;
  senderName: string;
  initialPlant?: TrackedPlant | null;
  onSuccess?: () => void;
}

const COMMON_RECIPIENTS = [
  { label: 'Nashik District Extension Office', email: 'extension-nashik@agri.gov.in' },
  { label: 'Krishi Vigyan Kendra (KVK)', email: 'kvk-horticulture@icar.gov.in' },
  { label: 'Maharashtra Agronomy Lab', email: 'plantpathology-lab@agrimaha.org' },
];

export const GmailComposeModal: React.FC<GmailComposeModalProps> = ({
  isOpen,
  onClose,
  token,
  onRequireAuth,
  senderEmail,
  senderName,
  initialPlant,
  onSuccess,
}) => {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [farmerNotes, setFarmerNotes] = useState('');
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendStatus, setSendStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Initialize content whenever modal opens or plant changes
  useEffect(() => {
    if (isOpen) {
      setSendStatus('idle');
      setErrorMessage('');
      setShowConfirm(false);

      if (initialPlant) {
        const template = buildPlantReportEmailTemplate({
          plant: initialPlant,
          senderName: senderName || 'Farmer',
          farmerNotes: '',
        });
        setSubject(template.subject);
        setFarmerNotes(
          `Requesting expert validation of foliar symptoms observed on ${initialPlant.plantName}. Please advise on biological containment regimen.`
        );
        setTo('extension-nashik@agri.gov.in');
      } else {
        setSubject('[AGRO] Crop Inquiry & Agronomic Advisory');
        setFarmerNotes('');
        setTo('');
      }
    }
  }, [isOpen, initialPlant, senderName]);

  if (!isOpen) return null;

  // Generate current HTML and text payload
  const currentPayload = initialPlant
    ? buildPlantReportEmailTemplate({
        plant: initialPlant,
        senderName: senderName || 'Farmer',
        farmerNotes,
      })
    : {
        subject,
        textBody: `${farmerNotes}\n\nSent via AGRO from ${senderName}`,
        htmlBody: `
          <div style="font-family: sans-serif; background-color: #0b110d; color: #e2e8f0; padding: 20px; border-radius: 10px;">
            <h2 style="color: #00ff66; margin-top: 0;">🌿 AGRO Crop Advisory Request</h2>
            <p style="white-space: pre-wrap; font-size: 14px; line-height: 1.6;">${farmerNotes.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>')}</p>
            <hr style="border: 0; border-top: 1px solid #233726; margin: 20px 0;">
            <p style="font-size: 12px; color: #94a3b8;">Sent by ${senderName} (${senderEmail}) via AGRO Platform.</p>
          </div>
        `,
      };

  const handleInitiateSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      onRequireAuth();
      return;
    }
    if (!to.trim()) {
      setErrorMessage('Please specify a recipient email address.');
      return;
    }
    if (!subject.trim()) {
      setErrorMessage('Please provide an email subject.');
      return;
    }

    setErrorMessage('');
    setShowConfirm(true);
  };

  const handleConfirmSend = async () => {
    if (!token) return;

    setIsSending(true);
    setErrorMessage('');
    try {
      await sendGmailMessage(token, {
        to: to.trim(),
        subject: subject.trim(),
        htmlBody: currentPayload.htmlBody,
        textBody: currentPayload.textBody,
      });

      setSendStatus('success');
      setShowConfirm(false);
      if (onSuccess) {
        onSuccess();
      }
      setTimeout(() => {
        onClose();
      }, 1800);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to dispatch email via Gmail API');
      setSendStatus('error');
      setShowConfirm(false);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div className="bg-[#0D140F] border border-[#223526] rounded-2xl max-w-2xl w-full shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#1C2C20] bg-[#111A13]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#18271C] border border-[#00FF66]/30 flex items-center justify-center text-[#00FF66]">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <span>Send via Gmail</span>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-[#182B1D] text-[#00FF66] border border-[#00FF66]/30">
                    Official API
                  </span>
                </h2>
                <p className="text-xs text-stone-400">
                  From: <span className="text-stone-200 font-mono">{senderEmail || 'Your Google Account'}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex bg-[#162219] p-0.5 rounded-lg border border-[#223526]">
                <button
                  type="button"
                  onClick={() => setActiveTab('edit')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'edit'
                      ? 'bg-[#00FF66] text-[#0A0D0A]'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Compose</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'preview'
                      ? 'bg-[#00FF66] text-[#0A0D0A]'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </button>
              </div>
              <button
                onClick={onClose}
                className="text-stone-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Status Notifications */}
          {sendStatus === 'success' && (
            <div className="bg-emerald-950/60 border-b border-emerald-500/40 p-3 px-6 flex items-center gap-2.5 text-emerald-300 text-xs animate-in slide-in-from-top duration-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Email dispatched successfully through your Gmail account!</span>
            </div>
          )}

          {errorMessage && (
            <div className="bg-rose-950/60 border-b border-rose-500/40 p-3 px-6 flex items-center gap-2.5 text-rose-300 text-xs animate-in slide-in-from-top duration-200">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form / Preview Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {activeTab === 'edit' ? (
              <form id="gmail-compose-form" onSubmit={handleInitiateSend} className="space-y-4">
                {/* To Recipient */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-stone-300">
                      Recipient Email (To) <span className="text-[#00FF66]">*</span>
                    </label>
                    <span className="text-[11px] text-stone-500">Official Agronomist / Extension</span>
                  </div>
                  <input
                    type="email"
                    required
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    placeholder="e.g. extension-officer@agri.gov.in"
                    className="w-full bg-[#121A14] border border-[#243527] focus:border-[#00FF66] focus:ring-1 focus:ring-[#00FF66] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-stone-600 transition-all font-mono"
                  />

                  {/* Quick recipient selector */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <span className="text-[10px] text-stone-500 self-center mr-1">Quick Select:</span>
                    {COMMON_RECIPIENTS.map((rec) => (
                      <button
                        type="button"
                        key={rec.email}
                        onClick={() => setTo(rec.email)}
                        className="text-[10px] bg-[#142016] hover:bg-[#1C2C1F] hover:text-[#00FF66] text-stone-300 border border-[#233526] px-2 py-0.5 rounded-md transition-colors cursor-pointer"
                      >
                        {rec.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="text-xs font-semibold text-stone-300 block mb-1.5">
                    Subject Line <span className="text-[#00FF66]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-[#121A14] border border-[#243527] focus:border-[#00FF66] focus:ring-1 focus:ring-[#00FF66] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-stone-600 transition-all"
                  />
                </div>

                {/* Plant Context Preview Banner */}
                {initialPlant && (
                  <div className="bg-[#142016] border border-[#223526] rounded-xl p-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#1C2C1E] flex items-center justify-center text-lg">
                        {initialPlant.icon || '🌱'}
                      </div>
                      <div>
                        <div className="font-bold text-white">
                          {initialPlant.plantName} — {initialPlant.currentDisease}
                        </div>
                        <div className="text-[11px] text-stone-400">
                          Health: {initialPlant.currentHealthScore}% • Status: {initialPlant.healthStatusLabel}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-[#00FF66] bg-[#00FF66]/10 border border-[#00FF66]/30 px-2 py-0.5 rounded-full">
                      Auto-attached Diagnostic Plan
                    </span>
                  </div>
                )}

                {/* Notes / Message Body */}
                <div>
                  <label className="text-xs font-semibold text-stone-300 block mb-1.5">
                    {initialPlant ? 'Farmer Observations & Specific Questions' : 'Message Body'}
                  </label>
                  <textarea
                    rows={4}
                    value={farmerNotes}
                    onChange={(e) => setFarmerNotes(e.target.value)}
                    placeholder={
                      initialPlant
                        ? 'Describe how long symptoms have persisted, recent rainfall, or specific chemical/bio-spray inquiries...'
                        : 'Type your message to the agronomy specialist...'
                    }
                    className="w-full bg-[#121A14] border border-[#243527] focus:border-[#00FF66] focus:ring-1 focus:ring-[#00FF66] rounded-xl p-3 text-xs text-white placeholder-stone-600 transition-all resize-none leading-relaxed"
                  />
                </div>
              </form>
            ) : (
              <div className="space-y-3">
                <div className="bg-[#0A100C] border border-[#1E2E21] rounded-xl p-4 text-xs">
                  <div className="text-[11px] text-stone-400 space-y-1 mb-3 pb-3 border-b border-[#1A261D]">
                    <div>
                      <span className="text-stone-500 font-bold uppercase text-[10px]">From: </span>
                      <span className="text-stone-300 font-mono">{senderEmail}</span>
                    </div>
                    <div>
                      <span className="text-stone-500 font-bold uppercase text-[10px]">To: </span>
                      <span className="text-[#00FF66] font-mono">{to || '(No recipient specified)'}</span>
                    </div>
                    <div>
                      <span className="text-stone-500 font-bold uppercase text-[10px]">Subject: </span>
                      <span className="text-white font-semibold">{subject}</span>
                    </div>
                  </div>

                  <div
                    className="rounded-lg overflow-hidden border border-[#223526]"
                    dangerouslySetInnerHTML={{ __html: currentPayload.htmlBody }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 border-t border-[#1C2C20] bg-[#111A13] flex items-center justify-between">
            <div className="text-[11px] text-stone-400 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-stone-500" />
              <span>Full RFC-822 format dispatch with sender verification</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-400 hover:text-white hover:bg-[#1A261D] transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                form="gmail-compose-form"
                disabled={isSending || sendStatus === 'success'}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#00FF66] text-[#080D09] hover:bg-[#33FF85] shadow-neon-sm transition-all cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Review &amp; Send</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <GmailConfirmSendModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirmSend}
        to={to}
        subject={subject}
        previewSummary={farmerNotes || `${initialPlant?.plantName || 'Crop'} health diagnostic summary`}
        isSending={isSending}
      />
    </>
  );
};
