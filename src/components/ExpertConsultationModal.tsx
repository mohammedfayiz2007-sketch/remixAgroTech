import React, { useState } from 'react';
import {
  X,
  UserCheck,
  CheckCircle,
  Send,
} from 'lucide-react';
import { ExpertConsultation, PlantScan, UserSession } from '../types';
import { TOMATO_EARLY_BLIGHT_IMAGE, EXPERT_AVATAR_IMAGE } from '../data/plantImages';

interface ExpertConsultationModalProps {
  userSession: UserSession;
  activeScan?: PlantScan | null;
  consultations: ExpertConsultation[];
  onSubmitConsultation: (consultation: Omit<ExpertConsultation, 'id' | 'timestamp' | 'status'>) => void;
  onClose: () => void;
}

export const ExpertConsultationModal: React.FC<ExpertConsultationModalProps> = ({
  userSession,
  activeScan,
  consultations,
  onSubmitConsultation,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'new' | 'history'>('new');
  const [plantName, setPlantName] = useState(activeScan?.plant || 'Tomato');
  const [cropType, setCropType] = useState(activeScan?.cropType || 'Solanaceae');
  const [detectedDisease, setDetectedDisease] = useState(activeScan?.disease || 'Early Blight');
  const [symptoms, setSymptoms] = useState(
    activeScan?.symptoms?.join(', ') || 'Concentric dark spots on lowest foliage with faint yellow halo'
  );
  const [location, setLocation] = useState(userSession.location || 'Nashik Agricultural Valley, Maharashtra, India');
  const [question, setQuestion] = useState('Can you verify this AI prediction and confirm if pruning alone is sufficient at Stage 2?');
  const [imageUrl] = useState<string>(activeScan?.imageUrl || TOMATO_EARLY_BLIGHT_IMAGE);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [ticketId, setTicketId] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `EXP-${Math.floor(1000 + Math.random() * 9000)}`;
    setTicketId(id);

    onSubmitConsultation({
      plantName,
      cropType,
      detectedDisease,
      symptoms,
      location,
      question,
      imageUrl,
    });

    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#0D120E] text-stone-100 rounded-2xl border border-[#00FF66]/30 shadow-neon max-w-xl w-full my-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-[#080B09] px-6 py-5 text-white flex items-center justify-between border-b border-[#1E2C20]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#141F16] border border-[#00FF66]/40 flex items-center justify-center shadow-neon-sm">
              <UserCheck className="w-5 h-5 text-[#00FF66]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Ask an Agriculture Expert</h2>
              <p className="text-xs text-[#00FF66]">
                Independent foliar verification by certified agricultural advisors
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-[#1A261D]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-[#1C281E] bg-[#101712] px-6 pt-3">
          <button
            onClick={() => {
              setActiveTab('new');
              setIsSubmitted(false);
            }}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'new'
                ? 'border-[#00FF66] text-[#00FF66]'
                : 'border-transparent text-stone-400 hover:text-white'
            }`}
          >
            New Case Submission
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'history'
                ? 'border-[#00FF66] text-[#00FF66]'
                : 'border-transparent text-stone-400 hover:text-white'
            }`}
          >
            Consultation History ({consultations.length})
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'new' ? (
            isSubmitted ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-[#00FF66]/10 border border-[#00FF66] text-[#00FF66] flex items-center justify-center mx-auto shadow-neon">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-white">
                  Consultation Request Submitted
                </h3>
                <div className="bg-[#121A13] p-3 rounded-xl border border-[#202E22] text-xs text-stone-300 max-w-sm mx-auto">
                  <div className="font-mono font-bold text-[#00FF66] mb-1">
                    Ticket Ref: #{ticketId}
                  </div>
                  <p>
                    Your leaf sample and questions have been queued for independent agronomic pathology review.
                    Typical response turnaround is 2 to 4 business hours.
                  </p>
                </div>
                <div className="pt-2 flex justify-center gap-3">
                  <button
                    onClick={() => setActiveTab('history')}
                    className="px-5 py-2.5 rounded-xl bg-[#00FF66] text-[#0A0D0A] text-xs font-bold hover:bg-[#33FF85] shadow-neon-sm cursor-pointer"
                  >
                    View Reviewed Cases
                  </button>
                  <button
                    onClick={onClose}
                    className="px-4 py-2.5 rounded-xl border border-[#2B3D2F] text-stone-300 text-xs font-semibold hover:bg-[#162118]"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#121A13] border border-[#202E22]">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-black shrink-0 border border-[#00FF66]/30">
                    <img
                      src={imageUrl || TOMATO_EARLY_BLIGHT_IMAGE}
                      alt="Consultation specimen"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = TOMATO_EARLY_BLIGHT_IMAGE;
                      }}
                    />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-stone-400">Specimen Leaf Attached</span>
                    <div className="font-bold text-white text-sm">{plantName} · {detectedDisease}</div>
                    <span className="text-stone-400 text-[11px]">Region: {location}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-300 mb-1">Crop / Variety</label>
                    <input
                      type="text"
                      required
                      value={plantName}
                      onChange={(e) => setPlantName(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-[#2B3D2F] bg-[#141C15] text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-300 mb-1">AI Detected Condition</label>
                    <input
                      type="text"
                      required
                      value={detectedDisease}
                      onChange={(e) => setDetectedDisease(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-[#2B3D2F] bg-[#141C15] text-white text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-stone-300 mb-1">Observable Leaf Symptoms</label>
                  <input
                    type="text"
                    required
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    placeholder="e.g. Ringed brown lesions, yellow margins..."
                    className="w-full px-3 py-2 rounded-lg border border-[#2B3D2F] bg-[#141C15] text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-300 mb-1">Your Question for the Expert</label>
                  <textarea
                    required
                    rows={3}
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="e.g. Can you verify this AI prediction? Do you recommend bio-fungicide or sanitation?"
                    className="w-full px-3 py-2 rounded-lg border border-[#2B3D2F] bg-[#141C15] text-white text-xs focus:outline-none focus:border-[#00FF66]"
                  />
                </div>

                <div className="p-2.5 rounded-lg bg-[#141F16] text-[11px] text-stone-300 border border-[#00FF66]/30">
                  Note: Expert evaluations are provided as agricultural decision support. Always adhere to local state pesticide regulatory standards.
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl text-stone-400 hover:text-white text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="h-10 px-5 rounded-xl bg-[#00FF66] text-[#0A0D0A] text-xs font-bold hover:bg-[#33FF85] transition-all flex items-center gap-1.5 shadow-neon-sm cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Submit for Expert Review</span>
                  </button>
                </div>
              </form>
            )
          ) : (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              {consultations.length === 0 ? (
                <p className="text-xs text-stone-400 text-center py-8">
                  No previous consultation records yet.
                </p>
              ) : (
                consultations.map((c) => (
                  <div
                    key={c.id}
                    className="p-4 rounded-xl border border-[#202E22] bg-[#111712] space-y-3 text-xs"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-mono text-[10px] text-stone-500 font-bold">
                          #{c.id} · {c.timestamp}
                        </div>
                        <h4 className="font-bold text-white text-sm mt-0.5">
                          {c.plantName} — {c.detectedDisease}
                        </h4>
                      </div>
                      <span className="text-[10px] font-bold bg-[#00FF66]/10 text-[#00FF66] border border-[#00FF66]/30 px-2 py-0.5 rounded">
                        ✓ {c.status}
                      </span>
                    </div>

                    <div className="text-stone-300">
                      <strong className="text-white">Grower Question:</strong> “{c.question}”
                    </div>

                    {c.expertResponse && (
                      <div className="p-3 bg-[#0A0E0B] rounded-lg border border-[#1E2B20] space-y-2">
                        <div className="flex items-center gap-3">
                          <img
                            src={EXPERT_AVATAR_IMAGE}
                            alt={c.expertResponse.expertName}
                            className="w-10 h-10 rounded-full object-cover border border-[#00FF66]/50 shadow-neon-sm shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <span className="font-bold text-white text-sm">
                              {c.expertResponse.expertName}
                            </span>
                            <span className="text-[10px] text-stone-400 block">
                              {c.expertResponse.credentials} · {c.expertResponse.institution}
                            </span>
                          </div>
                        </div>

                        <p className="text-stone-300 leading-relaxed">
                          {c.expertResponse.answer}
                        </p>

                        <div className="pt-1">
                          <strong className="text-[#00FF66] text-[11px] block mb-1">
                            Recommended Cultural Measures:
                          </strong>
                          <ul className="list-disc pl-4 space-y-0.5 text-stone-300 text-[11px]">
                            {c.expertResponse.recommendedCulturalPractices.map((prac, i) => (
                              <li key={i}>{prac}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
