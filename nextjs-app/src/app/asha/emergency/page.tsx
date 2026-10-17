'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Siren,
  MapPin,
  Stethoscope,
  Truck,
  Shield,
  CheckCircle,
  Radio,
  Phone
} from 'lucide-react';
import AshaShell from '../components/AshaShell';
import { initialEmergencies, mockMothers } from '../data';

export default function AshaEmergency() {
  const [emergencies, setEmergencies] = useState(initialEmergencies);
  const [showEscalation, setShowEscalation] = useState(false);

  const resolveEmergency = (id: string) => {
    setEmergencies((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: 'resolved' as const } : e))
    );
  };

  const activeEmergencies = emergencies.filter((e) => e.status !== 'resolved');
  const resolvedEmergencies = emergencies.filter((e) => e.status === 'resolved');

  return (
    <AshaShell>
      <div className="space-y-6 pb-12">

        {/* ── EMERGENCY STATUS BANNER ── */}
        {activeEmergencies.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500 text-white rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg shadow-red-500/20"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
                <Siren className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold">EMERGENCY ACTIVE</h3>
                <p className="text-xs text-white/80">{activeEmergencies.length} active emergency alert(s) requiring immediate response</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-white/20 text-white text-[10px] font-mono font-bold px-3 py-1.5 rounded-full animate-pulse">
                AMBULANCE DISPATCHED
              </span>
            </div>
          </motion.div>
        )}
        {showEscalation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-amber-600 text-white rounded-2xl p-4 flex items-center justify-between shadow-lg"
          >
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider">District Escalation Active</p>
                <p className="text-[10px] text-white/90">Medical officer and primary response team have been notified with telemetry logs.</p>
              </div>
            </div>
            <button
              onClick={() => setShowEscalation(false)}
              className="text-[10px] bg-white/20 hover:bg-white/35 text-white font-mono font-bold px-3 py-1 rounded-full transition-all"
            >
              DISMISS
            </button>
          </motion.div>
        )}

        {activeEmergencies.length === 0 && (
          <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-6 text-center">
            <Shield className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <h3 className="font-serif text-lg font-bold text-emerald-700">All Clear</h3>
            <p className="text-xs text-[#8A7A82]">No active emergency alerts at this time. All mothers are stable.</p>
          </div>
        )}

        {/* ── ACTIVE EMERGENCY CARDS ── */}
        <div className="space-y-5">
          {activeEmergencies.map((emergency) => {
            const mother = mockMothers.find((m) => m.id === emergency.motherId);

            return (
              <motion.div
                key={emergency.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white border-2 border-red-300 rounded-3xl overflow-hidden shadow-md"
              >
                {/* Critical Header Strip */}
                <div className="bg-red-500 text-white p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 animate-pulse" />
                    <div>
                      <h4 className="font-serif font-bold">{emergency.motherName}</h4>
                      <p className="text-[10px] text-white/80">{emergency.village} Village</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold bg-white/20 px-3 py-1 rounded-full">
                    {emergency.timestamp}
                  </span>
                </div>

                {/* Emergency Details Body */}
                <div className="p-5 space-y-5">
                  {/* Trigger Description */}
                  <div className="bg-red-50 border border-red-100 rounded-2xl p-4 space-y-2">
                    <h5 className="text-[10px] font-bold text-red-600 uppercase tracking-wider">Emergency Trigger</h5>
                    <p className="text-sm font-semibold text-[#2A1525]">{emergency.trigger}</p>
                  </div>

                  {/* Response Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Ambulance Status */}
                    <div className="bg-[#FEFAF8] border border-[#C8877A]/15 rounded-2xl p-4 text-center space-y-2">
                      <Truck className="w-6 h-6 text-red-500 mx-auto" />
                      <p className="text-xs font-bold text-[#2A1525]">Ambulance Status</p>
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full inline-block ${
                        emergency.status === 'dispatched'
                          ? 'bg-amber-500/10 text-amber-600 animate-pulse'
                          : emergency.status === 'contacted'
                          ? 'bg-blue-500/10 text-blue-600'
                          : 'bg-emerald-500/10 text-emerald-600'
                      }`}>
                        {emergency.status === 'dispatched' ? 'EN ROUTE' : emergency.status.toUpperCase()}
                      </span>
                      {emergency.ambulanceETA && (
                        <p className="text-xs font-mono text-[#C8877A] font-semibold">{emergency.ambulanceETA}</p>
                      )}
                    </div>

                    {/* Doctor Contact */}
                    <div className="bg-[#FEFAF8] border border-[#C8877A]/15 rounded-2xl p-4 text-center space-y-2">
                      <Stethoscope className="w-6 h-6 text-[#C8877A] mx-auto" />
                      <p className="text-xs font-bold text-[#2A1525]">Assigned Physician</p>
                      <p className="text-xs text-[#8A7A82]">{emergency.doctorName}</p>
                      <button className="bg-[#2A1525] text-white text-[10px] font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 mx-auto hover:bg-[#C8877A] transition-all">
                        <Phone className="w-3 h-3" /> Call Now
                      </button>
                    </div>

                    {/* Mother Vitals snapshot */}
                    <div className="bg-[#FEFAF8] border border-[#C8877A]/15 rounded-2xl p-4 text-center space-y-2">
                      <MapPin className="w-6 h-6 text-indigo-500 mx-auto" />
                      <p className="text-xs font-bold text-[#2A1525]">Location & Hospital</p>
                      <p className="text-[10px] text-[#8A7A82]">{mother?.nearestHospital || 'District Hospital'}</p>
                      <p className="text-[10px] text-[#8A7A82]">Contact: {mother?.emergencyContact || 'Family notified'}</p>
                    </div>
                  </div>

                  {/* Action Protocol Timeline */}
                  <div className="bg-white border border-[#C8877A]/10 rounded-2xl p-4 space-y-3">
                    <h5 className="text-xs font-bold text-[#2A1525] uppercase tracking-wider">Emergency Response Protocol</h5>
                    <div className="relative border-l-2 border-red-300 pl-4 ml-2 space-y-3">
                      <div className="relative">
                        <span className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-red-500 border-2 border-white" />
                        <p className="text-[11px] text-[#2A1525] font-semibold">Ring anomaly detected by Kannamma AI</p>
                        <p className="text-[10px] text-[#8A7A82] font-mono">Auto-triggered at {emergency.timestamp}</p>
                      </div>
                      <div className="relative">
                        <span className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-amber-500 border-2 border-white animate-pulse" />
                        <p className="text-[11px] text-[#2A1525] font-semibold">ASHA worker notified + Ambulance dispatched</p>
                        <p className="text-[10px] text-[#8A7A82] font-mono">108 Ambulance Service contacted</p>
                      </div>
                      <div className="relative">
                        <span className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-[#8A7A82]/30 border-2 border-white" />
                        <p className="text-[11px] text-[#8A7A82]">Awaiting hospital admission confirmation...</p>
                      </div>
                    </div>
                  </div>

                  {/* Resolve / Escalate Actions */}
                  <div className="flex justify-between items-center pt-2 border-t border-[#C8877A]/10">
                    <button
                      onClick={() => setShowEscalation(true)}
                      className="text-xs text-red-500 font-semibold border border-red-200 px-3 py-1.5 rounded-xl hover:bg-red-50 transition-all flex items-center gap-1"
                    >
                      <Radio className="w-3.5 h-3.5" /> Escalate to District Officer
                    </button>
                    <button
                      onClick={() => resolveEmergency(emergency.id)}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-sm"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Mark Resolved
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── RESOLVED HISTORY LOG ── */}
        {resolvedEmergencies.length > 0 && (
          <div className="bg-white border border-[#C8877A]/15 rounded-3xl p-5 shadow-sm space-y-3">
            <h4 className="font-serif text-base font-bold text-[#2A1525] flex items-center gap-2">
              <CheckCircle className="w-4.5 h-4.5 text-emerald-500" /> Resolved Emergency History
            </h4>
            {resolvedEmergencies.map((e) => (
              <div key={e.id} className="bg-emerald-50/30 border border-emerald-100 rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-serif text-xs font-bold">
                    {e.motherName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#2A1525]">{e.motherName}</p>
                    <p className="text-[10px] text-[#8A7A82]">{e.trigger}</p>
                  </div>
                </div>
                <span className="text-[9px] bg-emerald-100 text-emerald-600 font-bold px-2 py-0.5 rounded-full">RESOLVED</span>
              </div>
            ))}
          </div>
        )}

        {/* ── QUICK EMERGENCY CONTACTS ── */}
        <div className="bg-[#2A1525] text-white rounded-2xl p-5 space-y-4">
          <h4 className="font-serif text-base font-bold text-[#D8A48F]">Emergency Quick Contacts</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { label: '108 Ambulance Service', number: '108', desc: 'State Emergency' },
              { label: 'District Health Officer', number: '+91-80-4567-8901', desc: 'Dr. R. Madhavan' },
              { label: 'Nearest PHC Helpline', number: '+91-80-2345-6789', desc: 'Hosur PHC 24/7' },
            ].map((contact, i) => (
              <div key={i} className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-3 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-white">{contact.label}</p>
                  <p className="text-[10px] text-[#FEFAF8]/60">{contact.desc}</p>
                </div>
                <button className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-all">
                  <Phone className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AshaShell>
  );
}
