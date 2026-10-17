'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  DoctorPatient,
  DoctorReport,
  DoctorPrescription,
  DoctorReferral,
  DoctorConsultation,
  DoctorMessage,
  mockPatients,
  mockReports,
  mockPrescriptions,
  mockReferrals,
  mockMessages
} from '../data';

interface DoctorDataContextType {
  patients: DoctorPatient[];
  reports: DoctorReport[];
  prescriptions: DoctorPrescription[];
  referrals: DoctorReferral[];
  consultations: DoctorConsultation[];
  messages: DoctorMessage[];
  verifyReport: (reportId: string, status: 'approved' | 'rejected', notes?: string) => void;
  addPrescription: (
    patientId: string,
    medicines: { name: string; dosage: string; duration: string; instructions: string }[],
    dietNotes?: string
  ) => void;
  addConsultationNote: (
    patientId: string,
    text: string,
    lang: string,
    voice: boolean,
    recommendations: string,
    followUpWeeks: number
  ) => void;
  addObservation: (patientId: string, text: string) => void;
  triggerEmergencySOS: (patientId: string, reason: string, targetHospital: string) => void;
  updateReferralStatus: (
    referralId: string,
    status: 'initiated' | 'dispatched' | 'en_route' | 'admitted',
    logText?: string
  ) => void;
  sendMessage: (recipientId: string, recipientName: string, recipientType: 'asha' | 'anc', content: string) => void;
}

const DoctorDataContext = createContext<DoctorDataContextType | undefined>(undefined);

