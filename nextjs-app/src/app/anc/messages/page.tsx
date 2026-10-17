'use client';

import React, { useState } from 'react';
import { useAncData } from '../components/AncDataContext';
import { useLanguage } from '../components/LanguageContext';
import { mockAshaWorkers } from '../data';
import { 
  Send, MessageSquare, Phone, MapPin, 
  Users, Megaphone, CheckCheck
} from 'lucide-react';

const messageTemplates = [
  { id: 'bp', title: 'BP Protocol Alert', text: 'URGENT: All mothers with gestational hypertension (BP > 135/85) require daily field vitals screening. Please log readings before 18:00.' },
  { id: 'iron', title: 'Hb Adherence Notice', text: 'PROTOCOL REMINDER: Verify oral iron supplement adherence (1 tablet daily post-food) for all registered moderately anemic mothers.' },
  { id: 'usg', title: 'USG Slot Allocation', text: 'SCHEDULING: Coordinate with mothers in trimester 1 (weeks 11-13) to register scan appointments at the Area Referral Hospital.' }
];

export default function AncMessages() {
  const { messages, sendMessage } = useAncData();
  const { t } = useLanguage();

  const [selectedAshaId, setSelectedAshaId] = useState(mockAshaWorkers[0].id);
  const [inputText, setInputText] = useState('');
  const [showBroadcastDropdown, setShowBroadcastDropdown] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Find active worker details
  const activeAsha = mockAshaWorkers.find(a => a.id === selectedAshaId) || mockAshaWorkers[0];

  // Filter messages for the current worker thread
  const threadMessages = messages.filter(msg => msg.ashaId === selectedAshaId);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    sendMessage(selectedAshaId, inputText.trim());
    setInputText('');
  };

  const handleSendTemplate = (templateText: string, target: 'single' | 'all') => {
    if (target === 'single') {
      sendMessage(selectedAshaId, templateText);
      setToast(`Template message sent to ${activeAsha.name}.`);
    } else {
      // Send to all ASHA workers
      mockAshaWorkers.forEach(worker => {
        sendMessage(worker.id, templateText);
      });
      setToast(`Global template broadcast sent to all ${mockAshaWorkers.length} ASHA workers.`);
    }
    
    setShowBroadcastDropdown(false);
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#1C0B18] border border-[#C8877A]/30 text-[#FEFAF8] px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-bold animate-fade-in">
          <CheckCheck className="w-4 h-4 text-green-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#2A1525] tracking-tight">
            {t('messages')}
          </h2>
          <p className="text-xs text-[#8A7A82] font-mono">
            Direct chat feed with ASHA field workers and group protocol template broadcasters.
          </p>
        </div>

        {/* Template Broadcast Trigger */}
        <div className="relative">
          <button
            onClick={() => setShowBroadcastDropdown(!showBroadcastDropdown)}
            className="w-full sm:w-auto bg-[#2A1525] hover:bg-[#1E0E1B] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-all"
          >
            <Megaphone className="w-4 h-4 text-[#C8877A]" />
            <span>Broadcast Template Warning</span>
          </button>

          {/* Broadcast Popover */}
          {showBroadcastDropdown && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-[#C8877A]/15 rounded-2xl shadow-xl z-30 p-4 space-y-3.5 animate-scale-in">
              <h4 className="text-[11px] font-bold text-[#2A1525] uppercase tracking-wider border-b border-[#C8877A]/10 pb-1.5">
                Select Dispatch Alert
              </h4>
              <div className="space-y-2.5">
                {messageTemplates.map(tmpl => (
                  <div key={tmpl.id} className="p-2.5 border border-[#C8877A]/10 hover:border-[#C8877A]/40 bg-[#FEFAF8] rounded-xl text-left space-y-1">
                    <span className="text-[10px] font-bold text-[#2A1525]">{tmpl.title}</span>
                    <p className="text-[9px] text-[#8A7A82] leading-relaxed italic">&quot;{tmpl.text}&quot;</p>
                    <div className="flex gap-2 justify-end pt-1.5">
                      <button
                        onClick={() => handleSendTemplate(tmpl.text, 'single')}
                        className="text-[9px] font-bold text-[#C8877A] hover:underline"
                      >
                        Send to Selected
                      </button>
                      <button
                        onClick={() => handleSendTemplate(tmpl.text, 'all')}
                        className="text-[9px] font-bold bg-[#C8877A] text-white px-2 py-0.5 rounded"
                      >
                        Broadcast All
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chat workspace grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-white border border-[#C8877A]/10 rounded-2xl overflow-hidden shadow-sm h-[580px]">
        
        {/* Left Side: ASHA Worker list (1/3 width) */}
        <div className="border-r border-[#C8877A]/10 flex flex-col h-full bg-[#FEFAF8]/30">
          <div className="p-4 border-b border-[#C8877A]/10 bg-[#FEFAF8] flex items-center gap-1.5">
            <Users className="w-4 h-4 text-[#C8877A]" />
            <h3 className="text-xs font-bold text-[#2A1525] uppercase tracking-wider">Field Workers Registry</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto divide-y divide-[#C8877A]/05">
            {mockAshaWorkers.map(worker => {
              const active = selectedAshaId === worker.id;
              const hasUnread = messages.some(m => m.ashaId === worker.id && m.sender === 'asha' && !m.read);

              return (
                <button
                  key={worker.id}
                  onClick={() => setSelectedAshaId(worker.id)}
                  className={`w-full text-left p-4 flex items-center justify-between transition-colors ${
                    active 
                      ? 'bg-[#C8877A]/10 border-l-2 border-l-[#C8877A]' 
                      : 'hover:bg-[#FEFAF8]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Status dot */}
                    <div className="relative">
                      <div className="w-10 h-10 rounded-xl bg-[#2A1525] flex items-center justify-center text-[#FEFAF8] font-bold text-xs">
                        {worker.avatarText}
                      </div>
                      <span className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                        worker.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                      }`} />
                    </div>
                    <div>
                      <span className="font-bold text-[#2A1525] text-xs block">{worker.name}</span>
                      <span className="text-[10px] text-[#8A7A82] font-mono flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {worker.village}
                      </span>
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end gap-1">
                    <span className="text-[9px] font-mono font-bold text-[#8A7A82] bg-white border border-[#C8877A]/10 px-1.5 py-0.5 rounded">
                      {worker.activeMothersCount} Mothers
                    </span>
                    {hasUnread && (
                      <span className="w-2.5 h-2.5 bg-[#C8877A] rounded-full" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Active Chat Window (2/3 width) */}
        <div className="lg:col-span-2 flex flex-col h-full bg-white">
          {/* Thread Header */}
          <div className="p-4 border-b border-[#C8877A]/10 bg-[#FEFAF8] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#C8877A]/15 border border-[#C8877A]/30 flex items-center justify-center text-[#C8877A] font-bold text-sm">
                {activeAsha.avatarText}
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#2A1525] block">{activeAsha.name}</h3>
                <span className="text-[10px] text-[#8A7A82] font-mono flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" /> {activeAsha.phone} • Village Sector: {activeAsha.village}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-green-50 text-green-700 text-[10px] font-bold px-2 py-1 rounded font-mono border border-green-200">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span>{activeAsha.status.toUpperCase()}</span>
            </div>
          </div>

          {/* Chat Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FEFAF8]/10 scrollbar-thin">
            {threadMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-[#8A7A82] p-8">
                <MessageSquare className="w-8 h-8 text-[#C8877A] opacity-50 mb-2" />
                <p className="text-xs font-bold text-[#2A1525]">Liaison Feed Initialized</p>
                <p className="text-[10px]">No active clinical logs. Send a reminder or broadcast to dispatch field checkins.</p>
              </div>
            ) : (
              threadMessages.map((msg) => {
                const isClinic = msg.sender === 'clinic';
                return (
                  <div 
                    key={msg.id} 
                    className={`flex ${isClinic ? 'justify-end' : 'justify-start'} animate-fade-in`}
                  >
                    <div className={`max-w-[80%] space-y-1 ${isClinic ? 'order-2' : ''}`}>
                      <div 
                        className={`p-3 rounded-2xl text-xs leading-relaxed ${
                          isClinic 
                            ? 'bg-[#1C0B18] text-[#FEFAF8] rounded-tr-none' 
                            : 'bg-[#FEFAF8] text-[#2A1525] border border-[#C8877A]/15 rounded-tl-none'
                        }`}
                      >
                        {msg.content}
                      </div>
                      <span className="block text-[8px] font-mono text-[#8A7A82] text-right">
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Send Input Form */}
          <form onSubmit={handleSend} className="p-3 bg-[#FEFAF8] border-t border-[#C8877A]/10 flex gap-2">
            <input
              type="text"
              placeholder={`Send message to ASHA worker ${activeAsha.name}...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-white border border-[#C8877A]/15 text-[#2A1525] text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-[#C8877A] shadow-inner"
            />
            <button
              type="submit"
              className="bg-[#C8877A] hover:bg-[#B7776A] text-white p-2.5 rounded-xl shadow-sm transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
