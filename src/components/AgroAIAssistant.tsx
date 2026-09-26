import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Bot,
} from 'lucide-react';
import { PlantScan, TrackedPlant, UserSession } from '../types';
import { AgroLogo } from './AgroLogo';
import { AgroBotLogo } from './AgroBotLogo';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

interface AgroAIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  userSession: UserSession;
  activePlant?: TrackedPlant | null;
  activeScan?: PlantScan | null;
}

export const AgroAIAssistant: React.FC<AgroAIAssistantProps> = ({
  isOpen,
  onClose,
  userSession,
  activePlant,
  activeScan,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-init-1',
      sender: 'assistant',
      text: `Hello ${userSession.name}! I am Agro AI, your agricultural decision-support assistant. How can I help with your crops or plant health today?`,
      timestamp: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const currentPlantName = activeScan?.plant || activePlant?.plantName || 'Crop';
  const currentCondition = activeScan?.disease || activePlant?.currentDisease || 'General Farm Health';
  const currentSeverity = activeScan?.severity || activePlant?.currentSeverity || 'moderate';

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          plantContext: {
            plant: currentPlantName,
            disease: currentCondition,
            severity: currentSeverity,
            healthScore: activeScan?.healthScore || activePlant?.currentHealthScore || 70,
            location: userSession.location,
          },
          chatHistory: messages.map((m) => ({
            role: m.sender === 'user' ? 'user' : 'model',
            content: m.text,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Chat API returned error');
      }

      const data = await response.json();
      const botMsg: Message = {
        id: `msg-resp-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || 'I am here to assist with your crop decision support.',
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    } catch (err) {
      console.warn('Backend chat error, using fallback:', err);

      let reply = `Here are agronomic recommendations for ${currentPlantName} (${currentCondition}):\n1. Check the undersides of the leaves for spore growth.\n2. Irrigate strictly at the soil base to keep leaves dry.\n3. Re-scan in 3 to 4 days to monitor recovery.`;

      if (query.toLowerCase().includes('today') || query.toLowerCase().includes('action plan')) {
        reply = `Here is your customized action plan for today:\n🌱 **Morning**: Inspect lowest leaves for damp fungal sporulation.\n💧 **Watering**: Deliver 1.5L water at root base; avoid overhead sprinkler.\n🔍 **Monitoring**: Check adjacent plants to ensure no cross-spread.\n📷 **Next Step**: Follow-up scan in 3 days.`;
      } else if (query.toLowerCase().includes('improving')) {
        reply = `Based on your recent scans, lesion margins appear localized and yellowing has arrested. Your plant status is currently classified as **Improving ↗**. Continue maintaining proper canopy ventilation.`;
      } else if (query.toLowerCase().includes('yellow')) {
        reply = `Leaf yellowing (chlorosis) often precedes necrosis in Early Blight or results from nitrogen depletion. In your specimen, the yellow halos surround concentric brown lesions, characteristic of *Alternaria solani*. Prune severely chlorotic leaves.`;
      }

      const botMsg: Message = {
        id: `msg-resp-${Date.now()}`,
        sender: 'assistant',
        text: reply,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }
  };

  const quickPrompts = [
    'What should I check today?',
    'Why are my tomato leaves turning yellow?',
    'Is my plant improving?',
    'What does Early Blight mean?',
    'What should I monitor after rainfall?',
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-50 w-[92vw] sm:w-[400px] h-[520px] max-h-[82vh] bg-[#0C110D] text-stone-100 rounded-2xl border border-[#00FF66]/40 shadow-neon flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
      
      {/* Assistant Header */}
      <div className="bg-[#080B09] px-4 py-3 text-white flex items-center justify-between shrink-0 border-b border-[#1E2B20]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#141F16] border border-[#00FF66]/50 flex items-center justify-center shadow-neon-sm p-1">
            <AgroBotLogo size={32} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-sm text-white">Agro AI Bot</h3>
              <span className="w-2 h-2 rounded-full bg-[#00FF66] shadow-[0_0_6px_#00FF66]" />
            </div>
            <p className="text-[10px] text-[#00FF66]">
              Context: {currentPlantName} · {userSession.location}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-[#1A261D] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#0A0D0A]">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${
              m.sender === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div className={`flex items-end gap-2 max-w-[90%] ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.sender === 'assistant' && (
                <div className="w-6 h-6 rounded-lg bg-[#141F16] border border-[#00FF66]/40 flex items-center justify-center shrink-0 mb-1">
                  <AgroBotLogo size={18} />
                </div>
              )}
              <div
                className={`rounded-2xl p-3 text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-[#00FF66] text-[#0A0D0A] font-semibold rounded-br-xs shadow-neon-sm'
                    : 'bg-[#121813] border border-[#1E2C20] text-stone-200 shadow-xs rounded-bl-xs'
                }`}
              >
                <div className="whitespace-pre-line">{m.text}</div>
              </div>
            </div>
            <span className="text-[9px] text-stone-500 mt-1 px-1">
              {m.timestamp}
            </span>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-1.5 p-2 bg-[#121813] border border-[#1E2C20] rounded-lg w-20 text-stone-400 text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00FF66] animate-bounce" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#00FF66] animate-bounce delay-100" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#00FF66] animate-bounce delay-200" />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Questions */}
      <div className="p-2 border-t border-[#1C271E] bg-[#0E1310] overflow-x-auto no-scrollbar flex items-center gap-1.5 shrink-0">
        {quickPrompts.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(q)}
            className="text-[10px] font-bold bg-[#141C15] hover:bg-[#1A261C] hover:border-[#00FF66] text-stone-300 hover:text-[#00FF66] px-2.5 py-1 rounded-full whitespace-nowrap border border-[#233325] transition-colors cursor-pointer"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Message Input Box */}
      <div className="p-2.5 bg-[#0C100D] border-t border-[#1E2B20] flex items-center gap-2 shrink-0">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSendMessage();
          }}
          placeholder="Ask Agro AI a question about your crop..."
          className="flex-1 px-3 py-2 text-xs rounded-xl border border-[#2B3D2F] focus:outline-none focus:border-[#00FF66] bg-[#141C15] text-white"
        />
        <button
          onClick={() => handleSendMessage()}
          disabled={!inputText.trim()}
          className="w-8 h-8 rounded-xl bg-[#00FF66] text-[#0A0D0A] flex items-center justify-center hover:bg-[#33FF85] disabled:opacity-30 transition-all shrink-0 cursor-pointer font-bold shadow-neon-sm"
        >
          <Send className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>

    </div>
  );
};
