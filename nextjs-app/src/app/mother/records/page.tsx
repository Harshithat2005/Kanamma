'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import {
  Upload, FileText, Eye, Download, Share2, CheckCircle, AlertCircle,
  Lock, Filter, Droplets, Shield, ScanLine, ZoomIn, ZoomOut, RotateCw, Printer, X, Check
} from 'lucide-react';
import MotherShell from '../components/MotherShell';
import { useLanguage } from '../components/LanguageContext';
import { mockRecords, type MedicalRecord } from '../data';

// ── Types ──────────────────────────────────
type UploadState = 'idle' | 'dragover' | 'uploading' | 'success' | 'error';
type CategoryFilter = 'all' | 'blood' | 'prescription' | 'anc' | 'scan';

// ── Category config ────────────────────────
const categoryStyles: Record<string, { bg: string; text: string; label: string }> = {
  blood: { bg: 'bg-red-500/10', text: 'text-red-400', label: 'Blood Work' },
  prescription: { bg: 'bg-blue-500/10', text: 'text-blue-400', label: 'Prescription' },
  anc: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', label: 'ANC Report' },
  scan: { bg: 'bg-purple-500/10', text: 'text-purple-400', label: 'Scan' },
};

const filterTabs: { key: CategoryFilter; labelKey: string }[] = [
  { key: 'all', labelKey: 'all' },
  { key: 'blood', labelKey: 'bloodReports' },
  { key: 'prescription', labelKey: 'prescriptions' },
  { key: 'anc', labelKey: 'ancCards' },
  { key: 'scan', labelKey: 'scanReports' },
];

// ── Quick Access config ────────────────────
const quickAccessItems = [
  { icon: ScanLine, title: 'Last Ultrasound', date: 'Apr 28, 2025', category: 'scan', recordId: 'r2', accent: 'from-purple-500/20 to-purple-500/5' },
  { icon: FileText, title: 'Current Prescription', date: 'May 5, 2025', category: 'prescription', recordId: 'r3', accent: 'from-blue-500/20 to-blue-500/5' },
  { icon: Droplets, title: 'Blood Group Card', date: 'Jan 15, 2025', category: 'blood', recordId: 'r1', accent: 'from-red-500/20 to-red-500/5' },
  { icon: Shield, title: 'Insurance Card', date: 'Mar 1, 2025', category: 'anc', recordId: 'r4', accent: 'from-amber-500/20 to-amber-500/5' },
];

// ── Container animations ───────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.05 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
};

