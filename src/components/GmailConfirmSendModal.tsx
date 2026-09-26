import React from 'react';
import { AlertTriangle, Mail, Send, X } from 'lucide-react';

interface GmailConfirmSendModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  to: string;
  subject: string;
  previewSummary: string;
  isSending?: boolean;
}

export const GmailConfirmSendModal: React.FC<GmailConfirmSendModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  to,
  subject,
  previewSummary,
  isSending = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#0E1510] border border-[#243628] rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1C2A1F] bg-[#131D15]">
          <div className="flex items-center gap-2 text-amber-400">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <h3 className="font-bold text-sm text-white">Confirm Email Dispatch</h3>
          </div>
          <button
            onClick={onClose}
            disabled={isSending}
            className="text-stone-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 text-xs text-stone-300">
          <p className="leading-relaxed">
            You are about to dispatch an email from your authorized Gmail account. Please confirm the recipient and message details:
          </p>

          <div className="bg-[#080D09] rounded-xl border border-[#1A261D] p-3.5 space-y-2">
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-500 block">Recipient (To):</span>
              <span className="text-white font-mono text-xs font-semibold">{to}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-500 block">Subject:</span>
              <span className="text-stone-200 font-medium">{subject}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-500 block">Content Summary:</span>
              <p className="text-stone-400 line-clamp-2 text-[11px] italic">{previewSummary}</p>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-[11px] text-emerald-300 flex items-start gap-2">
            <Mail className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
            <span>
              This message will appear in your Gmail Sent mailbox and can be tracked directly from your Google account.
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-5 py-3.5 border-t border-[#1C2A1F] bg-[#111A13] flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            disabled={isSending}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-400 hover:text-white hover:bg-[#1C271E] transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isSending}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold bg-[#00FF66] text-[#080D09] hover:bg-[#33FF85] shadow-neon-sm transition-all cursor-pointer disabled:opacity-50"
          >
            {isSending ? (
              <span className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 border-2 border-[#080D09] border-t-transparent rounded-full animate-spin" />
                Sending...
              </span>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Confirm &amp; Send</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
