'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Send,
  Mic,
  Calendar,
  AlertCircle,
  Pill,
  Volume2,
  CheckCircle,
  X,
  Loader2
} from 'lucide-react';
import AshaShell from '../components/AshaShell';
import { useLanguage } from '../components/LanguageContext';
import { useOffline } from '../components/OfflineContext';
import Waveform from '../components/Waveform';

interface ChatMessage {
  id: string;
  sender: 'asha' | 'mother' | 'system';
  text: string;
  timestamp: string;
  isVoice?: boolean;
  duration?: string;
  language?: string;
}

export default function AshaMessages() {
  const { lang } = useLanguage();
  const { offlineMothers } = useOffline();

  // Search & active selection
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChatId, setSelectedChatId] = useState<string>('m1');

  // Simulated Chat Databases
  const [chats, setChats] = useState<Record<string, ChatMessage[]>>({
    m1: [
      { id: '1', sender: 'system', text: 'System: Smart Ring connected to Priya\'s profile.', timestamp: 'Mon, 10:00 AM' },
      { id: '2', sender: 'asha', text: 'Namaste Priya, your sleep logs are slightly low this week. Please try to get 8 hours of rest.', timestamp: 'Mon, 10:15 AM' },
      { id: '3', sender: 'mother', text: 'Ji didi, I will try to rest more in the afternoon.', timestamp: 'Mon, 10:45 AM' },
      { id: '4', sender: 'system', text: 'Alert: Scheduled ANC check-up tomorrow at Hosur PHC.', timestamp: 'Yesterday, 06:00 PM' }
    ],
    m2: [
      { id: '1', sender: 'system', text: 'CRITICAL ALERT: Extreme Hypertension detected by ring.', timestamp: 'Today, 07:15 PM' },
      { id: '2', sender: 'asha', text: 'Sujata, please sit down and stay calm. Ambulance 108 is dispatched and on the way.', timestamp: 'Today, 07:16 PM' },
      { id: '3', sender: 'mother', text: 'Didi I am very scared, the headache is worsening.', timestamp: 'Today, 07:17 PM' }
    ],
    m3: [
      { id: '1', sender: 'system', text: 'System: Normal pregnancy progression tracked.', timestamp: 'May 15, 09:00 AM' },
      { id: '2', sender: 'asha', text: 'Amanya, please confirm if you have taken your Calcium supplement today.', timestamp: 'May 16, 02:00 PM' },
      { id: '3', sender: 'mother', text: 'Yes didi, completed at lunchtime.', timestamp: 'May 16, 02:15 PM' }
    ],
    m4: [
      { id: '1', sender: 'asha', text: 'Kavitha, your ring has not synced for 12 hours. Is it charging?', timestamp: 'Yesterday, 11:00 AM' },
      { id: '2', sender: 'system', text: 'Alert: 3 Iron Supplements missed this week.', timestamp: 'Yesterday, 08:00 PM' }
    ],
    m5: [
      { id: '1', sender: 'system', text: 'Alert: Fasting Blood Sugar registered 142 mg/dL.', timestamp: 'Today, 08:00 AM' },
      { id: '2', sender: 'asha', text: 'Radha, please do not skip your Metformin dose. I have scheduled a glucose log test for this afternoon.', timestamp: 'Today, 09:30 AM' }
    ]
  });

  // Typing state
  const [typedMessage, setTypedMessage] = useState('');

  // Voice recording states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingState, setRecordingState] = useState<'idle' | 'listening' | 'processing' | 'success'>('idle');
  const [voiceConfidence, setVoiceConfidence] = useState<number | null>(null);
  const [recordedTranscript, setRecordedTranscript] = useState('');
  const recordedDuration = '0:08';

  // Filtered mothers list based on search
  const filteredMothers = offlineMothers.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.village.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeMother = offlineMothers.find((m) => m.id === selectedChatId) || offlineMothers[0];
  const activeMessages = chats[selectedChatId] || [];

  // Sending typed messages
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!typedMessage.trim()) return;

    const newMsg: ChatMessage = {
      id: `m-new-${Date.now()}`,
      sender: 'asha',
      text: typedMessage,
      timestamp: 'Just now'
    };

    setChats((prev) => ({
      ...prev,
      [selectedChatId]: [...(prev[selectedChatId] || []), newMsg]
    }));
    setTypedMessage('');
  };

  // Quick Action: Send Pill Reminder
  const handleSendPillReminder = (pillName: string) => {
    const newMsg: ChatMessage = {
      id: `m-pill-${Date.now()}`,
      sender: 'system',
      text: `Reminder: Please take your prescribed medicine "${pillName}" now. Make sure to log it by touching your Kannamma smart ring.`,
      timestamp: 'Just now'
    };
    setChats((prev) => ({
      ...prev,
      [selectedChatId]: [...(prev[selectedChatId] || []), newMsg]
    }));
  };

  // Quick Action: Send ANC Reminder
  const handleSendAncReminder = () => {
    const newMsg: ChatMessage = {
      id: `m-anc-${Date.now()}`,
      sender: 'system',
      text: `Appointment Reminder: You have an upcoming Antenatal Care (ANC) visit scheduled on ${activeMother.nextANC}. Let us know if you need transport help.`,
      timestamp: 'Just now'
    };
    setChats((prev) => ({
      ...prev,
      [selectedChatId]: [...(prev[selectedChatId] || []), newMsg]
    }));
  };

  // Voice Recorder simulation
  const startVoiceRecording = () => {
    setIsRecording(true);
    setRecordingState('listening');
    setRecordedTranscript('');
    setVoiceConfidence(null);

    // Simulate standard dictation timeline
    setTimeout(() => {
      setRecordingState('processing');

      setTimeout(() => {
        // Mock voice text translations based on active mother & active language
        let dictationText = '';
        if (lang === 'hi') {
          dictationText = `नमस्ते ${activeMother.name.split(' ')[0]}, कृपया अपनी दवा समय पर लें और पानी ज्यादा पिएं।`;
        } else if (lang === 'kn') {
          dictationText = `ನಮಸ್ತೆ ${activeMother.name.split(' ')[0]}, ದಯವಿಟ್ಟು ನಿಮ್ಮ ಮಾತ್ರೆಗಳನ್ನು ಸರಿಯಾದ ಸಮಯಕ್ಕೆ ತೆಗೆದುಕೊಳ್ಳಿ.`;
        } else if (lang === 'ta') {
          dictationText = `வணக்கம் ${activeMother.name.split(' ')[0]}, தயவுசெய்து உங்கள் மருந்துகளை நேரத்திற்கு உட்கொள்ளவும்.`;
        } else if (lang === 'te') {
          dictationText = `నమస్తే ${activeMother.name.split(' ')[0]}, దయచేసి మీ మందులను సకాలంలో తీసుకోండి.`;
        } else {
          dictationText = `Hello ${activeMother.name.split(' ')[0]}, please make sure you take your folic acid pill and rest well today.`;
        }

        setRecordedTranscript(dictationText);
        setVoiceConfidence(Math.round(92 + Math.random() * 7));
        setRecordingState('success');
      }, 1500);
    }, 3000);
  };

  const confirmSendVoiceNote = () => {
    const newMsg: ChatMessage = {
      id: `m-voice-${Date.now()}`,
      sender: 'asha',
      text: recordedTranscript,
      isVoice: true,
      duration: recordedDuration,
      language: lang.toUpperCase(),
      timestamp: 'Just now'
    };

    setChats((prev) => ({
      ...prev,
      [selectedChatId]: [...(prev[selectedChatId] || []), newMsg]
    }));
    setIsRecording(false);
    setRecordingState('idle');
  };

  if (!activeMother) {
    return (
      <AshaShell>
        <div className="flex items-center justify-center h-64">
          <p className="text-xs text-[#8A7A82]">Loading communication center...</p>
        </div>
      </AshaShell>
    );
  }

  return (
    <AshaShell>
      <div className="space-y-6 pb-12">

        {/* ── SPLIT WORKSPACE: SIDEBAR + CONVERSATION SCREEN ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-170px)] min-h-[500px]">

          {/* LEFT COLUMN: MATERNAL CHATS DIRECTORY (4 cols) */}
          <div className="lg:col-span-4 bg-white border border-[#C8877A]/15 rounded-3xl p-4 flex flex-col shadow-sm h-full">
            <div className="space-y-3 mb-4">
              <div>
                <h3 className="font-serif text-base font-bold text-[#2A1525]">Mothers Directory</h3>
                <p className="text-[11px] text-[#8A7A82]">Select a mother to initiate remote care counseling</p>
              </div>

              {/* Search Box */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A7A82]" />
                <input
                  type="text"
                  placeholder="Search mothers by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-[#C8877A]/20 focus:outline-none focus:border-[#C8877A] text-xs bg-[#FEFAF8]/50"
                />
              </div>
            </div>

            {/* Chats List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {filteredMothers.map((mother) => {
                const isSelected = selectedChatId === mother.id;
                const lastMsgList = chats[mother.id] || [];
                const lastMsg = lastMsgList[lastMsgList.length - 1];

                return (
                  <button
                    key={mother.id}
                    onClick={() => setSelectedChatId(mother.id)}
                    className={`w-full text-left p-3 rounded-2xl border transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'bg-[#C8877A]/10 border-[#C8877A] text-[#2A1525]'
                        : 'bg-white border-[#C8877A]/10 hover:bg-[#FEFAF8]/60 text-[#8A7A82]'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#C8877A] to-[#D8A48F] flex items-center justify-center font-serif text-sm font-bold text-white shadow-sm shrink-0">
                      {mother.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-0.5">
                        <span className="text-xs font-bold text-[#2A1525] truncate">{mother.name}</span>
                        <span className="text-[9px] font-mono text-[#8A7A82] shrink-0">
                          {mother.riskLevel.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-[10px] text-[#8A7A82] truncate">
                        {mother.village} village · Week {mother.week}
                      </p>
                      {lastMsg && (
                        <p className="text-[10px] text-[#2A1525]/70 truncate mt-1 italic">
                          {lastMsg.sender === 'system' ? '⚠️ ' : ''}{lastMsg.text}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}

              {filteredMothers.length === 0 && (
                <p className="text-center text-xs text-[#8A7A82] py-8">No mothers found.</p>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: CHAT WINDOW & ACTION DESK (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-4 h-full">

            {/* CARE CONVERSATION WINDOW */}
            <div className="flex-1 bg-white border border-[#C8877A]/15 rounded-3xl p-5 flex flex-col shadow-sm overflow-hidden min-h-[250px]">
              {/* Header Info */}
              <div className="flex justify-between items-center border-b border-[#C8877A]/10 pb-3 mb-4 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#C8877A] to-[#D8A48F] flex items-center justify-center font-serif text-base font-bold text-white shadow-sm">
                    {activeMother.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#2A1525]">{activeMother.name}</h4>
                    <p className="text-[10px] text-[#8A7A82]">
                      Active Counsel Channel · {activeMother.village} · Contact: {activeMother.phone}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[9px] uppercase font-bold border px-2 py-0.5 rounded-full ${
                    activeMother.riskLevel === 'red'
                      ? 'bg-red-500/10 text-red-500 border-red-500/20'
                      : activeMother.riskLevel === 'yellow'
                      ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                      : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                  }`}>
                    {activeMother.riskLevel}
                  </span>
                </div>
              </div>

              {/* Chat Bubble Stream */}
              <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 pb-3 scrollbar-thin">
                {activeMessages.map((msg) => {
                  const isASHA = msg.sender === 'asha';
                  const isSystem = msg.sender === 'system';

                  if (isSystem) {
                    return (
                      <div key={msg.id} className="flex justify-center my-2">
                        <span className="bg-amber-50/80 border border-amber-100 text-amber-700 text-[10px] px-3.5 py-1.5 rounded-full text-center max-w-sm flex items-center gap-1.5 shadow-sm font-semibold">
                          <AlertCircle className="w-3.5 h-3.5" /> {msg.text}
                        </span>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isASHA ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs md:max-w-md rounded-2xl p-3 shadow-sm text-xs leading-relaxed ${
                          isASHA
                            ? 'bg-[#2A1525] text-white rounded-tr-none'
                            : 'bg-[#FEFAF8] border border-[#C8877A]/10 text-[#2A1525] rounded-tl-none'
                        }`}
                      >
                        {msg.isVoice ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 bg-white/10 p-2 rounded-xl border border-white/5">
                              <Volume2 className="w-4 h-4 text-[#D8A48F]" />
                              <span className="font-mono text-[9px] text-[#FEFAF8]/80">Voice Memo ({msg.duration})</span>
                              <span className="bg-[#C8877A]/20 text-[#D8A48F] text-[8px] font-bold px-1.5 py-0.5 rounded ml-auto">
                                {msg.language}
                              </span>
                            </div>
                            <p className="text-[11px] leading-snug italic mt-1.5 opacity-90">&quot;{msg.text}&quot;</p>
                          </div>
                        ) : (
                          <p>{msg.text}</p>
                        )}
                        <span className={`text-[8px] block text-right mt-1 opacity-60 font-mono`}>
                          {msg.timestamp}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Message Composer Footer */}
              <form onSubmit={handleSendMessage} className="flex items-center gap-2 pt-3 border-t border-[#C8877A]/10 shrink-0">
                <button
                  type="button"
                  onClick={startVoiceRecording}
                  className="w-9 h-9 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-500 flex items-center justify-center transition-all shrink-0"
                  title="Record regional voice instructions"
                >
                  <Mic className="w-4 h-4" />
                </button>
                <input
                  type="text"
                  placeholder="Type a remote care advice..."
                  value={typedMessage}
                  onChange={(e) => setTypedMessage(e.target.value)}
                  className="flex-1 px-4 py-2 border border-[#C8877A]/20 rounded-2xl text-xs focus:outline-none focus:border-[#C8877A]"
                />
                <button
                  type="submit"
                  className="w-9 h-9 rounded-full bg-[#2A1525] text-white hover:bg-[#C8877A] flex items-center justify-center transition-all shrink-0 shadow-sm"
                >
                  <Send className="w-4.5 h-4.5" />
                </button>
              </form>
            </div>

            {/* QUICK ACTIONS & ANCILLARY CONTROLS */}
            <div className="bg-white border border-[#C8877A]/15 rounded-3xl p-4 shadow-sm shrink-0">
              <h5 className="text-[10px] font-bold text-[#2A1525] uppercase tracking-wider mb-2.5">
                Care Coordination Actions
              </h5>
              <div className="flex flex-wrap gap-2.5">
                {/* Medicine alerts */}
                <button
                  onClick={() => handleSendPillReminder('Folic Acid (5mg)')}
                  className="bg-[#FEFAF8] border border-[#C8877A]/20 text-xs px-3.5 py-2 rounded-xl hover:bg-[#F5E8E6]/25 transition-all text-[#2A1525] font-semibold flex items-center gap-1.5"
                >
                  <Pill className="w-3.5 h-3.5 text-[#C8877A]" />
                  <span>Send Pill Alert</span>
                </button>
                
                {/* Appointment alerts */}
                <button
                  onClick={handleSendAncReminder}
                  className="bg-[#FEFAF8] border border-[#C8877A]/20 text-xs px-3.5 py-2 rounded-xl hover:bg-[#F5E8E6]/25 transition-all text-[#2A1525] font-semibold flex items-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Send ANC Reminder</span>
                </button>

                {/* Emergency coordination shortcut */}
                <button
                  onClick={() => handleSendPillReminder('Labetalol (100mg)')}
                  className="bg-red-50 text-red-600 border border-red-200 text-xs px-3.5 py-2 rounded-xl hover:bg-red-100 transition-all font-semibold flex items-center gap-1.5"
                >
                  <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                  <span>Send Hypertension Alert</span>
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* ── DICTATION POPUP SCREEN ── */}
        <AnimatePresence>
          {isRecording && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#2A1525]/45 backdrop-blur-md z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.95, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 15 }}
                className="bg-white border border-[#C8877A]/25 rounded-3xl p-6 w-full max-w-sm shadow-2xl text-center space-y-4"
              >
                <div className="flex justify-between items-center border-b border-[#C8877A]/10 pb-3">
                  <span className="text-xs uppercase font-bold tracking-wider text-[#C8877A]">
                    Dictate Audio Instruction
                  </span>
                  <button
                    onClick={() => setIsRecording(false)}
                    className="p-1 hover:bg-[#F5E8E6] rounded-full text-[#8A7A82]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {recordingState === 'listening' && (
                  <div className="space-y-4 py-3">
                    <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto text-red-500 animate-pulse">
                      <Mic className="w-8 h-8" />
                    </div>
                    <p className="text-sm font-semibold text-[#2A1525]">Listening to Voice Note...</p>
                    <p className="text-[10px] text-[#8A7A82]">Speak in English, Hindi, Kannada, Tamil, or Telugu</p>
                    <Waveform active={true} />
                  </div>
                )}

                {recordingState === 'processing' && (
                  <div className="space-y-3 py-4">
                    <Loader2 className="w-10 h-10 text-[#C8877A] mx-auto animate-spin" />
                    <p className="text-sm font-semibold text-[#2A1525]">Analyzing Audio Telemetry...</p>
                    <p className="text-[10px] text-[#8A7A82]">Normalizing signal & generating transcription transcripts...</p>
                  </div>
                )}

                {recordingState === 'success' && (
                  <div className="space-y-4 py-2">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto text-[#4CAF9A]">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-[#8A7A82]">Generated Transcription Text:</p>
                      <p className="text-sm font-serif font-bold text-[#2A1525] italic leading-relaxed">
                        &quot;{recordedTranscript}&quot;
                      </p>
                    </div>
                    {voiceConfidence && (
                      <span className="text-[10px] bg-emerald-50 text-[#4CAF9A] font-semibold border border-emerald-100 px-2 py-1 rounded-full inline-block">
                        NLP Confidence: {voiceConfidence}%
                      </span>
                    )}
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={startVoiceRecording}
                        className="flex-1 border border-[#C8877A]/30 text-[#C8877A] py-2 rounded-xl text-xs font-semibold hover:bg-[#F5E8E6]/10"
                      >
                        Re-record
                      </button>
                      <button
                        onClick={confirmSendVoiceNote}
                        className="flex-1 bg-[#2A1525] hover:bg-[#C8877A] text-white py-2 rounded-xl text-xs font-semibold transition-all"
                      >
                        Send Instruction
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </AshaShell>
  );
}