export const DoctorDataProvider = ({ children }: { children: ReactNode }) => {
  const [patients, setPatients] = useState<DoctorPatient[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('kannamma_doc_patients');
      if (stored) return JSON.parse(stored);
    }
    return mockPatients;
  });

  const [reports, setReports] = useState<DoctorReport[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('kannamma_doc_reports');
      if (stored) return JSON.parse(stored);
    }
    return mockReports;
  });

  const [prescriptions, setPrescriptions] = useState<DoctorPrescription[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('kannamma_doc_prescriptions');
      if (stored) return JSON.parse(stored);
    }
    return mockPrescriptions;
  });

  const [referrals, setReferrals] = useState<DoctorReferral[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('kannamma_doc_referrals');
      if (stored) return JSON.parse(stored);
    }
    return mockReferrals;
  });

  const [consultations, setConsultations] = useState<DoctorConsultation[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('kannamma_doc_consultations');
      if (stored) return JSON.parse(stored);
    }
    return [];
  });

  const [messages, setMessages] = useState<DoctorMessage[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('kannamma_doc_messages');
      if (stored) return JSON.parse(stored);
    }
    return mockMessages;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('kannamma_doc_patients', JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem('kannamma_doc_reports', JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem('kannamma_doc_prescriptions', JSON.stringify(prescriptions));
  }, [prescriptions]);

  useEffect(() => {
    localStorage.setItem('kannamma_doc_referrals', JSON.stringify(referrals));
  }, [referrals]);

  useEffect(() => {
    localStorage.setItem('kannamma_doc_consultations', JSON.stringify(consultations));
  }, [consultations]);

  useEffect(() => {
    localStorage.setItem('kannamma_doc_messages', JSON.stringify(messages));
  }, [messages]);

  // 1. Verify Report
  const verifyReport = (reportId: string, status: 'approved' | 'rejected', notes?: string) => {
    setReports((prev) =>
      prev.map((rep) =>
        rep.id === reportId
          ? {
              ...rep,
              verified: true,
              verifiedBy: 'Dr. Shreya Roy',
              status,
              reviewerNotes: notes || rep.reviewerNotes
            }
          : rep
      )
    );
  };

  // 2. Add Prescription
  const addPrescription = (
    patientId: string,
    medicines: { name: string; dosage: string; duration: string; instructions: string }[],
    dietNotes?: string
  ) => {
    const patientName = patients.find((p) => p.id === patientId)?.name || 'Unknown Patient';
    const newPresc: DoctorPrescription = {
      id: `dpr_${Date.now()}`,
      patientId,
      patientName,
      date: new Date().toISOString().split('T')[0],
      medicines,
      dietNotes,
      doctorSignature: 'Dr. Shreya Roy'
    };

    setPrescriptions((prev) => [newPresc, ...prev]);

    // Add observation that a prescription was written
    addObservation(patientId, `Prescription written: ${medicines.map((m) => m.name).join(', ')}`);
  };

  // 3. Add Consultation Note
  const addConsultationNote = (
    patientId: string,
    text: string,
    lang: string,
    voice: boolean,
    recommendations: string,
    followUpWeeks: number
  ) => {
    const patientName = patients.find((p) => p.id === patientId)?.name || 'Unknown Patient';
    const newConsult: DoctorConsultation = {
      id: `dcon_${Date.now()}`,
      patientId,
      patientName,
      date: new Date().toISOString().split('T')[0],
      notes: text,
      language: lang,
      voiceDictated: voice,
      recommendations,
      followUpWeeks
    };

    setConsultations((prev) => [newConsult, ...prev]);

    // Also update patient next visit date if followUpWeeks is provided
    if (followUpWeeks > 0) {
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + followUpWeeks * 7);
      const nextDateStr = nextDate.toISOString().split('T')[0];

      setPatients((prev) =>
        prev.map((p) =>
          p.id === patientId
            ? {
                ...p,
                nextVisitDate: nextDateStr,
                observations: [`Consultation Summary: ${text} | Recs: ${recommendations}`, ...p.observations]
              }
            : p
        )
      );
    } else {
      setPatients((prev) =>
        prev.map((p) =>
          p.id === patientId
            ? {
                ...p,
                observations: [`Consultation Summary: ${text} | Recs: ${recommendations}`, ...p.observations]
              }
            : p
        )
      );
    }
  };

  // 4. Add Observation
  const addObservation = (patientId: string, text: string) => {
    setPatients((prev) =>
      prev.map((p) =>
        p.id === patientId
          ? {
              ...p,
              observations: [text, ...p.observations]
            }
          : p
      )
    );
  };

  // 5. Trigger Emergency SOS
  const triggerEmergencySOS = (patientId: string, reason: string, targetHospital: string) => {
    const patient = patients.find((p) => p.id === patientId);
    if (!patient) return;

    // Check if referral already exists
    const exists = referrals.find((r) => r.patientId === patientId && r.status !== 'admitted');
    if (exists) return;

    const timeStr = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

    const newRef: DoctorReferral = {
      id: `dref_${Date.now()}`,
      patientId,
      patientName: patient.name,
      reason,
      sourcePHC: `${patient.village} PHC Clinic`,
      targetHospital,
      doctorInCharge: 'Dr. Shreya Roy',
      escortAshaName: patient.assignedAshaName,
      status: 'initiated',
      timestamp: timeStr,
      etaMinutes: 25,
      timelineLogs: [
        { time: timeStr, text: `SOS critical emergency ticket triggered by Dr. Shreya Roy: ${reason}` },
        { time: timeStr, text: `ASHA worker ${patient.assignedAshaName} notified to prepare patient for transport.` }
      ]
    };

    setReferrals((prev) => [newRef, ...prev]);

    // Set patient to red risk level and add to emergency history
    setPatients((prev) =>
      prev.map((p) =>
        p.id === patientId
          ? {
              ...p,
              riskLevel: 'red',
              riskReasons: Array.from(new Set([...p.riskReasons, 'SOS Escalate: ' + reason])),
              emergencyHistory: [`SOS Emergency Referal initiated at ${timeStr} to ${targetHospital}`, ...p.emergencyHistory]
            }
          : p
      )
    );
  };

  // 6. Update Referral Status
  const updateReferralStatus = (
    referralId: string,
    status: 'initiated' | 'dispatched' | 'en_route' | 'admitted',
    logText?: string
  ) => {
    const timeStr = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

    setReferrals((prev) =>
      prev.map((ref) => {
        if (ref.id === referralId) {
          const logs = [...ref.timelineLogs];
          const actualLogText = logText || `Referral status updated to ${status.replace('_', ' ')}.`;
          logs.push({ time: timeStr, text: actualLogText });

          let eta = ref.etaMinutes;
          if (status === 'dispatched') eta = 20;
          if (status === 'en_route') eta = 10;
          if (status === 'admitted') eta = 0;

          return {
            ...ref,
            status,
            etaMinutes: eta,
            timelineLogs: logs
          };
        }
        return ref;
      })
    );
  };

  // 7. Send Message
  const sendMessage = (recipientId: string, recipientName: string, recipientType: 'asha' | 'anc', content: string) => {
    const timeStr = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
    const newMsg: DoctorMessage = {
      id: `dmsg_${Date.now()}`,
      recipientId,
      recipientName,
      recipientType,
      sender: 'doctor',
      content,
      timestamp: timeStr,
      read: true
    };

    setMessages((prev) => [...prev, newMsg]);

    // Simulate reply from recipient after 2 seconds
    setTimeout(() => {
      const replyTime = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
      const replyMsg: DoctorMessage = {
        id: `dmsg_${Date.now() + 1}`,
        recipientId,
        recipientName,
        recipientType,
        sender: 'other',
        content: `Dr. Roy, copy that. Message received regarding ${content.substring(0, 20)}... We are on it.`,
        timestamp: replyTime,
        read: false
      };
      setMessages((prev) => [...prev, replyMsg]);
    }, 2000);
  };

  return (
    <DoctorDataContext.Provider
      value={{
        patients,
        reports,
        prescriptions,
        referrals,
        consultations,
        messages,
        verifyReport,
        addPrescription,
        addConsultationNote,
        addObservation,
        triggerEmergencySOS,
        updateReferralStatus,
        sendMessage
      }}
    >
      {children}
    </DoctorDataContext.Provider>
  );
};

export const useDoctorData = () => {
  const context = useContext(DoctorDataContext);
  if (!context) {
    throw new Error('useDoctorData must be used within a DoctorDataProvider');
  }
  return context;
};
