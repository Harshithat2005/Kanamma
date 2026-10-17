'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLanguage } from '../components/LanguageContext';
import { useDoctorData } from '../components/DoctorDataContext';
import {
  Plus,
  Trash2,
  Save,
  CheckCircle
} from 'lucide-react';

function DigitalPrescriptionForm() {
  const { t } = useLanguage();
  const { patients, addPrescription } = useDoctorData();
  const searchParams = useSearchParams();

  // Patient Selection state
  const queryPatientId = searchParams.get('patientId') || '';
  const [selectedPatientId, setSelectedPatientId] = useState(queryPatientId);

  // Form states
  const [medicines, setMedicines] = useState<
    { name: string; dosage: string; duration: string; instructions: string }[]
  >([{ name: 'Labetalol 100mg', dosage: '1-0-1', duration: '30 Days', instructions: 'Post meals' }]);

  const [dietNotes, setDietNotes] = useState(
    'Rich in green leafy vegetables, pomegranate, spinach. Avoid high sodium.'
  );
  const [successMsg, setSuccessMsg] = useState(false);

  // Sync selection if search params changes
  useEffect(() => {
    if (queryPatientId) {
      setSelectedPatientId(queryPatientId);
    }
  }, [queryPatientId]);

  const activePatient = patients.find((p) => p.id === selectedPatientId) || patients[0];

  const handleAddMedicine = () => {
    setMedicines((prev) => [
      ...prev,
      { name: '', dosage: '1-0-1', duration: '30 Days', instructions: 'Post food' }
    ]);
  };

  const handleRemoveMedicine = (index: number) => {
    setMedicines((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMedicineChange = (
    index: number,
    field: 'name' | 'dosage' | 'duration' | 'instructions',
    value: string
  ) => {
    setMedicines((prev) =>
      prev.map((med, i) => (i === index ? { ...med, [field]: value } : med))
    );
  };

  const handleSavePrescription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePatient) return;
    if (medicines.some((m) => !m.name.trim())) return;

    addPrescription(activePatient.id, medicines, dietNotes);
    setSuccessMsg(true);

    setTimeout(() => {
      setSuccessMsg(false);
    }, 4000);
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-[#2A1525] tracking-tight">
          {t('prescriptions')}
        </h1>
        <p className="text-sm text-[#2A1525]/60 font-sans font-medium mt-1">
          Digitally prescribe medications, vitamins, supplement regimens, and nutrition directives to ASHA workers and mothers
        </p>
      </div>

      {successMsg && (
        <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-xl flex items-center space-x-3.5 shadow-sm">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <div className="text-xs">
            <strong className="font-bold">Prescription Generated Successfully!</strong>
            <p className="mt-0.5 font-medium">
              The digital card has been dispatched to ASHA worker {activePatient?.assignedAshaName} and logged in the mother&apos;s dossier.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Column: Form */}
        <form
          onSubmit={handleSavePrescription}
          className="bg-[#FFFFFF] border border-[#C8877A]/10 rounded-xl shadow-sm p-6 space-y-6"
        >
          {/* Patient Dropdown */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#2A1525] uppercase tracking-wider">
              Select Patient / Mother
            </label>
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="w-full text-xs p-3 border border-[#C8877A]/20 bg-[#FEFAF8] focus:outline-none focus:border-[#C8877A] rounded-lg text-[#2A1525] font-semibold"
            >
              <option value="" disabled>Select mother from clinic registry...</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (GA: {p.week} wks) - {p.village} [{p.riskLevel.toUpperCase()}]
                </option>
              ))}
            </select>
          </div>

          {/* Dynamic Medicines Form */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#C8877A]/10 pb-2">
              <span className="text-xs font-bold text-[#2A1525] uppercase tracking-wider">
                {t('medicines')}
              </span>
              <button
                type="button"
                onClick={handleAddMedicine}
                className="text-xs font-bold text-[#C8877A] hover:underline flex items-center space-x-1"
              >
                <Plus className="h-4.5 w-4.5" />
                <span>Add Medication</span>
              </button>
            </div>

            <div className="space-y-4">
              {medicines.map((med, index) => (
                <div
                  key={index}
                  className="p-4 bg-[#FEFAF8] border border-[#C8877A]/10 rounded-xl space-y-3.5 relative"
                >
                  {/* Remove Button */}
                  {medicines.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveMedicine(index)}
                      className="absolute top-3 right-3 text-red-500 hover:text-red-700 p-1 bg-white border border-red-100 rounded"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}

                  {/* Medicine fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[#2A1525]/60 uppercase">
                        Medicine Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Labetalol 100mg"
                        value={med.name}
                        onChange={(e) => handleMedicineChange(index, 'name', e.target.value)}
                        className="w-full text-xs p-2.5 border border-[#C8877A]/20 bg-white focus:outline-none focus:border-[#C8877A] rounded-lg text-[#2A1525] font-semibold"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[#2A1525]/60 uppercase">
                        Dosage Pattern
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 1-0-1 or 0-1-0"
                        value={med.dosage}
                        onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                        className="w-full text-xs p-2.5 border border-[#C8877A]/20 bg-white focus:outline-none focus:border-[#C8877A] rounded-lg text-[#2A1525] font-semibold"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[#2A1525]/60 uppercase">
                        Duration
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 30 Days"
                        value={med.duration}
                        onChange={(e) => handleMedicineChange(index, 'duration', e.target.value)}
                        className="w-full text-xs p-2.5 border border-[#C8877A]/20 bg-white focus:outline-none focus:border-[#C8877A] rounded-lg text-[#2A1525] font-semibold"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[#2A1525]/60 uppercase">
                        Special Instructions
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Post food, with water"
                        value={med.instructions}
                        onChange={(e) => handleMedicineChange(index, 'instructions', e.target.value)}
                        className="w-full text-xs p-2.5 border border-[#C8877A]/20 bg-white focus:outline-none focus:border-[#C8877A] rounded-lg text-[#2A1525] font-semibold"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Diet Notes */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#2A1525] uppercase tracking-wider">
              Dietary & Nutrition Recommendations
            </label>
            <textarea
              rows={3}
              value={dietNotes}
              onChange={(e) => setDietNotes(e.target.value)}
              placeholder="e.g. High protein food, restrict sugar levels, daily iron-rich fruits..."
              className="w-full text-xs p-3 border border-[#C8877A]/20 bg-[#FEFAF8] focus:outline-none focus:border-[#C8877A] rounded-lg"
            />
          </div>

          {/* Save Button */}
          <button
            type="submit"
            className="w-full py-3 bg-[#2A1525] text-white hover:bg-[#2A1525]/90 text-sm font-bold rounded-lg transition flex items-center justify-center space-x-2"
          >
            <Save className="h-4.5 w-4.5" />
            <span>{t('savePrescription')}</span>
          </button>
        </form>

        {/* Right Column: Live Clinical Preview Card */}
        {activePatient ? (
          <div className="bg-[#FFFFFF] border border-[#C8877A]/25 rounded-xl shadow-lg p-6 lg:p-8 space-y-6 relative overflow-hidden">
            {/* Stamp Overlay decoration */}
            <div className="absolute top-12 right-12 border-4 border-emerald-500/25 text-emerald-500/25 text-[10px] font-bold rounded-lg px-4 py-2 uppercase tracking-widest rotate-12 select-none">
              Verified Digital Rx
            </div>

            {/* Letterhead */}
            <div className="text-center border-b border-[#C8877A]/15 pb-4 space-y-1">
              <h3 className="font-serif text-lg font-bold text-[#2A1525] uppercase tracking-wide">
                Nelamangala Maternity Hub
              </h3>
              <p className="text-[10px] text-[#2A1525]/60 font-semibold uppercase tracking-wider">
                Clinical Obstetric Service Network
              </p>
              <p className="text-[9px] text-[#2A1525]/50">
                Dr. Shreya Roy, Senior OB-GYN • Reg No: KMC-88741
              </p>
            </div>

            {/* Patient Metadata */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-[#FEFAF8] p-3 rounded-lg border border-[#C8877A]/10">
              <div className="space-y-1">
                <span className="text-[#2A1525]/50">Mother Name:</span>
                <span className="font-bold text-[#2A1525] block">{activePatient.name}</span>
              </div>
              <div className="space-y-1">
                <span className="text-[#2A1525]/50">GA Stage:</span>
                <span className="font-bold text-[#2A1525] block">Week {activePatient.week} (T{activePatient.trimester})</span>
              </div>
              <div className="space-y-1">
                <span className="text-[#2A1525]/50">Blood Group:</span>
                <span className="font-bold text-[#2A1525] block">{activePatient.bloodGroup}</span>
              </div>
              <div className="space-y-1">
                <span className="text-[#2A1525]/50">Liaison Village:</span>
                <span className="font-bold text-[#2A1525] block">{activePatient.village}</span>
              </div>
            </div>

            {/* Rx Symbol */}
            <div className="font-serif text-3xl font-bold text-[#C8877A] italic">
              R<span className="text-base text-[#2A1525]/60 not-italic font-bold ml-0.5">x</span>
            </div>

            {/* Prescription Table */}
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#C8877A]/15 text-[#2A1525]/60 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-2">Medication Name</th>
                  <th className="py-2">Dosage</th>
                  <th className="py-2">Duration</th>
                  <th className="py-2 text-right">Instructions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#C8877A]/5 font-semibold text-[#2A1525]">
                {medicines.map((m, idx) => (
                  <tr key={idx}>
                    <td className="py-3 font-medium text-sm">
                      {m.name || <span className="text-red-500 italic">Enter Name...</span>}
                    </td>
                    <td className="py-3 font-mono">{m.dosage}</td>
                    <td className="py-3">{m.duration}</td>
                    <td className="py-3 text-right text-[#2A1525]/75 font-normal">{m.instructions}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Diet & Advice */}
            {dietNotes && (
              <div className="space-y-1 pt-4 border-t border-[#C8877A]/15">
                <span className="text-[10px] uppercase font-bold text-[#2A1525]/60 tracking-wider">
                  Dietary & Lifestyle Advice
                </span>
                <p className="text-xs text-[#2A1525]/85 italic bg-[#FEFAF8] p-3 rounded-lg border border-[#C8877A]/10 leading-relaxed">
                  {dietNotes}
                </p>
              </div>
            )}

            {/* Footer / Signatures */}
            <div className="pt-6 flex justify-between items-end border-t border-[#C8877A]/15">
              <div className="text-[9px] text-[#2A1525]/50 flex flex-col font-medium">
                <span>Date: {new Date().toISOString().split('T')[0]}</span>
                <span>Stamp: Nelamangala Clinical Council</span>
              </div>
              <div className="text-right flex flex-col">
                <span className="font-serif text-[#C8877A] font-bold text-sm italic">
                  Dr. Shreya Roy
                </span>
                <span className="text-[9px] text-[#2A1525]/60 font-semibold uppercase mt-0.5">
                  Gynecologist Specialist
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-[#FFFFFF] border border-[#C8877A]/10 rounded-xl p-8 text-center text-xs text-[#2A1525]/40 italic">
            Select a mother to view prescription sheet preview.
          </div>
        )}
      </div>
    </div>
  );
}

export default function DigitalPrescriptions() {
  return (
    <Suspense fallback={<div className="text-center py-12 text-sm text-[#2A1525]/60">Loading prescription modules...</div>}>
      <DigitalPrescriptionForm />
    </Suspense>
  );
}
