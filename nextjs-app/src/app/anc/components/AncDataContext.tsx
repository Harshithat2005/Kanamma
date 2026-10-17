'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { 
  AncMother, AncAppointment, AncReport, AncReferral, AncMessage,
  mockMothers, mockAppointments, mockReports, mockReferrals, mockMessages
} from '../data';

interface AncDataContextType {
  mothers: AncMother[];
  appointments: AncAppointment[];
  reports: AncReport[];
  referrals: AncReferral[];
  messages: AncMessage[];
  assignAsha: (motherId: string, ashaId: string) => void;
  addAppointment: (newApt: Omit<AncAppointment, 'id'>) => void;
  updateAppointmentStatus: (id: string, status: AncAppointment['status']) => void;
  addReport: (newRep: Omit<AncReport, 'id'>) => void;
  verifyReport: (id: string, doctorName: string) => void;
  addReferral: (newRef: Omit<AncReferral, 'id' | 'timelineLogs' | 'timestamp'>) => void;
  updateReferralStatus: (id: string, status: AncReferral['status'], logText: string) => void;
  sendMessage: (ashaId: string, content: string) => void;
}

const AncDataContext = createContext<AncDataContextType | undefined>(undefined);

export function AncDataProvider({ children }: { children: React.ReactNode }) {
  const [mothers, setMothers] = useState<AncMother[]>(mockMothers);
  const [appointments, setAppointments] = useState<AncAppointment[]>(mockAppointments);
  const [reports, setReports] = useState<AncReport[]>(mockReports);
  const [referrals, setReferrals] = useState<AncReferral[]>(mockReferrals);
  const [messages, setMessages] = useState<AncMessage[]>(mockMessages);

  const assignAsha = useCallback((motherId: string, ashaId: string) => {
    setMothers(prev => prev.map(m => m.id === motherId ? { ...m, assignedAshaId: ashaId } : m));
  }, []);

  const addAppointment = useCallback((newApt: Omit<AncAppointment, 'id'>) => {
    const id = `apt-${Date.now()}`;
    setAppointments(prev => [
      { id, ...newApt } as AncAppointment,
      ...prev
    ]);
  }, []);

  const updateAppointmentStatus = useCallback((id: string, status: AncAppointment['status']) => {
    setAppointments(prev => prev.map(apt => apt.id === id ? { ...apt, status } : apt));
  }, []);

  const addReport = useCallback((newRep: Omit<AncReport, 'id'>) => {
    const id = `rep-${Date.now()}`;
    setReports(prev => [
      { id, ...newRep } as AncReport,
      ...prev
    ]);
  }, []);

  const verifyReport = useCallback((id: string, doctorName: string) => {
    setReports(prev => prev.map(rep => rep.id === id ? { 
      ...rep, 
      verified: true, 
      verifiedBy: doctorName 
    } : rep));
  }, []);

  const addReferral = useCallback((newRef: Omit<AncReferral, 'id' | 'timelineLogs' | 'timestamp'>) => {
    const id = `ref-${Date.now()}`;
    const timestamp = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ' (Just Now)';
    const timelineLogs = [{ time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }), text: 'Referral initialized from ANC operations center.' }];
    
    setReferrals(prev => [
      { id, ...newRef, timestamp, timelineLogs } as AncReferral,
      ...prev
    ]);
    
    // Set the target mother's risk level to red immediately upon referral
    setMothers(prev => prev.map(m => m.id === newRef.motherId ? { ...m, riskLevel: 'red' } : m));
  }, []);

  const updateReferralStatus = useCallback((id: string, status: AncReferral['status'], logText: string) => {
    setReferrals(prev => prev.map(ref => {
      if (ref.id === id) {
        const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        return {
          ...ref,
          status,
          timelineLogs: [...ref.timelineLogs, { time, text: logText }]
        };
      }
      return ref;
    }));
  }, []);

  const sendMessage = useCallback((ashaId: string, content: string) => {
    const id = `msg-${Date.now()}`;
    const timestamp = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [
      ...prev,
      { id, ashaId, sender: 'clinic', content, timestamp, read: true }
    ]);
  }, []);

  return (
    <AncDataContext.Provider value={{
      mothers,
      appointments,
      reports,
      referrals,
      messages,
      assignAsha,
      addAppointment,
      updateAppointmentStatus,
      addReport,
      verifyReport,
      addReferral,
      updateReferralStatus,
      sendMessage
    }}>
      {children}
    </AncDataContext.Provider>
  );
}

export function useAncData() {
  const context = useContext(AncDataContext);
  if (!context) {
    throw new Error('useAncData must be used within an AncDataProvider');
  }
  return context;
}
