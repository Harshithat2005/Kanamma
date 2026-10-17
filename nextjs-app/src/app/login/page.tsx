'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

type UserRole = 'mother' | 'asha' | 'doctor' | 'anc' | null;
type AuthMode = 'login' | 'signup';

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>(null);
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) return;
    setOtpSent(true);
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 4) return;
    setIsVerifying(true);
    // Simulate verification
    setTimeout(() => {
      if (role === 'asha') {
        router.push('/asha/dashboard');
      } else if (role === 'doctor') {
        router.push('/doctor/dashboard');
      } else if (role === 'anc') {
        router.push('/anc/dashboard');
      } else {
        router.push('/mother/dashboard');
      }
    }, 1500);
  };

  const resetFlow = () => {
    setRole(null);
    setOtpSent(false);
    setOtp('');
    setPhone('');
    setName('');
    setIsVerifying(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-4 py-12"
      style={{ background: 'linear-gradient(155deg, #FFF8F6 0%, #FEF0ED 20%, #F8E8F0 45%, #F0DDE8 65%, #EDE0F2 85%, #F5E8F5 100%)' }}
    >
      {/* Ambient glow effects */}
      <div className="absolute w-[800px] h-[800px] -right-[200px] -top-[150px] rounded-full pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, rgba(232,180,172,0.3) 0%, rgba(196,168,212,0.12) 40%, transparent 65%)', filter: 'blur(100px)' }}
      />
      <div className="absolute w-[600px] h-[600px] -left-[150px] -bottom-[100px] rounded-full pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, rgba(200,135,122,0.2) 0%, rgba(196,168,212,0.1) 45%, transparent 65%)', filter: 'blur(90px)' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Brand header */}
        <div className="text-center mb-8">
          <Link href="/" className="no-underline inline-block group">
            <h1 className="font-serif text-4xl font-medium tracking-wider text-[#2A1525] mb-1">
              Kann<span className="text-[#C8877A]">amma</span>
            </h1>
            <p className="text-[0.65rem] tracking-[0.2em] uppercase text-[#8A7A82] font-sans">
              AI-Powered Maternal Healthcare
            </p>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-xl border border-[#C8877A]/15 rounded-[2rem] shadow-[0_20px_60px_rgba(42,21,37,0.08)] overflow-hidden">

          <AnimatePresence mode="wait">
            {/* ─── STEP 1: ROLE SELECTION ─── */}
            {!role && (
              <motion.div
                key="role-select"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.35 }}
                className="p-8 md:p-10"
              >
                <div className="text-center mb-8">
                  <h2 className="font-serif text-2xl font-medium text-[#2A1525] mb-2">Welcome Back</h2>
                  <p className="text-sm text-[#8A7A82]">Choose your role to continue</p>
                </div>

                <div className="space-y-4">
                  {/* Mother Card */}
                  <button
                    onClick={() => setRole('mother')}
                    className="w-full group bg-gradient-to-br from-[#FEFAF8] to-[#F5E8E6]/50 hover:from-[#F5E8E6] hover:to-[#F0DDE8]/60 border border-[#C8877A]/20 hover:border-[#C8877A]/50 rounded-2xl p-5 text-left transition-all duration-300 hover:shadow-lg hover:shadow-[#C8877A]/10 hover:-translate-y-0.5"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#C8877A] to-[#D8A48F] flex items-center justify-center shadow-md shadow-[#C8877A]/25 shrink-0">
                        <svg width="28" height="28" fill="none" stroke="white" strokeWidth="1.5" viewBox="0 0 24 24">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-serif text-lg font-semibold text-[#2A1525] mb-0.5 group-hover:text-[#C8877A] transition-colors">
                          I&apos;m a Mother
                        </h3>
                        <p className="text-xs text-[#8A7A82] leading-relaxed">
                          Track your pregnancy, view vitals, and stay connected with your ASHA worker
                        </p>
                      </div>
                      <svg width="20" height="20" fill="none" stroke="#C8877A" strokeWidth="2" viewBox="0 0 24 24" className="shrink-0 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </div>
                  </button>

                  {/* ASHA Worker Card */}
                  <button
                    onClick={() => setRole('asha')}
                    className="w-full group bg-gradient-to-br from-[#F5F0F8] to-[#EDE0F2]/50 hover:from-[#EDE0F2] hover:to-[#E8D5F0]/60 border border-[#B5648C]/15 hover:border-[#B5648C]/40 rounded-2xl p-5 text-left transition-all duration-300 hover:shadow-lg hover:shadow-[#B5648C]/10 hover:-translate-y-0.5"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2A1525] to-[#4A2540] flex items-center justify-center shadow-md shadow-[#2A1525]/25 shrink-0">
                        <svg width="28" height="28" fill="none" stroke="white" strokeWidth="1.5" viewBox="0 0 24 24">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-serif text-lg font-semibold text-[#2A1525] mb-0.5 group-hover:text-[#B5648C] transition-colors">
                          I&apos;m an ASHA Worker
                        </h3>
                        <p className="text-xs text-[#8A7A82] leading-relaxed">
                          Access the maternal command center, manage mothers, and coordinate care
                        </p>
                      </div>
                      <svg width="20" height="20" fill="none" stroke="#B5648C" strokeWidth="2" viewBox="0 0 24 24" className="shrink-0 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </div>
                  </button>

                  {/* Doctor Card */}
                  <button
                    onClick={() => setRole('doctor')}
                    className="w-full group bg-gradient-to-br from-[#FEFAF8] to-[#EDE4F5]/40 hover:from-[#EDE4F5]/60 hover:to-[#C4A8D4]/20 border border-[#C4A8D4]/30 hover:border-[#C4A8D4]/60 rounded-2xl p-5 text-left transition-all duration-300 hover:shadow-lg hover:shadow-[#C4A8D4]/10 hover:-translate-y-0.5"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2A1525] to-[#C4A8D4] flex items-center justify-center shadow-md shadow-[#2A1525]/25 shrink-0">
                        <svg width="28" height="28" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-serif text-lg font-semibold text-[#2A1525] mb-0.5 group-hover:text-[#C4A8D4] transition-colors">
                          I&apos;m a Doctor / Specialist
                        </h3>
                        <p className="text-xs text-[#8A7A82] leading-relaxed">
                          Review patient vitals, verify scans, write prescriptions, and coordinate emergency care
                        </p>
                      </div>
                      <svg width="20" height="20" fill="none" stroke="#C4A8D4" strokeWidth="2" viewBox="0 0 24 24" className="shrink-0 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </div>
                  </button>

                  {/* ANC Coordinator Card */}
                  <button
                    onClick={() => setRole('anc')}
                    className="w-full group bg-gradient-to-br from-[#F0FAF7] to-[#E5F5F0]/50 hover:from-[#E5F5F0] hover:to-[#A7F3D0]/30 border border-emerald-500/20 hover:border-emerald-500/50 rounded-2xl p-5 text-left transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10 hover:-translate-y-0.5"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-500 flex items-center justify-center shadow-md shadow-emerald-600/25 shrink-0">
                        <svg width="28" height="28" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                          <rect x="8" y="2" width="8" height="4" rx="1" ry="1" stroke="white" strokeWidth="2" fill="none" />
                          <path d="M9 12h6" />
                          <path d="M9 16h6" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-serif text-lg font-semibold text-[#2A1525] mb-0.5 group-hover:text-emerald-600 transition-colors">
                          I&apos;m an ANC Coordinator
                        </h3>
                        <p className="text-xs text-[#8A7A82] leading-relaxed">
                          Manage the Antenatal Care Center, verify reports, track high-risk cases, and referrals
                        </p>
                      </div>
                      <svg width="20" height="20" fill="none" stroke="#10B981" strokeWidth="2" viewBox="0 0 24 24" className="shrink-0 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </div>
                  </button>
                </div>
              </motion.div>
            )}

            {/* ─── STEP 2: AUTH FORM ─── */}
            {role && (
              <motion.div
                key="auth-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35 }}
                className="p-8 md:p-10"
              >
                {/* Role badge + back */}
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={resetFlow}
                    className="flex items-center gap-1.5 text-xs text-[#8A7A82] hover:text-[#C8877A] transition-colors"
                  >
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    Change Role
                  </button>
                  <span className={`text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full ${
                    role === 'asha'
                      ? 'bg-[#2A1525]/10 text-[#2A1525]'
                      : role === 'doctor'
                      ? 'bg-[#EDE4F5] text-[#2A1525] border border-[#C4A8D4]/20'
                      : role === 'anc'
                      ? 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/10'
                      : 'bg-[#C8877A]/10 text-[#C8877A]'
                  }`}>
                    {role === 'asha' 
                      ? 'ASHA Worker' 
                      : role === 'doctor' 
                      ? 'Doctor / Specialist' 
                      : role === 'anc' 
                      ? 'ANC Coordinator' 
                      : 'Mother'}
                  </span>
                </div>

                {/* Auth mode tabs */}
                <div className="flex bg-[#F5E8E6]/40 rounded-xl p-1 mb-6">
                  <button
                    onClick={() => { setAuthMode('login'); setOtpSent(false); setOtp(''); }}
                    className={`flex-1 py-2.5 rounded-lg text-xs font-bold tracking-wider uppercase transition-all duration-200 ${
                      authMode === 'login'
                        ? 'bg-white text-[#2A1525] shadow-sm'
                        : 'text-[#8A7A82] hover:text-[#2A1525]'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => { setAuthMode('signup'); setOtpSent(false); setOtp(''); }}
                    className={`flex-1 py-2.5 rounded-lg text-xs font-bold tracking-wider uppercase transition-all duration-200 ${
                      authMode === 'signup'
                        ? 'bg-white text-[#2A1525] shadow-sm'
                        : 'text-[#8A7A82] hover:text-[#2A1525]'
                    }`}
                  >
                    Sign Up
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  {!otpSent ? (
                    <motion.form
                      key="phone-form"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                      onSubmit={handleSendOTP}
                      className="space-y-4"
                    >
                      {authMode === 'signup' && (
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-[#2A1525] block">Full Name</label>
                          <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={
                              role === 'doctor'
                                ? 'Dr. Enter your name'
                                : role === 'anc'
                                ? 'Enter coordinator name'
                                : role === 'asha'
                                ? 'Enter ASHA name'
                                : 'Enter your full name'
                            }
                            className="w-full border border-[#C8877A]/20 focus:border-[#C8877A] rounded-xl px-4 py-3 text-sm focus:outline-none bg-white/60 placeholder:text-[#8A7A82]/50 transition-colors"
                          />
                        </div>
                      )}

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#2A1525] block">Mobile Number</label>
                        <div className="flex gap-2">
                          <span className="border border-[#C8877A]/20 rounded-xl px-3 py-3 text-sm text-[#8A7A82] bg-[#FEFAF8]/80 font-mono shrink-0">
                            +91
                          </span>
                          <input
                            type="tel"
                            required
                            maxLength={10}
                            value={phone}
                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                            placeholder="Enter 10-digit number"
                            className="w-full border border-[#C8877A]/20 focus:border-[#C8877A] rounded-xl px-4 py-3 text-sm font-mono focus:outline-none bg-white/60 placeholder:text-[#8A7A82]/50 transition-colors tracking-wider"
                          />
                        </div>
                      </div>

                      {role === 'asha' && authMode === 'signup' && (
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-[#2A1525] block">ASHA Worker ID</label>
                          <input
                            type="text"
                            placeholder="e.g. ASHA-KA-2024-001"
                            className="w-full border border-[#C8877A]/20 focus:border-[#C8877A] rounded-xl px-4 py-3 text-sm font-mono focus:outline-none bg-white/60 placeholder:text-[#8A7A82]/50 transition-colors tracking-wider"
                          />
                        </div>
                      )}

                      {role === 'doctor' && authMode === 'signup' && (
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-[#2A1525] block">Medical License Number</label>
                          <input
                            type="text"
                            placeholder="e.g. KMC-88741"
                            className="w-full border border-[#C8877A]/20 focus:border-[#C8877A] rounded-xl px-4 py-3 text-sm font-mono focus:outline-none bg-white/60 placeholder:text-[#8A7A82]/50 transition-colors tracking-wider"
                          />
                        </div>
                      )}

                      {role === 'anc' && authMode === 'signup' && (
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-[#2A1525] block">ANC Facility Code</label>
                          <input
                            type="text"
                            placeholder="e.g. ANC-NEL-56001"
                            className="w-full border border-[#C8877A]/20 focus:border-[#C8877A] rounded-xl px-4 py-3 text-sm font-mono focus:outline-none bg-white/60 placeholder:text-[#8A7A82]/50 transition-colors tracking-wider"
                          />
                        </div>
                      )}

                      <button
                        type="submit"
                        className="w-full bg-[#2A1525] hover:bg-[#C8877A] text-white py-3.5 rounded-xl text-sm font-bold tracking-wider uppercase transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-[#C8877A]/25 hover:-translate-y-0.5 mt-2"
                      >
                        {authMode === 'login' ? 'Send OTP' : 'Create Account'}
                      </button>
                    </motion.form>
                  ) : (
                    <motion.form
                      key="otp-form"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                      onSubmit={handleVerifyOTP}
                      className="space-y-5"
                    >
                      <div className="text-center space-y-2">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-3">
                          <svg width="28" height="28" fill="none" stroke="#4CAF9A" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                          </svg>
                        </div>
                        <h3 className="font-serif text-lg font-bold text-[#2A1525]">Verify Your Number</h3>
                        <p className="text-xs text-[#8A7A82]">
                          A 6-digit OTP has been sent to <span className="font-mono font-bold text-[#2A1525]">+91 {phone}</span>
                        </p>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#2A1525] block">Enter OTP</label>
                        <input
                          type="text"
                          required
                          maxLength={6}
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                          placeholder="● ● ● ● ● ●"
                          className="w-full border border-[#C8877A]/20 focus:border-[#C8877A] rounded-xl px-4 py-3.5 text-center text-xl font-mono tracking-[0.5em] focus:outline-none bg-white/60 placeholder:text-[#8A7A82]/30 transition-colors"
                          autoFocus
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isVerifying}
                        className="w-full bg-[#2A1525] hover:bg-[#C8877A] disabled:bg-[#C8877A] text-white py-3.5 rounded-xl text-sm font-bold tracking-wider uppercase transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-[#C8877A]/25 flex items-center justify-center gap-2"
                      >
                        {isVerifying ? (
                          <>
                            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Verifying...
                          </>
                        ) : (
                          `Verify & Continue as ${
                            role === 'asha'
                              ? 'ASHA Worker'
                              : role === 'doctor'
                              ? 'Doctor'
                              : role === 'anc'
                              ? 'ANC Coordinator'
                              : 'Mother'
                          }`
                        )}
                      </button>

                      <div className="flex justify-between items-center pt-1">
                        <button
                          type="button"
                          onClick={() => { setOtpSent(false); setOtp(''); }}
                          className="text-xs text-[#8A7A82] hover:text-[#C8877A] transition-colors"
                        >
                          ← Change number
                        </button>
                        <button
                          type="button"
                          className="text-xs text-[#C8877A] font-semibold hover:text-[#2A1525] transition-colors"
                        >
                          Resend OTP
                        </button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>

                {/* Divider */}
                <div className="flex items-center gap-3 mt-6 mb-4">
                  <div className="flex-1 h-px bg-[#C8877A]/10" />
                  <span className="text-[10px] text-[#8A7A82] uppercase tracking-widest">or</span>
                  <div className="flex-1 h-px bg-[#C8877A]/10" />
                </div>

                {/* Quick demo access */}
                <button
                  onClick={() => {
                    if (role === 'asha') router.push('/asha/dashboard');
                    else if (role === 'doctor') router.push('/doctor/dashboard');
                    else if (role === 'anc') router.push('/anc/dashboard');
                    else router.push('/mother/dashboard');
                  }}
                  className="w-full border border-dashed border-[#C8877A]/30 text-[#8A7A82] hover:text-[#C8877A] hover:border-[#C8877A]/60 py-3 rounded-xl text-xs font-semibold tracking-wider transition-all duration-200"
                >
                  Skip — Enter Demo Mode →
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <p className="text-center text-[10px] text-[#8A7A82]/60 mt-6 leading-relaxed">
          By continuing, you agree to Kannamma&apos;s Terms of Service<br />
          and acknowledge our Privacy Policy
        </p>
      </motion.div>
    </div>
  );
}