// ── Page Component ─────────────────────────
function RecordsContent() {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Core State
  const [records, setRecords] = useState<MedicalRecord[]>(mockRecords);
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [uploadCategory, setUploadCategory] = useState<MedicalRecord['category']>('blood');
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('all');
  
  // Preview Modal State
  const [previewRecord, setPreviewRecord] = useState<MedicalRecord | null>(null);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [shareToast, setShareToast] = useState<string | null>(null);

  // ── Upload handlers ──────────────────────
  const simulateUpload = useCallback((fileName: string, fileSize: number) => {
    setUploadedFileName(fileName);
    setUploadState('uploading');
    setUploadProgress(0);

    const duration = 1200; // 1.2s for clean loader simulation
    const interval = 40;
    const steps = duration / interval;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      setUploadProgress(Math.min(Math.round((step / steps) * 100), 100));
      if (step >= steps) {
        clearInterval(timer);
        setUploadState('success');
        
        // Format size
        let formattedSize = '1.0 MB';
        if (fileSize < 1024 * 1024) {
          formattedSize = `${(fileSize / 1024).toFixed(0)} KB`;
        } else {
          formattedSize = `${(fileSize / (1024 * 1024)).toFixed(1)} MB`;
        }
        
        // Add new record to local list
        const newRecord: MedicalRecord = {
          id: `r-${Date.now()}`,
          name: fileName,
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          category: uploadCategory,
          size: formattedSize
        };
        
        setRecords(prev => [newRecord, ...prev]);

        setTimeout(() => {
          setUploadState('idle');
          setUploadProgress(0);
          setUploadedFileName('');
        }, 2000);
      }
    }, interval);
  }, [uploadCategory]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setUploadState('dragover');
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setUploadState('idle');
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file) {
      simulateUpload(file.name, file.size);
    } else {
      setUploadState('idle');
    }
  }, [simulateUpload]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      simulateUpload(file.name, file.size);
    }
    if (e.target) e.target.value = '';
  }, [simulateUpload]);

  const handleZoneClick = useCallback(() => {
    if (uploadState === 'idle' || uploadState === 'dragover') {
      fileInputRef.current?.click();
    }
  }, [uploadState]);

  // Toast helper
  const showToast = (msg: string) => {
    setShareToast(msg);
    setTimeout(() => setShareToast(null), 3000);
  };

  // Document action handlers
  const handlePrint = (recordName: string) => {
    showToast(`Sending ${recordName} to printer queue...`);
  };

  const handleDownload = (recordName: string) => {
    showToast(`Downloading ${recordName} to local device...`);
  };

  const handleShare = (recordName: string) => {
    showToast(`Encrypted share link for ${recordName} copied to clipboard.`);
  };

  // ── Filter records ───────────────────────
  const filteredRecords = activeFilter === 'all'
    ? records
    : records.filter((r) => r.category === activeFilter);

  // Match quick access items to existing records
  const handleQuickAccessClick = (category: string, recordId: string) => {
    const found = records.find(r => r.id === recordId || r.category === category);
    if (found) {
      setPreviewRecord(found);
      setZoom(100);
      setRotation(0);
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Toast Alert */}
      <AnimatePresence>
        {shareToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-[#C8877A] text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-medium flex items-center gap-2 border border-white/10"
          >
            <CheckCircle className="w-4 h-4" />
            {shareToast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Page Header ─────────────────── */}
      <motion.div variants={itemVariants}>
        <h1 className="font-serif text-2xl lg:text-3xl text-[#E8E4F0] mb-1">
          {t('myRecords')}
        </h1>
        <p className="text-[#8A7A92] text-sm">
          Securely manage and access your clinical documents
        </p>
      </motion.div>

      {/* ── Upload Zone ─────────────────── */}
      <motion.div variants={itemVariants}>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.dcm"
          className="hidden"
          onChange={handleFileSelect}
        />
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleZoneClick}
          className={`
            relative rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer
            ${uploadState === 'dragover'
              ? 'bg-[#C8877A]/[0.06] border-2 border-dashed border-[#C8877A]/40 shadow-[0_0_40px_rgba(200,135,122,0.08)]'
              : uploadState === 'uploading' || uploadState === 'success'
                ? 'bg-white/[0.03] border-2 border-dashed border-white/[0.08]'
                : 'bg-white/[0.03] border-2 border-dashed border-white/[0.08] hover:border-white/[0.12] hover:bg-white/[0.04]'
            }
          `}
        >
          <AnimatePresence mode="wait">
            {/* Idle / Dragover state */}
            {(uploadState === 'idle' || uploadState === 'dragover') && (
              <motion.div
                key="idle"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="flex flex-col items-center gap-3"
              >
                <div className={`
                  w-14 h-14 rounded-2xl flex items-center justify-center transition-colors duration-300
                  ${uploadState === 'dragover' ? 'bg-[#C8877A]/20' : 'bg-white/[0.04]'}
                `}>
                  <Upload className={`w-6 h-6 transition-colors duration-300 ${
                    uploadState === 'dragover' ? 'text-[#C8877A]' : 'text-[#8A7A92]'
                  }`} />
                </div>
                
                {/* Category Selector integrated inside the zone */}
                <div 
                  className="flex justify-center items-center gap-2 mb-1 px-3 py-1 bg-white/[0.02] border border-white/[0.06] rounded-xl" 
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="text-[11px] text-[#8A7A92]">Category:</span>
                  <select
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value as MedicalRecord['category'])}
                    className="bg-transparent text-[#E8E4F0] text-[11px] font-medium rounded cursor-pointer focus:outline-none pr-1 select-none"
                  >
                    <option value="blood" className="bg-[#0C0C14]">Blood Work</option>
                    <option value="scan" className="bg-[#0C0C14]">Scan</option>
                    <option value="prescription" className="bg-[#0C0C14]">Prescription</option>
                    <option value="anc" className="bg-[#0C0C14]">ANC Card</option>
                  </select>
                </div>

                <div>
                  <p className="text-[#E8E4F0] text-sm font-medium">{t('uploadArea')}</p>
                  <p className="text-[#8A7A92] text-xs mt-1">{t('accepted')}</p>
                </div>
              </motion.div>
            )}

            {/* Uploading state */}
            {uploadState === 'uploading' && (
              <motion.div
                key="uploading"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="flex flex-col items-center gap-4"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-[#C8877A]" />
                  <span className="text-[#E8E4F0] text-sm font-medium truncate max-w-[200px]">
                    {uploadedFileName}
                  </span>
                </div>
                <div className="w-full max-w-xs">
                  <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-[#C8877A] rounded-full"
                      initial={{ width: '0%' }}
                      animate={{ width: `${uploadProgress}%` }}
                      transition={{ duration: 0.1 }}
                    />
                  </div>
                  <p className="text-[#8A7A92] text-xs mt-2 font-mono tabular-nums">
                    {t('uploadProgress')} {uploadProgress}%
                  </p>
                </div>
              </motion.div>
            )}

            {/* Success state */}
            {uploadState === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="flex flex-col items-center gap-3"
              >
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center"
                >
                  <CheckCircle className="w-6 h-6 text-emerald-400" />
                </motion.div>
                <div>
                  <p className="text-emerald-400 text-sm font-medium">{t('uploadSuccess')}</p>
                  <p className="text-[#8A7A92] text-xs mt-1 font-mono">{uploadedFileName}</p>
                </div>
              </motion.div>
            )}

            {/* Error state */}
            {uploadState === 'error' && (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="flex flex-col items-center gap-3"
              >
                <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <p className="text-red-400 text-sm font-medium">Upload failed</p>
                  <p className="text-[#8A7A92] text-xs mt-1">Please try again</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* ── Category Filter Tabs ────────── */}
      <motion.div variants={itemVariants} className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <Filter className="w-4 h-4 text-[#8A7A92] flex-shrink-0 mr-1" />
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveFilter(tab.key)}
            className={`
              px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200 border
              ${activeFilter === tab.key
                ? 'bg-[#C8877A]/10 text-[#C8877A] border-[#C8877A]/25'
                : 'bg-white/[0.02] text-[#8A7A92] border-white/[0.04] hover:bg-white/[0.04] hover:text-[#E8E4F0]'
              }
            `}
          >
            {t(tab.labelKey)}
          </button>
        ))}
      </motion.div>

      {/* ── Records Table (Desktop) ─────── */}
      <motion.div variants={itemVariants} className="hidden md:block">
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[1fr_140px_120px_80px_120px] gap-4 px-5 py-3 border-b border-white/[0.06]">
            <span className="text-[#8A7A92] text-xs font-medium uppercase tracking-wider">Document</span>
            <span className="text-[#8A7A92] text-xs font-medium uppercase tracking-wider">Category</span>
            <span className="text-[#8A7A92] text-xs font-medium uppercase tracking-wider">Date</span>
            <span className="text-[#8A7A92] text-xs font-medium uppercase tracking-wider">Size</span>
            <span className="text-[#8A7A92] text-xs font-medium uppercase tracking-wider text-right">Actions</span>
          </div>

          {/* Table rows */}
          <div className="divide-y divide-white/[0.04]">
            {filteredRecords.map((record) => (
              <div
                key={record.id}
                className="grid grid-cols-[1fr_140px_120px_80px_120px] gap-4 px-5 py-3.5 bg-white/[0.01] hover:bg-white/[0.03] border-b border-white/[0.04] transition-all duration-150 group"
              >
                {/* Document name */}
                <div className="flex items-center gap-3 min-w-0">
                  <FileText className="w-4 h-4 text-[#8A7A92] flex-shrink-0 group-hover:text-[#C8877A] transition-colors" />
                  <span className="text-[#E8E4F0] text-sm truncate font-medium">{record.name}</span>
                </div>

                {/* Category pill */}
                <div className="flex items-center">
                  <span className={`
                    px-2.5 py-1 rounded-lg text-[11px] font-medium
                    ${categoryStyles[record.category]?.bg || 'bg-white/10'} ${categoryStyles[record.category]?.text || 'text-white'}
                  `}>
                    {categoryStyles[record.category]?.label || 'Record'}
                  </span>
                </div>

                {/* Date */}
                <div className="flex items-center">
                  <span className="text-[#8A7A92] text-sm font-mono tabular-nums">{record.date}</span>
                </div>

                {/* Size */}
                <div className="flex items-center">
                  <span className="text-[#8A7A92] text-sm font-mono tabular-nums">{record.size}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-1">
                  <button 
                    onClick={() => {
                      setPreviewRecord(record);
                      setZoom(100);
                      setRotation(0);
                    }}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[#8A7A92] hover:text-[#E8E4F0] hover:bg-white/[0.06] transition-all" 
                    title="View Clinical Preview"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => handleDownload(record.name)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[#8A7A92] hover:text-[#E8E4F0] hover:bg-white/[0.06] transition-all" 
                    title="Download"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => handleShare(record.name)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[#8A7A92] hover:text-[#C8877A] hover:bg-[#C8877A]/10 transition-all" 
                    title="Share"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredRecords.length === 0 && (
            <div className="px-5 py-12 text-center">
              <FileText className="w-8 h-8 text-[#8A7A92]/40 mx-auto mb-3" />
              <p className="text-[#8A7A92] text-sm">No records in this category</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* ── Records Cards (Mobile) ──────── */}
      <motion.div variants={itemVariants} className="md:hidden space-y-3">
        {filteredRecords.map((record) => (
          <div
            key={record.id}
            className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-4 hover:bg-white/[0.05] transition-all duration-150"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4.5 h-4.5 text-[#8A7A92]" />
                </div>
                <div className="min-w-0">
                  <p className="text-[#E8E4F0] text-sm font-medium truncate">{record.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`
                      px-2 py-0.5 rounded-md text-[10px] font-medium
                      ${categoryStyles[record.category]?.bg || 'bg-white/10'} ${categoryStyles[record.category]?.text || 'text-white'}
                    `}>
                      {categoryStyles[record.category]?.label || 'Record'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-white/[0.04]">
              <div className="flex items-center gap-4">
                <span className="text-[#8A7A92] text-xs font-mono tabular-nums">{record.date}</span>
                <span className="text-[#8A7A92]/50 text-xs font-mono tabular-nums">{record.size}</span>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => {
                    setPreviewRecord(record);
                    setZoom(100);
                    setRotation(0);
                  }}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[#8A7A92] hover:text-[#E8E4F0] hover:bg-white/[0.06] transition-all"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => handleDownload(record.name)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[#8A7A92] hover:text-[#E8E4F0] hover:bg-white/[0.06] transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => handleShare(record.name)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[#8A7A92] hover:text-[#C8877A] hover:bg-[#C8877A]/10 transition-all"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredRecords.length === 0 && (
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl px-5 py-12 text-center">
            <FileText className="w-8 h-8 text-[#8A7A92]/40 mx-auto mb-3" />
            <p className="text-[#8A7A92] text-sm">No records in this category</p>
          </div>
        )}
      </motion.div>

      {/* ── Quick Access ────────────────── */}
      <motion.div variants={itemVariants}>
        <h2 className="font-serif text-lg text-[#E8E4F0] mb-3">{t('quickAccess')}</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {quickAccessItems.map((item) => (
            <div
              key={item.title}
              onClick={() => handleQuickAccessClick(item.category, item.recordId)}
              className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-4 hover:bg-white/[0.06] hover:border-white/[0.1] transition-all duration-200 cursor-pointer group shadow-[0_0_30px_rgba(200,135,122,0.03)]"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.accent} flex items-center justify-center mb-3`}>
                <item.icon className="w-4.5 h-4.5 text-[#E8E4F0]/70 group-hover:text-[#E8E4F0] transition-colors" />
              </div>
              <p className="text-[#E8E4F0] text-sm font-medium leading-tight">{item.title}</p>
              <p className="text-[#8A7A92] text-[11px] mt-1 font-mono tabular-nums">{item.date}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Privacy Notice ──────────────── */}
      <motion.div variants={itemVariants}>
        <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-3 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center flex-shrink-0 mt-0.5">
            <Lock className="w-3.5 h-3.5 text-[#8A7A92]" />
          </div>
          <div>
            <p className="text-[#8A7A92] text-xs leading-relaxed">
              {t('privacyNote')}
            </p>
          </div>
        </div>
      </motion.div>

      {/* ── DOCUMENT PREVIEW MODAL ──────────────── */}
      <AnimatePresence>
        {previewRecord && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.96, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="bg-[#0C0C14] border border-white/10 rounded-2xl w-full max-w-5xl h-[85vh] flex flex-col md:flex-row overflow-hidden shadow-2xl"
            >
              {/* Left Panel: The Document Preview Workspace */}
              <div className="flex-1 flex flex-col h-[55vh] md:h-full bg-[#07070B] relative">
                {/* Preview Toolbar */}
                <div className="h-12 border-b border-white/[0.08] px-4 flex items-center justify-between z-10 bg-[#0C0C14]/90 backdrop-blur-md">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4.5 h-4.5 text-[#C8877A]" />
                    <span className="text-xs text-[#8A7A92] font-mono truncate max-w-[200px] md:max-w-xs">
                      {previewRecord.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setZoom(z => Math.max(50, z - 10))} 
                      className="p-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] text-[#8A7A92] hover:text-[#E8E4F0] transition-colors"
                      title="Zoom Out"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>
                    <span className="text-[10px] font-mono text-[#8A7A92] w-10 text-center">
                      {zoom}%
                    </span>
                    <button 
                      onClick={() => setZoom(z => Math.min(200, z + 10))} 
                      className="p-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] text-[#8A7A92] hover:text-[#E8E4F0] transition-colors"
                      title="Zoom In"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                    <span className="w-px h-4 bg-white/[0.08]" />
                    <button 
                      onClick={() => setRotation(r => (r + 90) % 360)} 
                      className="p-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] text-[#8A7A92] hover:text-[#E8E4F0] transition-colors"
                      title="Rotate Document"
                    >
                      <RotateCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Viewport Workspace */}
                <div className="flex-1 overflow-auto p-6 flex items-start justify-center bg-[#07070C] scrollbar-thin">
                  <div 
                    className="transition-transform duration-200 ease-out shadow-2xl bg-white text-black p-6 md:p-8 rounded-lg w-full max-w-[550px] min-h-[680px] flex flex-col justify-between"
                    style={{ 
                      transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                      transformOrigin: 'top center',
                      color: '#1A1A1A'
                    }}
                  >
                    {/* Render Category Specific Clinical Template */}
                    {previewRecord.category === 'blood' && (
                      <div className="h-full flex flex-col justify-between flex-1">
                        <div>
                          {/* Diagnostic Lab Header */}
                          <div className="border-b-2 border-red-800 pb-3 flex justify-between items-start">
                            <div>
                              <h3 className="text-base font-bold tracking-tight text-red-900 font-sans">KANNAMMA DIAGNOSTIC LABS</h3>
                              <p className="text-[9px] text-gray-500 font-mono">122 clinical lab network · ISO 9001:2015</p>
                            </div>
                            <div className="text-right">
                              <p className="text-[9px] font-mono text-gray-600">ID: DIAG-2025-084B</p>
                              <p className="text-[9px] font-mono text-gray-600">Date: {previewRecord.date}</p>
                            </div>
                          </div>

                          {/* Patient details block */}
                          <div className="grid grid-cols-2 gap-2 text-[10px] my-3 p-2 bg-gray-50 rounded border border-gray-100 font-mono">
                            <div>
                              <p><span className="text-gray-500">Patient:</span> <strong className="text-gray-900">Priya Sharma</strong></p>
                              <p><span className="text-gray-500">Gestational Age:</span> <strong className="text-gray-900">28 Weeks</strong></p>
                            </div>
                            <div>
                              <p><span className="text-gray-500">Referring Physician:</span> <strong className="text-gray-900">Dr. Lakshmi, OB-GYN</strong></p>
                              <p><span className="text-gray-500">Status:</span> <strong className="text-green-700">Completed</strong></p>
                            </div>
                          </div>

                          {/* Table of Vitals */}
                          <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 font-sans">HEMOGRAM & BIOMARKERS</h4>
                          <div className="border border-gray-200 rounded overflow-hidden text-[11px]">
                            {/* Table Headers */}
                            <div className="grid grid-cols-[1fr_80px_110px_60px] bg-gray-100 px-3 py-1.5 font-bold border-b border-gray-200 text-gray-700">
                              <span>Test Parameter</span>
                              <span>Observed</span>
                              <span>Reference Range</span>
                              <span className="text-right">Status</span>
                            </div>
                            {/* Rows */}
                            <div className="divide-y divide-gray-100 bg-white">
                              <div className="grid grid-cols-[1fr_80px_110px_60px] px-3 py-2 font-mono">
                                <span className="font-sans font-medium">Hemoglobin (Hb)</span>
                                <span>11.2 g/dL</span>
                                <span className="text-gray-500">11.0 - 14.0 g/dL</span>
                                <span className="text-green-700 font-sans font-bold text-right">NORMAL</span>
                              </div>
                              <div className="grid grid-cols-[1fr_80px_110px_60px] px-3 py-2 font-mono">
                                <span className="font-sans font-medium">WBC Count (Total)</span>
                                <span>8,450 /cumm</span>
                                <span className="text-gray-500">4,000 - 11,000 /cumm</span>
                                <span className="text-green-700 font-sans font-bold text-right">NORMAL</span>
                              </div>
                              <div className="grid grid-cols-[1fr_80px_110px_60px] px-3 py-2 font-mono">
                                <span className="font-sans font-medium">Platelet Count</span>
                                <span>215,000 /cumm</span>
                                <span className="text-gray-500">150k - 450k /cumm</span>
                                <span className="text-green-700 font-sans font-bold text-right">NORMAL</span>
                              </div>
                              <div className="grid grid-cols-[1fr_80px_110px_60px] px-3 py-2 font-mono">
                                <span className="font-sans font-medium">Blood Glucose (Fasting)</span>
                                <span>85 mg/dL</span>
                                <span className="text-gray-500">&lt; 95 mg/dL</span>
                                <span className="text-green-700 font-sans font-bold text-right">NORMAL</span>
                              </div>
                              <div className="grid grid-cols-[1fr_80px_110px_60px] px-3 py-2 font-mono">
                                <span className="font-sans font-medium">Glucose (1-Hr PP)</span>
                                <span>122 mg/dL</span>
                                <span className="text-gray-500">&lt; 140 mg/dL</span>
                                <span className="text-green-700 font-sans font-bold text-right">NORMAL</span>
                              </div>
                            </div>
                          </div>

                          {/* Notes */}
                          <div className="mt-4 p-2 bg-gray-50 rounded border border-gray-100">
                            <p className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">Clinical Comment</p>
                            <p className="text-[10px] text-gray-700 leading-normal mt-1">
                              Glucose levels indicate normal gestational carbohydrate metabolism. Oral glucose tolerance values are well within physiological limits. Iron reserve thresholds normal. Recommend continuance of current gestational supplementation routine.
                            </p>
                          </div>
                        </div>

                        {/* Signatures */}
                        <div className="border-t border-gray-200 pt-4 flex justify-between items-end mt-6 text-[9px] font-mono">
                          <div>
                            <p className="text-gray-400">Barcode Secure Verification</p>
                            <div className="w-20 h-6 bg-gray-200 flex items-center justify-center text-[7px] text-gray-600 mt-1 border border-dashed border-gray-300">
                              |||| | ||| | ||
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="w-16 h-8 border border-dashed border-gray-300 rounded mb-1 flex items-center justify-center text-[7px] text-gray-400">
                              Stamp Box
                            </div>
                            <p className="font-bold text-gray-800">Dr. K. Srinivas, MD</p>
                            <p className="text-gray-500">Chief Pathologist</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {previewRecord.category === 'prescription' && (
                      <div className="h-full flex flex-col justify-between flex-1">
                        <div>
                          {/* Clinic Header */}
                          <div className="border-b border-gray-300 pb-3 flex justify-between items-start">
                            <div>
                              <h3 className="text-sm font-bold text-gray-900 font-sans">CITY MATERNITY HOSPITAL</h3>
                              <p className="text-[9px] text-gray-500">OB-GYN Department · Bengaluru</p>
                            </div>
                            <div className="text-right">
                              <h4 className="text-[10px] font-bold text-gray-800">Dr. Lakshmi, OB-GYN</h4>
                              <p className="text-[8px] text-gray-500 font-mono">Reg No: KMC-98432</p>
                            </div>
                          </div>

                          {/* Patient details block */}
                          <div className="grid grid-cols-3 gap-1 text-[10px] my-3 pb-2 border-b border-gray-100 font-mono">
                            <span><strong className="text-gray-900">Priya Sharma</strong></span>
                            <span>Age: 28</span>
                            <span className="text-right">Date: {previewRecord.date}</span>
                          </div>

                          {/* Rx symbol */}
                          <div className="text-2xl font-serif italic text-blue-900 mb-2">Rx</div>

                          {/* Rx prescription items */}
                          <div className="space-y-4 text-xs font-mono pl-2 text-gray-800">
                            <div>
                              <div className="flex justify-between font-bold">
                                <span>1. Cap. Folic Acid 5mg</span>
                                <span>Qty: 30</span>
                              </div>
                              <p className="text-[10px] text-gray-500 mt-0.5">Dosage: 1-0-0 · Before morning meal · Duration: 30 days</p>
                            </div>
                            <div>
                              <div className="flex justify-between font-bold">
                                <span>2. Tab. Iron + Vitamin C 100mg</span>
                                <span>Qty: 30</span>
                              </div>
                              <p className="text-[10px] text-gray-500 mt-0.5">Dosage: 0-0-1 · Evening with meal (for optimal absorption) · Duration: 30 days</p>
                            </div>
                            <div>
                              <div className="flex justify-between font-bold">
                                <span>3. Tab. Calcium 500mg</span>
                                <span>Qty: 30</span>
                              </div>
                              <p className="text-[10px] text-gray-500 mt-0.5">Dosage: 0-1-0 · After midday meal · Duration: 30 days</p>
                            </div>
                          </div>

                          {/* Clinical Advice */}
                          <div className="mt-8 border-t border-gray-100 pt-3">
                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">General Advice</p>
                            <ul className="list-disc list-inside text-[10px] text-gray-600 mt-1 space-y-0.5 font-mono">
                              <li>Maintain hydration baseline (2.5L daily).</li>
                              <li>Log regular kick counts on daily schedule.</li>
                              <li>Walk for 15-20 minutes daily.</li>
                              <li>Return for clinic checkup in 2 weeks or if symptoms arise.</li>
                            </ul>
                          </div>
                        </div>

                        {/* Signatures */}
                        <div className="border-t border-gray-200 pt-3 flex justify-end text-[9px] font-mono mt-8">
                          <div className="text-right">
                            <div className="h-6 w-20 ml-auto flex items-center justify-center border border-dashed border-gray-200 text-[6px] text-gray-400 mb-1">
                              Digital Signature
                            </div>
                            <p className="font-bold text-gray-800">Dr. Lakshmi, DGO</p>
                            <p className="text-gray-500">Consultant OB-GYN</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {previewRecord.category === 'scan' && (
                      <div className="h-full flex flex-col justify-between flex-1 bg-[#06060A] text-[#E8E4F0] p-4 rounded-md border border-white/10">
                        <div>
                          {/* Ultrasound Clinic Header */}
                          <div className="border-b border-white/10 pb-2 flex justify-between items-start text-white">
                            <div>
                              <h3 className="text-xs font-bold font-sans tracking-wide">PRECISION SCANS & ULTRASOUNDS</h3>
                              <p className="text-[7px] text-[#8A7A92] font-mono">City Imaging Center, Bangalore</p>
                            </div>
                            <div className="text-right font-mono text-[7px] text-[#8A7A92]">
                              <p>ID: USG-24891</p>
                              <p>Date: {previewRecord.date}</p>
                            </div>
                          </div>

                          {/* Ultrasound Scan Screen */}
                          <div className="relative border border-white/10 bg-[#000000] rounded my-4 p-2 flex flex-col items-center justify-center h-52 overflow-hidden select-none">
                            {/* Grid layer */}
                            <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{
                              backgroundImage: 'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)',
                              backgroundSize: '12px 12px'
                            }} />

                            {/* Stylized gestational sac and fetal positioning schematic */}
                            <svg width="100%" height="100%" viewBox="0 0 160 100" className="relative z-10 opacity-70">
                              <circle cx="80" cy="50" r="35" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.75" strokeDasharray="2 2" />
                              
                              {/* Position curve */}
                              <path 
                                d="M60,45 C70,30 90,30 100,45 C105,55 95,65 85,65 C80,65 75,60 75,55" 
                                fill="none" 
                                stroke="#FFFFFF" 
                                strokeWidth="1" 
                                strokeLinecap="round" 
                              />
                              
                              {/* Measurement cursors */}
                              <line x1="60" y1="45" x2="100" y2="45" stroke="#34D399" strokeWidth="0.5" strokeDasharray="1 1" />
                              <circle cx="60" cy="45" r="1.5" fill="#34D399" />
                              <circle cx="100" cy="45" r="1.5" fill="#34D399" />
                              
                              {/* Doppler HR curve */}
                              <path d="M100,80 L105,80 L108,72 L110,88 L113,68 L116,92 L119,80 L129,80" fill="none" stroke="#60A5FA" strokeWidth="0.75" />
                              <text x="100" y="66" fill="#60A5FA" fontSize="4.5" fontFamily="monospace">DOPPLER FHR</text>
                            </svg>

                            {/* Medical HUD overlays */}
                            <div className="absolute top-1.5 left-1.5 text-[6px] font-mono text-[#8A7A92] leading-tight text-left">
                              <p>B-Mode: 5.5MHz</p>
                              <p>Gn: 78dB</p>
                              <p>DR: 65dB</p>
                            </div>
                            <div className="absolute top-1.5 right-1.5 text-[6px] font-mono text-[#8A7A92] leading-tight text-right">
                              <p>FPS: 32</p>
                              <p>MI: 0.2</p>
                              <p>TIS: 0.1</p>
                            </div>
                            <div className="absolute bottom-1.5 left-1.5 text-[6px] font-mono text-[#34D399] leading-tight">
                              <p>+ CRL: 16.5cm</p>
                            </div>
                            <div className="absolute bottom-1.5 right-1.5 text-[6px] font-mono text-[#60A5FA] leading-tight text-right">
                              <p>FHR: 144 BPM</p>
                            </div>
                          </div>

                          {/* Scan measurements */}
                          <div className="grid grid-cols-2 gap-4 text-[10px] font-mono text-gray-300">
                            <div className="space-y-1">
                              <p><span className="text-gray-500">Presentation:</span> Cephalic</p>
                              <p><span className="text-gray-500">Gestational Age:</span> 24 Weeks 3 Days</p>
                              <p><span className="text-gray-500">Fetal Heart Rate:</span> 144 BPM (Regular)</p>
                            </div>
                            <div className="space-y-1">
                              <p><span className="text-gray-500">Placental Position:</span> Anterior, High Lying</p>
                              <p><span className="text-gray-500">Amniotic Fluid Index:</span> 14.2 cm (Normal)</p>
                              <p><span className="text-gray-500">Estimated Fetal Weight:</span> 600 g</p>
                            </div>
                          </div>
                        </div>

                        {/* Scan Footnote */}
                        <div className="border-t border-white/10 pt-2 text-[8px] font-mono text-gray-500 text-center mt-4">
                          Secure Cloud Encrypted Diagnostic Scan · Certified by Dr. R. Murugan, Senior Radiologist
                        </div>
                      </div>
                    )}

                    {previewRecord.category === 'anc' && (
                      <div className="h-full flex flex-col justify-between flex-1">
                        <div>
                          {/* ANC Card Header */}
                          <div className="border-b-2 border-emerald-800 pb-2 flex justify-between items-start">
                            <div>
                              <h3 className="text-xs font-bold text-emerald-950 font-sans">MOTHER & CHILD HEALTH CARD</h3>
                              <p className="text-[8px] text-gray-500 uppercase tracking-widest font-mono">Government ANC Registry</p>
                            </div>
                            <span className="bg-emerald-100 text-emerald-800 text-[8px] font-bold px-2 py-0.5 rounded border border-emerald-200">
                              Visit 6 Card
                            </span>
                          </div>

                          {/* Core Details Grid */}
                          <div className="grid grid-cols-2 gap-2 text-[10px] my-3 p-2 bg-emerald-50/50 rounded border border-emerald-100 font-mono">
                            <div>
                              <p><span className="text-gray-500">Mother:</span> Priya Sharma</p>
                              <p><span className="text-gray-500">Reg ID:</span> ANC-2025-8842</p>
                            </div>
                            <div>
                              <p><span className="text-gray-500">LMP:</span> Nov 22, 2024</p>
                              <p><span className="text-gray-500">EDD:</span> Sep 12, 2025</p>
                            </div>
                          </div>

                          {/* Clinic checklist & parameters */}
                          <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 font-sans">CLINICAL EXAM FINDINGS</h4>
                          <div className="border border-gray-200 rounded overflow-hidden text-[10px]">
                            {/* Headers */}
                            <div className="grid grid-cols-[1.2fr_1fr_1fr] bg-gray-50 px-2 py-1.5 font-bold border-b border-gray-200 text-gray-600">
                              <span>Checkup Type</span>
                              <span>Measurement</span>
                              <span>Notes</span>
                            </div>
                            {/* Rows */}
                            <div className="divide-y divide-gray-100 bg-white font-mono">
                              <div className="grid grid-cols-[1.2fr_1fr_1fr] px-2 py-1.5">
                                <span>Maternal Weight</span>
                                <span>62.8 kg</span>
                                <span className="text-gray-500">Total gain: +7.8kg</span>
                              </div>
                              <div className="grid grid-cols-[1.2fr_1fr_1fr] px-2 py-1.5">
                                <span>Blood Pressure</span>
                                <span>118/76 mmHg</span>
                                <span className="text-green-700">Normotensive</span>
                              </div>
                              <div className="grid grid-cols-[1.2fr_1fr_1fr] px-2 py-1.5">
                                <span>Fundal Height</span>
                                <span>27 cm</span>
                                <span className="text-gray-500">Normal for gest. age</span>
                              </div>
                              <div className="grid grid-cols-[1.2fr_1fr_1fr] px-2 py-1.5">
                                <span>Fetal Heart Sound</span>
                                <span>Present</span>
                                <span className="text-gray-500">Regular rhythm</span>
                              </div>
                              <div className="grid grid-cols-[1.2fr_1fr_1fr] px-2 py-1.5">
                                <span>Tdap Vaccine</span>
                                <span>Administered</span>
                                <span className="text-green-700">Recorded on card</span>
                              </div>
                            </div>
                          </div>

                          {/* Medical remarks */}
                          <div className="mt-4 p-2 bg-gray-50 rounded border border-gray-100">
                            <p className="text-[8px] text-gray-500 uppercase font-bold tracking-wider">Remarks</p>
                            <p className="text-[10px] text-gray-700 mt-0.5 font-mono">
                              Fetal growth on track. Weight gain matches standard percentile curves. Blood pressure stable. Next ANC checkup (ANC 7) scheduled for June 15, 2025.
                            </p>
                          </div>
                        </div>

                        {/* Footer stamp */}
                        <div className="border-t border-gray-100 pt-3 flex justify-between items-end text-[9px] font-mono mt-6">
                          <div>
                            <p className="text-gray-400">Card Issuer Office</p>
                            <p className="font-bold text-gray-800">Primary Health Center (PHC)</p>
                          </div>
                          <div className="text-right">
                            <p className="text-gray-400">Verified Officer Sign</p>
                            <p className="font-bold text-gray-900">Sister Meena, LHV</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Panel: Document Metadata & Security Settings */}
              <div className="w-full md:w-[320px] border-t md:border-t-0 md:border-l border-white/[0.08] p-5 flex flex-col justify-between h-[30vh] md:h-full bg-[#0C0C14]">
                <div className="space-y-4">
                  {/* Title & Category Info */}
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-[#C8877A]">
                      {categoryStyles[previewRecord.category]?.label || 'Medical Record'}
                    </span>
                    <h3 className="text-sm font-semibold text-[#E8E4F0] truncate mt-1">
                      {previewRecord.name}
                    </h3>
                  </div>

                  {/* Metadata Fields */}
                  <div className="space-y-2 border-y border-white/[0.06] py-3.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#8A7A92]">File Size</span>
                      <span className="font-mono text-[#E8E4F0]">{previewRecord.size}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#8A7A92]">Uploaded Date</span>
                      <span className="font-mono text-[#E8E4F0]">{previewRecord.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#8A7A92]">Storage Integrity</span>
                      <span className="text-emerald-400 font-medium flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> SECURED
                      </span>
                    </div>
                  </div>

                  {/* SHA-256 Hash Display */}
                  <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-3">
                    <p className="text-[10px] text-[#8A7A92] uppercase font-mono tracking-wider">SHA-256 Integrity Hash</p>
                    <p className="text-[10px] font-mono text-[#E8E4F0]/80 break-all mt-1 bg-black/30 p-1.5 rounded border border-white/5 select-all">
                      8f4c9c1a3b8d9e0f2c4a6b8d9e0f1c2b3a4e5f6a7b8c9d0e1f2a3b4c5d6e7f8
                    </p>
                  </div>

                  {/* Auto-Sharing Info */}
                  <div className="bg-[#C8877A]/5 border border-[#C8877A]/15 rounded-xl p-3 flex items-start gap-2.5">
                    <Shield className="w-4 h-4 text-[#C8877A] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[11px] font-medium text-[#E8E4F0]">Emergency Dispatch Sync</p>
                      <p className="text-[10px] text-[#8A7A92] mt-0.5 leading-relaxed">
                        This file is synced to your clinical emergency pack. It is automatically shared with EMT dispatchers during a triggered SOS alert.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Grid */}
                <div className="space-y-2 mt-4 md:mt-0">
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => handlePrint(previewRecord.name)}
                      className="flex items-center justify-center gap-1.5 bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06] text-[#E8E4F0] py-2 px-3 rounded-xl text-xs font-medium transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      Print
                    </button>
                    <button 
                      onClick={() => handleDownload(previewRecord.name)}
                      className="flex items-center justify-center gap-1.5 bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06] text-[#E8E4F0] py-2 px-3 rounded-xl text-xs font-medium transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => handleShare(previewRecord.name)}
                    className="w-full flex items-center justify-center gap-1.5 bg-[#C8877A]/10 border border-[#C8877A]/20 hover:bg-[#C8877A]/15 text-[#C8877A] py-2.5 rounded-xl text-xs font-medium transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    Share Encrypted Link
                  </button>

                  <button 
                    onClick={() => setPreviewRecord(null)}
                    className="w-full flex items-center justify-center gap-1.5 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.05] text-[#8A7A92] hover:text-[#E8E4F0] py-2 rounded-xl text-xs font-medium transition-colors mt-2"
                  >
                    <X className="w-3.5 h-3.5" />
                    Close Preview
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Page Export ─────────────────────────────
export default function RecordsPage() {
  return (
    <MotherShell>
      <RecordsContent />
    </MotherShell>
  );
}
