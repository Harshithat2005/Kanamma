'use client';

import React, { useState, useRef } from 'react';
import { useAncData } from '../components/AncDataContext';
import { useLanguage } from '../components/LanguageContext';
import { 
  FileText, Upload, AlertTriangle, Eye, Check, X, 
  ShieldCheck
} from 'lucide-react';

export default function AncReports() {
  const { reports, mothers, addReport, verifyReport } = useAncData();
  const { t } = useLanguage();

  const [selectedMotherId, setSelectedMotherId] = useState('');
  const [category, setCategory] = useState<'blood' | 'scan' | 'prescription'>('blood');
  const [notes, setNotes] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  
  // Preview Modal state
  const [previewReportId, setPreviewReportId] = useState<string | null>(null);

  // Filters
  const [activeCategory, setActiveCategory] = useState<'all' | 'blood' | 'scan' | 'prescription'>('all');
  const [verificationFilter, setVerificationFilter] = useState<'all' | 'verified' | 'unverified'>('all');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files[0]);
    }
  };

  const handleFiles = (file: File) => {
    if (!selectedMotherId) {
      alert("Please select a patient mother first before uploading a report.");
      return;
    }
    const mother = mothers.find(m => m.id === selectedMotherId);
    if (!mother) return;

    // Add report to context state
    addReport({
      motherId: selectedMotherId,
      motherName: mother.name,
      category,
      fileName: file.name,
      fileSize: `${(file.size / 1024).toFixed(0)} KB`,
      date: new Date().toISOString().split('T')[0],
      verified: false,
      notes: notes || 'Uploaded via ANC Central Operations Desk.'
    });

    setNotes('');
    setToast(`Report "${file.name}" uploaded successfully.`);
    setTimeout(() => setToast(null), 4000);
  };

  const handleVerify = (id: string) => {
    verifyReport(id, 'Dr. Shreya Roy');
    setToast("Report verified successfully by Dr. Shreya Roy.");
    setTimeout(() => setToast(null), 4000);
  };

  const openPreview = (id: string) => {
    setPreviewReportId(id);
  };

  const closePreview = () => {
    setPreviewReportId(null);
  };

  // Filter reports
  const filteredReports = reports.filter(rep => {
    const matchesCategory = activeCategory === 'all' || rep.category === activeCategory;
    const matchesVerify = 
      verificationFilter === 'all' || 
      (verificationFilter === 'verified' && rep.verified) || 
      (verificationFilter === 'unverified' && !rep.verified);
    return matchesCategory && matchesVerify;
  });

  const previewingReport = reports.find(r => r.id === previewReportId);

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
      <div>
        <h2 className="text-2xl font-serif font-bold text-[#2A1525] tracking-tight">
          {t('reports')}
        </h2>
        <p className="text-xs text-[#8A7A82] font-mono">
          Upload scan logs, verify blood panel thresholds, and update compliance records.
        </p>
      </div>

      {/* Upload Zone & Form Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Section: Upload parameters */}
        <div className="bg-white border border-[#C8877A]/15 p-5 rounded-2xl shadow-sm space-y-4">
          <h3 className="text-sm font-serif font-bold text-[#2A1525] border-b border-[#C8877A]/10 pb-2">
            Upload Parameters
          </h3>

          {/* Patient dropdown */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[#8A7A82] uppercase">Select Mother</label>
            <select
              value={selectedMotherId}
              onChange={(e) => setSelectedMotherId(e.target.value)}
              className="w-full bg-[#FEFAF8] border border-[#C8877A]/15 text-[#2A1525] text-xs font-medium rounded-xl p-2.5 outline-none focus:border-[#C8877A]"
            >
              <option value="">-- Choose Patient --</option>
              {mothers.map(m => (
                <option key={m.id} value={m.id}>{m.name} ({m.village})</option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[#8A7A82] uppercase">Report Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as 'blood' | 'scan' | 'prescription')}
              className="w-full bg-[#FEFAF8] border border-[#C8877A]/15 text-[#2A1525] text-xs font-medium rounded-xl p-2.5 outline-none focus:border-[#C8877A]"
            >
              <option value="blood">Blood Panel / Hematology</option>
              <option value="scan">Ultrasound Scan Image</option>
              <option value="prescription">Prescription Dose Sheet</option>
            </select>
          </div>

          {/* Clinical Comments */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[#8A7A82] uppercase">Clinical Notes (Optional)</label>
            <textarea
              placeholder="e.g. Iron profile deficiency detected, prescribing daily hematinics..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[#FEFAF8] border border-[#C8877A]/15 text-[#2A1525] p-2.5 rounded-xl text-xs outline-none focus:border-[#C8877A] h-20 resize-none"
            />
          </div>
        </div>

        {/* Right Section: Drag and Drop Area */}
        <div className="lg:col-span-2">
          <div 
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`w-full h-full min-h-[220px] bg-white border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all ${
              dragActive 
                ? 'border-red-400 bg-red-500/02' 
                : 'border-[#C8877A]/30 hover:border-[#C8877A] bg-white'
            }`}
          >
            <input 
              ref={fileInputRef}
              type="file" 
              className="hidden" 
              onChange={handleFileChange}
              accept=".pdf,.png,.jpg,.jpeg"
            />
            <div className="w-12 h-12 rounded-xl bg-[#C8877A]/10 flex items-center justify-center text-[#C8877A] mb-3">
              <Upload className="w-6 h-6" />
            </div>
            <p className="text-xs font-bold text-[#2A1525]">
              Drag and drop reports here, or <span className="text-[#C8877A] hover:underline">browse files</span>
            </p>
            <p className="text-[10px] text-[#8A7A82] mt-1 font-mono">
              Accepted Formats: PDF, PNG, JPG (Max 5MB)
            </p>
            {!selectedMotherId && (
              <div className="mt-3 flex items-center gap-1.5 text-[10px] text-red-600 bg-red-50 border border-red-100 rounded px-2.5 py-1 font-bold">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Select a mother on the left first</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reports Directory filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white border border-[#C8877A]/10 p-3.5 rounded-2xl shadow-sm">
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {([
            { id: 'all', label: t('all') },
            { id: 'blood', label: 'Blood Work' },
            { id: 'scan', label: 'Scans' },
            { id: 'prescription', label: 'Prescriptions' }
          ] as const).map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider font-mono border transition-all ${
                activeCategory === cat.id
                  ? 'bg-[#2A1525] text-white border-[#2A1525]'
                  : 'bg-[#FEFAF8] border-[#C8877A]/10 text-[#8A7A82] hover:text-[#2A1525]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="flex gap-1 bg-[#FEFAF8] border border-[#C8877A]/15 rounded-xl p-1 w-full sm:w-auto justify-around sm:justify-start">
          {(['all', 'verified', 'unverified'] as const).map(v => (
            <button
              key={v}
              onClick={() => setVerificationFilter(v)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                verificationFilter === v
                  ? 'bg-white text-[#2A1525] shadow-sm'
                  : 'text-[#8A7A82] hover:text-[#2A1525]'
              }`}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-white border border-[#C8877A]/10 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FEFAF8] border-b border-[#C8877A]/10 text-[10px] font-bold text-[#8A7A82] uppercase tracking-wider">
                <th className="px-5 py-3">Mother Name</th>
                <th className="px-5 py-3">File Reference</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Date Uploaded</th>
                <th className="px-5 py-3">Liaison Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#C8877A]/10 text-xs">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-[#8A7A82]">
                    No reports match selection.
                  </td>
                </tr>
              ) : (
                filteredReports.map((rep) => (
                  <tr key={rep.id} className="hover:bg-[#FEFAF8]/50 transition-colors">
                    {/* Mother */}
                    <td className="px-5 py-4">
                      <span className="font-bold text-[#2A1525] block">{rep.motherName}</span>
                      <span className="text-[9px] font-mono text-[#8A7A82]">ID: {rep.motherId}</span>
                    </td>

                    {/* File */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#C8877A] flex-shrink-0" />
                        <div>
                          <span className="font-medium text-[#2A1525] block truncate max-w-[180px]">{rep.fileName}</span>
                          <span className="text-[9px] text-[#8A7A82] font-mono">{rep.fileSize}</span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-5 py-4 uppercase font-mono text-[9px] font-bold text-[#8A7A82]">
                      {rep.category}
                    </td>

                    {/* Date */}
                    <td className="px-5 py-4 text-[#2A1525]">
                      {rep.date}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      {rep.verified ? (
                        <div className="flex items-center gap-1 text-green-700 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20 w-fit">
                          <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
                          <span className="text-[9px] font-bold uppercase tracking-wider font-mono">Verified</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-[#B8906A] bg-[#B8906A]/10 px-2 py-0.5 rounded border border-[#B8906A]/20 w-fit">
                          <AlertTriangle className="w-3.5 h-3.5 text-[#B8906A]" />
                          <span className="text-[9px] font-bold uppercase tracking-wider font-mono">Pending MD</span>
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => openPreview(rep.id)}
                          className="w-8 h-8 rounded-lg bg-[#FEFAF8] border border-[#C8877A]/15 flex items-center justify-center text-[#2A1525] hover:bg-[#F5E8E6] transition-colors"
                          title="Preview"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {!rep.verified && (
                          <button
                            onClick={() => handleVerify(rep.id)}
                            className="bg-[#2A1525] hover:bg-[#1E0E1B] text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg shadow-sm"
                          >
                            Verify
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Preview Modal overlay */}
      {previewingReport && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#C8877A]/10 shadow-2xl max-w-lg w-full overflow-hidden animate-scale-in">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-[#C8877A]/10 bg-[#FEFAF8] flex justify-between items-center">
              <div>
                <span className="text-[9px] font-bold text-[#C8877A] uppercase tracking-widest font-mono">Clinical Document Preview</span>
                <h4 className="text-sm font-serif font-bold text-[#2A1525]">{previewingReport.fileName}</h4>
              </div>
              <button 
                onClick={closePreview}
                className="w-7 h-7 rounded-lg bg-white border border-[#C8877A]/15 flex items-center justify-center text-[#8A7A82] hover:text-[#2A1525]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 space-y-4">
              <div className="bg-[#FEFAF8] border border-[#C8877A]/10 rounded-xl p-3.5 text-xs space-y-2">
                <div className="grid grid-cols-2 gap-2 text-[#8A7A82]">
                  <div>Patient Name: <span className="font-bold text-[#2A1525]">{previewingReport.motherName}</span></div>
                  <div>Category: <span className="font-mono uppercase font-bold text-[#2A1525]">{previewingReport.category}</span></div>
                  <div>Upload Date: <span className="font-mono text-[#2A1525]">{previewingReport.date}</span></div>
                  <div>Status: <span className="font-bold text-[#2A1525]">{previewingReport.verified ? 'Verified' : 'Pending Verification'}</span></div>
                </div>
              </div>

              {/* Dynamic preview details based on report category */}
              <div className="border border-[#C8877A]/15 rounded-xl p-4 bg-white space-y-3">
                {previewingReport.category === 'blood' && (
                  <div className="space-y-2.5 text-xs">
                    <span className="font-bold text-[#2A1525] block">Complete Blood Count (CBC) Panel Readings</span>
                    <div className="space-y-1.5 divide-y divide-[#C8877A]/10">
                      <div className="flex justify-between py-1 text-[11px]">
                        <span className="text-[#8A7A82]">Hemoglobin (Hb)</span>
                        <span className="font-bold text-red-600 font-mono">9.8 g/dL (Low Ref: 11.5 - 15)</span>
                      </div>
                      <div className="flex justify-between py-1 text-[11px]">
                        <span className="text-[#8A7A82]">Red Blood Cell count</span>
                        <span className="font-bold text-[#2A1525] font-mono">3.9 million/µL</span>
                      </div>
                      <div className="flex justify-between py-1 text-[11px]">
                        <span className="text-[#8A7A82]">Ferritin (Iron store)</span>
                        <span className="font-bold text-[#2A1525] font-mono">14 ng/mL (Reference &gt; 15)</span>
                      </div>
                      <div className="flex justify-between py-1 text-[11px]">
                        <span className="text-[#8A7A82]">White Blood Cell count</span>
                        <span className="font-bold text-[#2A1525] font-mono">8,500 /µL (Normal)</span>
                      </div>
                    </div>
                  </div>
                )}

                {previewingReport.category === 'scan' && (
                  <div className="space-y-2.5 text-xs text-center">
                    <span className="font-bold text-[#2A1525] block text-left">Obstetric Ultrasound scan parameters</span>
                    
                    {/* Simulated scan placeholder image - professional looking vector grid */}
                    <div className="w-full h-40 bg-[#1C0B18] rounded-xl flex flex-col items-center justify-center border border-white/[0.04] text-white">
                      <div className="border border-white/20 p-2.5 rounded-full mb-1">
                        <FileText className="w-8 h-8 text-[#C8877A]" />
                      </div>
                      <span className="text-[10px] font-mono text-[#E8B4AC]">USG Scan Profile - 32 Weeks</span>
                      <span className="text-[8px] font-mono text-[#8A7A82]">Double-loop Doppler blood flow grid</span>
                    </div>

                    <div className="text-left bg-[#FEFAF8] p-2.5 rounded-lg border border-[#C8877A]/10 text-[10px] font-mono space-y-1">
                      <div>Fetal Heart Rate (FHR): 142 bpm (Stable)</div>
                      <div>Biparietal Diameter (BPD): 82mm</div>
                      <div>Amniotic Fluid Index (AFI): 12 cm (Normal)</div>
                    </div>
                  </div>
                )}

                {previewingReport.category === 'prescription' && (
                  <div className="space-y-2.5 text-xs">
                    <span className="font-bold text-[#2A1525] block">Approved Prescriptions Dose Registry</span>
                    <div className="bg-[#FEFAF8] p-3 rounded-lg border border-[#C8877A]/10 space-y-2">
                      <div className="flex items-start gap-2">
                        <div className="mt-1 w-1.5 h-1.5 rounded-full bg-[#C8877A]" />
                        <div>
                          <span className="font-bold text-[#2A1525]">Iron (Ferrous Ascorbate) 100mg</span>
                          <span className="block text-[10px] text-[#8A7A82]">Dose: 1 tablet daily (Morning, post-food)</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="mt-1 w-1.5 h-1.5 rounded-full bg-[#C8877A]" />
                        <div>
                          <span className="font-bold text-[#2A1525]">Calcium Carbonate 500mg + Vitamin D3</span>
                          <span className="block text-[10px] text-[#8A7A82]">Dose: 1 tablet daily (Night, post-food)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Notes */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#8A7A82] uppercase tracking-wider block">Clinical Notes & Verification Logs</span>
                <p className="bg-[#FEFAF8] p-3 rounded-xl border border-[#C8877A]/10 text-xs italic text-[#2A1525] leading-relaxed">
                  &quot;{previewingReport.notes || 'No notes submitted.'}&quot;
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-4 border-t border-[#C8877A]/10 bg-[#FEFAF8] flex justify-end gap-2">
              <button 
                onClick={closePreview}
                className="text-xs font-bold text-[#8A7A82] hover:text-[#2A1525] px-3 py-1.5"
              >
                Close View
              </button>
              {!previewingReport.verified && (
                <button
                  onClick={() => {
                    handleVerify(previewingReport.id);
                    closePreview();
                  }}
                  className="bg-[#2A1525] text-white text-xs font-bold px-4 py-1.5 rounded-lg shadow-sm"
                >
                  Verify Document
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
