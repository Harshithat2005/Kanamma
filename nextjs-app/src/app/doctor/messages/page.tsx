'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLanguage } from '../components/LanguageContext';
import { useDoctorData } from '../components/DoctorDataContext';
import {
  Send,
  CheckCheck
} from 'lucide-react';

function CommunicationChat() {
  const { t } = useLanguage();
  const { messages, sendMessage } = useDoctorData();
  const searchParams = useSearchParams();

  // Selected thread recipient state
  const queryRecipient = searchParams.get('recipient') || 'Meena R';
  const [activeRecipient, setActiveRecipient] = useState(queryRecipient);
  const [inputText, setInputText] = useState('');

  // Sync recipient if query changes
  useEffect(() => {
    if (queryRecipient) {
      setActiveRecipient(queryRecipient);
    }
  }, [queryRecipient]);

  // Unique list of recipients
  const threads = [
    { name: 'Meena R', type: 'asha', desc: 'ASHA worker (Hosur Village)' },
    { name: 'Sarala Devi', type: 'asha', desc: 'ASHA worker (Ramapura Village)' },
    { name: 'Radha Gowda', type: 'asha', desc: 'ASHA worker (Kanakapura Village)' },
    { name: 'Nelamangala Hub Admin', type: 'anc', desc: 'ANC clinic administrator' }
  ];

  // Selected recipient detail
  const currentRecipient = threads.find((t) => t.name === activeRecipient) || threads[0];

  // Filter messages for selected recipient
  const threadMessages = messages.filter(
    (m) => m.recipientName === currentRecipient.name
  );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(
      currentRecipient.name.toLowerCase().replace(' ', ''),
      currentRecipient.name,
      currentRecipient.type as 'asha' | 'anc',
      inputText.trim()
    );
    setInputText('');
  };

  // Quick message template action
  const sendTemplate = (text: string) => {
    sendMessage(
      currentRecipient.name.toLowerCase().replace(' ', ''),
      currentRecipient.name,
      currentRecipient.type as 'asha' | 'anc',
      text
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-[#2A1525] tracking-tight">
          {t('messages')}
        </h1>
        <p className="text-sm text-[#2A1525]/60 font-sans font-medium mt-1">
          Coordinate care instructions directly with ASHA field workers and ANC administrative hubs
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start h-[550px]">
        {/* Left Column: Thread List */}
        <div className="bg-[#FFFFFF] border border-[#C8877A]/10 rounded-xl shadow-sm h-full overflow-y-auto flex flex-col">
          <div className="p-4 border-b border-[#C8877A]/10 bg-[#FEFAF8]">
            <h4 className="font-serif font-bold text-[#2A1525]">Active Liaison Channels</h4>
            <span className="text-[10px] text-[#2A1525]/50 font-bold uppercase tracking-wider block mt-0.5">
              Coordination Contacts
            </span>
          </div>

          <div className="divide-y divide-[#C8877A]/5 flex-1 overflow-y-auto">
            {threads.map((item) => {
              const active = item.name === activeRecipient;
              const lastMsg = messages
                .filter((m) => m.recipientName === item.name)
                .slice(-1)[0];

              return (
                <button
                  key={item.name}
                  onClick={() => setActiveRecipient(item.name)}
                  className={`w-full text-left p-4 transition flex items-center space-x-3 ${
                    active ? 'bg-[#C8877A]/10 border-l-4 border-[#C8877A]' : 'hover:bg-[#FEFAF8]/40'
                  }`}
                >
                  <div className={`h-9 w-9 rounded-full flex items-center justify-center border font-bold text-xs ${
                    item.type === 'asha'
                      ? 'bg-rose-50 text-[#C8877A] border-[#C8877A]/20'
                      : 'bg-lavender-50 text-[#C4A8D4] border-[#C4A8D4]/20'
                  }`}>
                    {item.name.split(' ').map((n) => n[0]).join('')}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#2A1525] truncate">
                        {item.name}
                      </span>
                      <span className="text-[9px] uppercase text-[#2A1525]/50 font-bold tracking-wider">
                        {item.type}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#2A1525]/60 truncate mt-0.5">
                      {lastMsg ? lastMsg.content : item.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Chat window */}
        <div className="lg:col-span-2 bg-[#FFFFFF] border border-[#C8877A]/10 rounded-xl shadow-sm h-full overflow-hidden flex flex-col">
          {/* Header Info */}
          <div className="p-4 border-b border-[#C8877A]/10 bg-[#FEFAF8] flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-full bg-[#C8877A]/15 border border-[#C8877A]/30 flex items-center justify-center font-bold text-xs text-[#C8877A]">
                {currentRecipient.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div>
                <h4 className="font-serif font-bold text-xs text-[#2A1525]">
                  {currentRecipient.name}
                </h4>
                <p className="text-[9px] text-[#2A1525]/50 font-semibold uppercase">
                  {currentRecipient.type === 'asha' ? 'ASHA field companion worker' : 'ANC clinic partner'}
                </p>
              </div>
            </div>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FEFAF8]/30">
            {threadMessages.map((msg) => {
              const isDoctor = msg.sender === 'doctor';
              return (
                <div
                  key={msg.id}
                  className={`flex ${isDoctor ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs md:max-w-md rounded-xl p-3.5 text-xs shadow-sm space-y-1.5 ${
                    isDoctor
                      ? 'bg-[#2A1525] text-white rounded-br-none'
                      : 'bg-white border border-[#C8877A]/15 text-[#2A1525] rounded-bl-none'
                  }`}>
                    <p className="font-medium leading-relaxed">{msg.content}</p>
                    <div className="flex items-center justify-end space-x-1 text-[8px] opacity-75">
                      <span>{msg.timestamp}</span>
                      {isDoctor && <CheckCheck className="h-3 w-3 text-emerald-400" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick clinical template buttons */}
          <div className="p-3 border-t border-[#C8877A]/10 bg-white flex flex-wrap gap-2">
            <button
              onClick={() => sendTemplate('Please verify patient diet and check if they are taking Labetalol regular.')}
              className="px-2.5 py-1.5 border border-[#C8877A]/20 bg-[#FEFAF8] text-[10px] text-[#2A1525]/75 font-semibold hover:border-[#C8877A] rounded-lg transition"
            >
              Verify Drug Compliance
            </button>
            <button
              onClick={() => sendTemplate('Requesting urgent repeat Hemoglobin lab scan tests on next scheduled checkup.')}
              className="px-2.5 py-1.5 border border-[#C8877A]/20 bg-[#FEFAF8] text-[10px] text-[#2A1525]/75 font-semibold hover:border-[#C8877A] rounded-lg transition"
            >
              Request Repeat Lab Test
            </button>
            <button
              onClick={() => sendTemplate('Urgent: BP levels high. Ensure mother checks into Hub clinics within 24 hours.')}
              className="px-2.5 py-1.5 border border-red-200 bg-red-50 text-[10px] text-red-700 font-semibold hover:bg-red-100 rounded-lg transition"
            >
              Escalate BP Alert
            </button>
          </div>

          {/* Message Input form */}
          <form onSubmit={handleSend} className="p-4 border-t border-[#C8877A]/10 bg-white flex space-x-2">
            <input
              type="text"
              placeholder="Type clinical coordination message to escort worker..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-[#FEFAF8] text-xs p-3 border border-[#C8877A]/20 focus:outline-none focus:border-[#C8877A] rounded-lg"
            />
            <button
              type="submit"
              className="p-3 bg-[#2A1525] hover:bg-[#2A1525]/90 text-white rounded-lg transition"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function CommunicationMessages() {
  return (
    <Suspense fallback={<div className="text-center py-12 text-sm text-[#2A1525]/60">Loading liaison messages...</div>}>
      <CommunicationChat />
    </Suspense>
  );
}
