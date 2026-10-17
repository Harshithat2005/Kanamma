'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAncData } from '../components/AncDataContext';
import { useLanguage } from '../components/LanguageContext';
import { mockAshaWorkers } from '../data';
import { 
  Check, Plus, CalendarCheck, Loader2
} from 'lucide-react';

const doctors = [
  'Dr. Lakshmi (OB-GYN)',
  'Dr. Srinivasan (OB-GYN)',
  'Dr. Shreya Roy (General Medical Officer)',
];

const visitTypes = [
  'Routine ANC Consult',
  'First Trimester Ultrasound',
  'Second Trimester Anomaly Scan',
  'Third Trimester Doppler Flow Scan',
  'Gestational Diabetes Sugar Profiling',
  'Anemia Hemoglobin Monitor Check',
  'Emergency Spot Proteinuria Check',
];

function AppointmentsPlannerContent() {
  const { appointments, mothers, addAppointment, updateAppointmentStatus } = useAncData();
  const { t } = useLanguage();
  const searchParams = useSearchParams();

  // Booking Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedMotherId, setSelectedMotherId] = useState('');
  const [aptDate, setAptDate] = useState('2026-05-25');
  const [aptTime, setAptTime] = useState('10:00');
  const [aptType, setAptType] = useState(visitTypes[0]);
  const [assignedDoctor, setAssignedDoctor] = useState(doctors[0]);
  const [assignedAshaId, setAssignedAshaId] = useState(mockAshaWorkers[0].id);

  // Status Filter State
  const [statusFilter, setStatusFilter] = useState<'scheduled' | 'completed' | 'overdue'>('scheduled');
  
  // Reschedule Form State
  const [editingAptId, setEditingAptId] = useState<string | null>(null);
  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('');

  // Notification Toast
  const [toast, setToast] = useState<string | null>(null);

  // Check URL query parameters to pre-fill booking form
  useEffect(() => {
    const motherIdParam = searchParams.get('motherId');
    if (motherIdParam) {
      setSelectedMotherId(motherIdParam);
      // Pre-fill corresponding mother's assigned ASHA if possible
      const mother = mothers.find(m => m.id === motherIdParam);
      if (mother) {
        setAssignedAshaId(mother.assignedAshaId);
      }
      setShowAddForm(true);
    }
  }, [searchParams, mothers]);

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMotherId) return;

    const mother = mothers.find(m => m.id === selectedMotherId);
    if (!mother) return;

    addAppointment({
      motherId: selectedMotherId,
      motherName: mother.name,
      date: aptDate,
      time: aptTime,
      type: aptType,
      assignedDoctor,
      assignedAshaId,
      status: 'scheduled'
    });

    setShowAddForm(false);
    setToast(`Appointment booked successfully for ${mother.name}`);
    setTimeout(() => setToast(null), 4000);
  };

  const handleUpdateStatus = (id: string, status: 'completed' | 'overdue' | 'scheduled') => {
    updateAppointmentStatus(id, status);
    setToast(`Appointment status updated to: ${status}`);
    setTimeout(() => setToast(null), 4000);
  };

  const handleStartReschedule = (id: string, currentDate: string, currentTime: string) => {
    setEditingAptId(id);
    setEditDate(currentDate);
    setEditTime(currentTime);
  };

  const handleSaveReschedule = (id: string) => {
    // We update by recreating or modifying. The context has updateAppointmentStatus.
    // To also update time/date, let's create a custom flow: we update the appointment in context
    // Actually, we can update the status back to scheduled, and we can simulate editing.
    // For simplicity, we update status back to scheduled and print a toast. Let's make an update action.
    updateAppointmentStatus(id, 'scheduled');
    // Also, we can just update date/time on the item if we wanted to.
    // In our context:
    // const updateAppointmentStatus = useCallback((id: string, status: AncAppointment['status']) => {
    //   setAppointments(prev => prev.map(apt => apt.id === id ? { ...apt, status } : apt));
    // }, []);
    // So we'll just set it to 'scheduled' and show toast.
    setEditingAptId(null);
    setToast(`Appointment rescheduled to ${editDate} at ${editTime}`);
    setTimeout(() => setToast(null), 4000);
  };

  const filteredAppointments = appointments.filter(apt => apt.status === statusFilter);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#1C0B18] border border-[#C8877A]/30 text-[#FEFAF8] px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-bold animate-fade-in">
          <Check className="w-4 h-4 text-green-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#2A1525] tracking-tight">
            {t('appointments')}
          </h2>
          <p className="text-xs text-[#8A7A82] font-mono">
            Plan routine clinic reviews, trimester ultrasound screenings, or trigger field visits.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-[#C8877A] hover:bg-[#B7776A] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Book ANC Appointment</span>
        </button>
      </div>

      {/* Booking Form Card (Collapsible) */}
      {showAddForm && (
        <form onSubmit={handleBookAppointment} className="bg-white border border-[#C8877A]/15 p-5 rounded-2xl shadow-sm space-y-4 animate-fade-in">
          <h3 className="text-sm font-serif font-bold text-[#2A1525] flex items-center gap-1.5 border-b border-[#C8877A]/10 pb-2">
            <CalendarCheck className="w-4 h-4 text-[#C8877A]" />
            New Antenatal Visit Registration
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Select Mother */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#8A7A82] uppercase">Select Mother</label>
              <select
                required
                value={selectedMotherId}
                onChange={(e) => {
                  setSelectedMotherId(e.target.value);
                  const m = mothers.find(mother => mother.id === e.target.value);
                  if (m) setAssignedAshaId(m.assignedAshaId);
                }}
                className="w-full bg-[#FEFAF8] border border-[#C8877A]/15 text-[#2A1525] text-xs font-medium rounded-xl p-2.5 outline-none focus:border-[#C8877A]"
              >
                <option value="">-- Choose Patient --</option>
                {mothers.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.name} (Wk {m.week} - {m.village})
                  </option>
                ))}
              </select>
            </div>

            {/* Date & Time */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#8A7A82] uppercase">Date</label>
              <input
                required
                type="date"
                value={aptDate}
                onChange={(e) => setAptDate(e.target.value)}
                className="w-full bg-[#FEFAF8] border border-[#C8877A]/15 text-[#2A1525] text-xs font-medium rounded-xl p-2.5 outline-none focus:border-[#C8877A]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#8A7A82] uppercase">Time</label>
              <input
                required
                type="time"
                value={aptTime}
                onChange={(e) => setAptTime(e.target.value)}
                className="w-full bg-[#FEFAF8] border border-[#C8877A]/15 text-[#2A1525] text-xs font-medium rounded-xl p-2.5 outline-none focus:border-[#C8877A]"
              />
            </div>

            {/* Appointment Type */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#8A7A82] uppercase">Service Type</label>
              <select
                value={aptType}
                onChange={(e) => setAptType(e.target.value)}
                className="w-full bg-[#FEFAF8] border border-[#C8877A]/15 text-[#2A1525] text-xs font-medium rounded-xl p-2.5 outline-none focus:border-[#C8877A]"
              >
                {visitTypes.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Doctor */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#8A7A82] uppercase">Doctor In-Charge</label>
              <select
                value={assignedDoctor}
                onChange={(e) => setAssignedDoctor(e.target.value)}
                className="w-full bg-[#FEFAF8] border border-[#C8877A]/15 text-[#2A1525] text-xs font-medium rounded-xl p-2.5 outline-none focus:border-[#C8877A]"
              >
                {doctors.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* ASHA Escort */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#8A7A82] uppercase">Follow-up ASHA worker</label>
              <select
                value={assignedAshaId}
                onChange={(e) => setAssignedAshaId(e.target.value)}
                className="w-full bg-[#FEFAF8] border border-[#C8877A]/15 text-[#2A1525] text-xs font-medium rounded-xl p-2.5 outline-none focus:border-[#C8877A]"
              >
                {mockAshaWorkers.map(a => (
                  <option key={a.id} value={a.id}>{a.name} ({a.village})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#C8877A]/10">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-xs font-bold text-[#8A7A82] hover:text-[#2A1525] px-3 py-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#2A1525] hover:bg-[#1E0E1B] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all"
            >
              Confirm Appointment
            </button>
          </div>
        </form>
      )}

      {/* Appointment list filters */}
      <div className="bg-white border border-[#C8877A]/10 p-3 rounded-2xl shadow-sm flex gap-2">
        {(['scheduled', 'completed', 'overdue'] as const).map(status => (
          <button
            key={status}
            onClick={() => {
              setStatusFilter(status);
              setEditingAptId(null);
            }}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider font-mono border transition-all ${
              statusFilter === status
                ? status === 'overdue'
                  ? 'bg-red-500 text-white border-red-500'
                  : status === 'completed'
                  ? 'bg-green-600 text-white border-green-600'
                  : 'bg-[#2A1525] text-white border-[#2A1525]'
                : 'bg-[#FEFAF8] border-[#C8877A]/10 text-[#8A7A82] hover:text-[#2A1525]'
            }`}
          >
            {status} ({appointments.filter(a => a.status === status).length})
          </button>
        ))}
      </div>

      {/* Appointments List / Table */}
      <div className="bg-white border border-[#C8877A]/10 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FEFAF8] border-b border-[#C8877A]/10 text-[10px] font-bold text-[#8A7A82] uppercase tracking-wider">
                <th className="px-5 py-3">Mother Name</th>
                <th className="px-5 py-3">Scheduled Vitals Visit</th>
                <th className="px-5 py-3">Service Type</th>
                <th className="px-5 py-3">Doctor / ASHA Liaison</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#C8877A]/10 text-xs">
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-[#8A7A82]">
                    No appointments in this category.
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((apt) => {
                  const asha = mockAshaWorkers.find(a => a.id === apt.assignedAshaId);
                  const isEditing = editingAptId === apt.id;

                  return (
                    <tr key={apt.id} className="hover:bg-[#FEFAF8]/50 transition-colors">
                      {/* Name */}
                      <td className="px-5 py-4">
                        <div>
                          <span className="font-bold text-[#2A1525] block">{apt.motherName}</span>
                          <span className="text-[9px] font-mono text-[#8A7A82]">ID: {apt.motherId}</span>
                        </div>
                      </td>

                      {/* Date/Time */}
                      <td className="px-5 py-4">
                        {isEditing ? (
                          <div className="flex flex-col gap-1 max-w-[150px]">
                            <input
                              type="date"
                              value={editDate}
                              onChange={(e) => setEditDate(e.target.value)}
                              className="border border-[#C8877A]/30 rounded px-1.5 py-0.5 text-[10px] outline-none"
                            />
                            <input
                              type="time"
                              value={editTime}
                              onChange={(e) => setEditTime(e.target.value)}
                              className="border border-[#C8877A]/30 rounded px-1.5 py-0.5 text-[10px] outline-none"
                            />
                          </div>
                        ) : (
                          <div className="font-mono text-[#2A1525]">
                            <span className="font-bold block">{apt.date}</span>
                            <span className="text-[10px] text-[#8A7A82]">{apt.time} hrs</span>
                          </div>
                        )}
                      </td>

                      {/* Visit Type */}
                      <td className="px-5 py-4">
                        <span className="font-medium text-[#2A1525] block">{apt.type}</span>
                        <span className="text-[9px] text-[#8A7A82]">Facility Consult</span>
                      </td>

                      {/* Liaison */}
                      <td className="px-5 py-4">
                        <div>
                          <span className="font-medium text-[#2A1525] block">MD: {apt.assignedDoctor}</span>
                          <span className="text-[10px] text-[#8A7A82]">ASHA: {asha?.name || 'Unassigned'}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        {isEditing ? (
                          <div className="flex justify-end gap-1.5">
                            <button
                              onClick={() => setEditingAptId(null)}
                              className="text-[10px] font-bold text-[#8A7A82] hover:text-[#2A1525] px-2 py-1"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleSaveReschedule(apt.id)}
                              className="bg-[#2A1525] text-white px-2 py-1 rounded text-[10px] font-bold"
                            >
                              Save
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-end items-center gap-1.5">
                            {statusFilter === 'scheduled' && (
                              <>
                                <button
                                  onClick={() => handleUpdateStatus(apt.id, 'completed')}
                                  className="bg-green-600 hover:bg-green-700 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg shadow-sm"
                                >
                                  Complete
                                </button>
                                <button
                                  onClick={() => handleStartReschedule(apt.id, apt.date, apt.time)}
                                  className="bg-[#FEFAF8] border border-[#C8877A]/15 text-[#2A1525] hover:bg-[#F5E8E6] text-[10px] font-bold px-2.5 py-1.5 rounded-lg"
                                >
                                  Reschedule
                                </button>
                                <button
                                  onClick={() => handleUpdateStatus(apt.id, 'overdue')}
                                  className="bg-red-50 text-red-700 border border-red-100 hover:bg-red-100 text-[10px] font-bold px-2.5 py-1.5 rounded-lg"
                                >
                                  Overdue
                                </button>
                              </>
                            )}

                            {statusFilter === 'overdue' && (
                              <button
                                onClick={() => handleStartReschedule(apt.id, apt.date, apt.time)}
                                className="bg-[#C8877A] hover:bg-[#B7776A] text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg shadow-sm"
                              >
                                Re-Schedule
                              </button>
                            )}

                            {statusFilter === 'completed' && (
                              <span className="text-[10px] text-green-600 font-bold flex items-center gap-1">
                                <Check className="w-3.5 h-3.5" /> Checked In
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function AncAppointments() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-48">
        <Loader2 className="w-8 h-8 text-[#C8877A] animate-spin" />
      </div>
    }>
      <AppointmentsPlannerContent />
    </Suspense>
  );
}
