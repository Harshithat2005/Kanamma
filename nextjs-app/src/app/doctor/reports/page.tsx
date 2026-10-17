'use client';

import React, { useState } from 'react';
import { useLanguage } from '../components/LanguageContext';
import { useDoctorData } from '../components/DoctorDataContext';
import {
  CheckCircle,
  XCircle,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Clock,
  Check
} from 'lucide-react';

export default function LabReportsReview() {
  const { t } = useLanguage();
  const { reports, verifyReport } = useDoctorData();
  const [selectedReportId, setSelectedReportId] = useState<string>(
    reports.length > 0 ? reports[0].id : ''
  );
  const [zoomLevel, setZoomLevel] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [comments, setComments] = useState('');
  const [annotated, setAnnotated] = useState(false);

  const selectedReport = reports.find((r) => r.id === selectedReportId);

  const handleVerify = (status: 'approved' | 'rejected') => {
    if (!selectedReport) return;
    verifyReport(selectedReport.id, status, comments);
    setComments('');
    setAnnotated(false);
  };

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 10, 150));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 10, 70));
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-[#2A1525] tracking-tight">
          {t('reports')}
        </h1>
        <p className="text-sm text-[#2A1525]/60 font-sans font-medium mt-1">
          Review lab diagnostics, hemoglobin scans, and confirm/reject medical records upload requests
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Reports List */}
        <div className="bg-[#FFFFFF] border border-[#C8877A]/10 rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-[#C8877A]/10 bg-[#FEFAF8]">
            <h4 className="font-serif font-bold text-[#2A1525]">Diagnostics Inbox</h4>
            <span className="text-[10px] text-[#2A1525]/60 font-semibold uppercase tracking-wider mt-0.5">
              {reports.filter((r) => r.status === 'pending').length} Pending Review
            </span>
          </div>

          <div className="divide-y divide-[#C8877A]/5 max-h-[500px] overflow-y-auto">
            {reports.map((rep) => {
              const active = rep.id === selectedReportId;
              return (
                <button
                  key={rep.id}
                  onClick={() => {
                    setSelectedReportId(rep.id);
                    setComments(rep.reviewerNotes || '');
                    setAnnotated(false);
                  }}
                  className={`w-full text-left p-4 transition flex flex-col space-y-1.5 ${
                    active ? 'bg-[#C8877A]/10 border-l-4 border-[#C8877A]' : 'hover:bg-[#FEFAF8]/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-bold text-xs text-[#2A1525]">
                      {rep.patientName}
                    </span>
                    <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full ${
                      rep.status === 'approved'
                        ? 'bg-green-50 text-green-700 border border-green-100'
                        : rep.status === 'rejected'
                        ? 'bg-red-50 text-red-700 border border-red-100'
                        : 'bg-orange-50 text-orange-700 border border-orange-100'
                    }`}>
                      {rep.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[#2A1525]/60 font-medium">
                    <span className="truncate max-w-[170px]">{rep.fileName}</span>
                    <span>{rep.date}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Splitscreen Report Viewer */}
        <div className="lg:col-span-2 bg-[#FFFFFF] border border-[#C8877A]/10 rounded-xl shadow-sm overflow-hidden flex flex-col min-h-[500px]">
          {selectedReport ? (
            <div className="flex-1 flex flex-col">
              {/* Toolbar */}
              <div className="p-4 border-b border-[#C8877A]/10 bg-[#FEFAF8] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center space-x-3 text-xs">
                  <span className="font-bold text-[#2A1525]">{selectedReport.patientName}</span>
                  <span className="text-[#C8877A] font-semibold font-mono uppercase text-[10px] bg-[#C8877A]/10 px-2 py-0.5 rounded">
                    {selectedReport.category}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleZoomOut}
                    className="p-1.5 border border-[#C8877A]/20 bg-white hover:bg-[#FEFAF8] text-[#2A1525]/70 rounded transition"
                    title="Zoom Out"
                  >
                    <ZoomOut className="h-3.5 w-3.5" />
                  </button>
                  <span className="text-[10px] font-bold text-[#2A1525]/60 w-8 text-center">
                    {zoomLevel}%
                  </span>
                  <button
                    onClick={handleZoomIn}
                    className="p-1.5 border border-[#C8877A]/20 bg-white hover:bg-[#FEFAF8] text-[#2A1525]/70 rounded transition"
                    title="Zoom In"
                  >
                    <ZoomIn className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={handleRotate}
                    className="p-1.5 border border-[#C8877A]/20 bg-white hover:bg-[#FEFAF8] text-[#2A1525]/70 rounded transition"
                    title="Rotate 90°"
                  >
                    <RotateCw className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setAnnotated(!annotated)}
                    className={`px-2 py-1 text-[10px] font-bold border rounded transition ${
                      annotated
                        ? 'bg-[#C8877A] text-white border-transparent'
                        : 'border-[#C8877A]/20 text-[#C8877A] hover:bg-[#C8877A]/10'
                    }`}
                  >
                    {annotated ? 'Annotated' : 'Annotate'}
                  </button>
                </div>
              </div>

              {/* Document Canvas Area */}
              <div className="flex-1 bg-gray-50 p-6 overflow-auto flex items-center justify-center border-b border-[#C8877A]/10">
                <div
                  className="bg-white border border-gray-200 shadow-lg p-6 max-w-md w-full transition-all duration-200"
                  style={{
                    transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)`,
                    transformOrigin: 'center center'
                  }}
                >
                  {/* Visual simulated document layout */}
                  {selectedReport.category === 'blood' ? (
                    <div className="space-y-4">
                      {/* Letterhead */}
                      <div className="text-center border-b border-gray-300 pb-3">
                        <h4 className="font-serif text-sm font-bold text-gray-800 uppercase tracking-wide">
                          Nelamangala Diagnostic Laboratory
                        </h4>
                        <p className="text-[9px] text-gray-500 font-medium">
                          NABL Accredited • Hub-8 Karnataka
                        </p>
                      </div>

                      {/* Metadata */}
                      <div className="grid grid-cols-2 gap-2 text-[9px] text-gray-600 border-b border-gray-100 pb-2">
                        <div>
                          <span>Patient: <strong>{selectedReport.patientName}</strong></span>
                        </div>
                        <div>
                          <span>Date: <strong>{selectedReport.date}</strong></span>
                        </div>
                        <div>
                          <span>Report ID: <strong>{selectedReport.id}</strong></span>
                        </div>
                        <div>
                          <span>Ref By: <strong>Dr. Shreya Roy</strong></span>
                        </div>
                      </div>

                      {/* Report Results */}
                      <div className="space-y-2">
                        <h5 className="text-[10px] uppercase font-bold text-gray-700 tracking-wider">
                          Complete Blood Count (CBC)
                        </h5>
                        <table className="w-full text-left text-[9px]">
                          <thead>
                            <tr className="border-b border-gray-200 text-gray-500 font-semibold">
                              <th className="py-1">Parameter</th>
                              <th className="py-1">Result</th>
                              <th className="py-1">Reference Range</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
                            <tr className={selectedReport.id === 'drp1' ? 'text-red-600 font-bold bg-red-50/40' : ''}>
                              <td className="py-1">Hemoglobin (Hb)</td>
                              <td className="py-1">{selectedReport.id === 'drp1' ? '8.9 g/dL' : '12.2 g/dL'}</td>
                              <td className="py-1">11.0 - 15.0 g/dL</td>
                            </tr>
                            <tr>
                              <td className="py-1">RBC Count</td>
                              <td className="py-1">3.9 million/µL</td>
                              <td className="py-1">3.8 - 4.8 million/µL</td>
                            </tr>
                            <tr>
                              <td className="py-1">Hematocrit (PCV)</td>
                              <td className="py-1">33 %</td>
                              <td className="py-1">33 - 43 %</td>
                            </tr>
                            <tr className={selectedReport.id === 'drp1' ? 'text-red-600 font-bold bg-red-50/40' : ''}>
                              <td className="py-1">Platelet Count</td>
                              <td className="py-1">142,000 /µL</td>
                              <td className="py-1">150,000 - 450,000 /µL</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      {/* Annotations layer */}
                      {annotated && (
                        <div className="border border-dashed border-red-500 rounded p-2 text-[8px] text-red-500 bg-red-50/30">
                          <strong>* Doctor Remark (Clinical Annotation):</strong> Anemic indices confirmed. Iron supplementation dosage must be adjusted immediately.
                        </div>
                      )}

                      <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-[7px] text-gray-400">
                        <span>Barcode: ||||| | |||| |||</span>
                        <span>Digitally verified at source</span>
                      </div>
                    </div>
                  ) : (
                    // Ultrasound / Scan visual
                    <div className="space-y-3">
                      <div className="bg-black text-[#00FF00] p-4 font-mono text-[9px] space-y-2 rounded border border-gray-800">
                        <div className="flex justify-between border-b border-gray-900 pb-1">
                          <span>KANNAMMA SCAN HUB</span>
                          <span>GA: 32W 4D</span>
                        </div>
                        {/* Abstract ultrasound canvas mock */}
                        <div className="h-44 bg-[#101010] relative flex items-center justify-center overflow-hidden border border-gray-900 rounded">
                          {/* Radial scanning beam lines */}
                          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-[#0A0A0A] to-black opacity-60" />
                          <div className="absolute inset-x-0 top-1/2 h-px bg-[#00FF00]/10 border-t border-dashed" />
                          {/* Simulated fetus geometry */}
                          <div className="h-20 w-28 rounded-[60%] border-2 border-dashed border-white/20 rotate-12 flex items-center justify-center">
                            <span className="text-[7px] text-white/40 tracking-wider">FETUS (HEAD)</span>
                          </div>
                          {/* Ultrasound crosshair */}
                          <div className="absolute top-1/3 left-1/3 text-[9px] font-bold text-[#00FF00]">
                            + BPD: 82.4mm
                          </div>
                          {annotated && (
                            <div className="absolute top-10 right-4 border border-dashed border-red-500 p-1 rounded bg-black/60 text-red-500 text-[8px]">
                              CRL & FHR checked
                            </div>
                          )}
                        </div>
                        <div className="flex justify-between text-[8px] border-t border-gray-900 pt-1.5">
                          <span>FPS: 28</span>
                          <span>FHR: 148 bpm</span>
                        </div>
                      </div>
                      <div className="text-[9px] text-gray-600 font-medium">
                        <strong>Growth Doppler Scan:</strong> Placental artery resistance within normal indices. Twin B growth monitoring recommended.
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Review Form & Actions */}
              <div className="p-6 bg-white space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#2A1525] uppercase tracking-wider mb-2">
                    Review Remarks / Stamp Comments
                  </label>
                  <textarea
                    rows={2}
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder="Enter observations, hemoglobin stamp remarks, or rejection grounds..."
                    className="w-full text-xs p-3 border border-[#C8877A]/20 bg-[#FEFAF8] focus:outline-none focus:border-[#C8877A] rounded-lg"
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="text-xs text-[#2A1525]/60 font-medium flex items-center space-x-1.5">
                    {selectedReport.verified ? (
                      <>
                        <CheckCircle className="h-4.5 w-4.5 text-green-500" />
                        <span>Verified by {selectedReport.verifiedBy}</span>
                      </>
                    ) : (
                      <>
                        <Clock className="h-4.5 w-4.5 text-orange-400" />
                        <span>Awaiting specialist verification signature</span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleVerify('rejected')}
                      className="px-4 py-2 border border-red-200 text-red-600 text-xs font-bold rounded-lg hover:bg-red-50 transition flex items-center space-x-1.5"
                    >
                      <XCircle className="h-4 w-4" />
                      <span>{t('rejectDocument')}</span>
                    </button>
                    <button
                      onClick={() => handleVerify('approved')}
                      className="px-4 py-2 bg-[#2A1525] text-white text-xs font-bold rounded-lg hover:bg-[#2A1525]/90 transition flex items-center space-x-1.5"
                    >
                      <Check className="h-4 w-4" />
                      <span>{t('verifyDocument')}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-[#2A1525]/40 italic">
              No reports available for review.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
