'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Mother, mockMothers } from '../data';

interface OfflineContextType {
  isOffline: boolean;
  toggleOffline: () => void;
  offlineMothers: Mother[];
  addMotherOffline: (mother: Omit<Mother, 'id' | 'lastSync' | 'ringConnected' | 'ringBattery' | 'ringSignal' | 'heartRateHistory' | 'bpHistory' | 'ancHistory'>) => void;
  syncProgress: number;
  isSyncing: boolean;
  syncDatabase: () => void;
  clearQueue: () => void;
}

const OfflineContext = createContext<OfflineContextType>({
  isOffline: false,
  toggleOffline: () => {},
  offlineMothers: [],
  addMotherOffline: () => {},
  syncProgress: 0,
  isSyncing: false,
  syncDatabase: () => {},
  clearQueue: () => {},
});

export function OfflineProvider({ children }: { children: React.ReactNode }) {
  const [isOffline, setIsOffline] = useState(false);
  const [offlineMothers, setOfflineMothers] = useState<Mother[]>([]);
  const [syncProgress, setSyncProgress] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [queue, setQueue] = useState<Mother[]>([]);

  // Load initial mothers list into a state so we can add new ones dynamically
  useEffect(() => {
    setOfflineMothers(mockMothers);
  }, []);

  const toggleOffline = useCallback(() => {
    setIsOffline((prev) => {
      const nextOffline = !prev;
      // If we go online and have items in the queue, sync automatically
      if (!nextOffline && queue.length > 0) {
        setIsSyncing(true);
      }
      return nextOffline;
    });
  }, [queue]);

  const addMotherOffline = useCallback((motherData: Omit<Mother, 'id' | 'lastSync' | 'ringConnected' | 'ringBattery' | 'ringSignal' | 'heartRateHistory' | 'bpHistory' | 'ancHistory'>) => {
    const newMother: Mother = {
      ...motherData,
      id: `m-offline-${Date.now()}`,
      lastSync: isOffline ? 'Pending Sync (Offline)' : 'Just now',
      ringConnected: true,
      ringBattery: 100,
      ringSignal: 'strong',
      heartRateHistory: [
        { time: '12:00', value: 74 },
        { time: '14:00', value: 78 },
      ],
      bpHistory: [
        { time: 'Thu', systolic: parseInt(motherData.bp?.split('/')[0] ?? '120') || 120, diastolic: parseInt(motherData.bp?.split('/')[1] ?? '80') || 80 },
      ],
      ancHistory: [
        { visitNum: 1, date: motherData.nextANC, status: 'upcoming', facility: motherData.nearestHospital },
      ],
    };

    setOfflineMothers((prev) => [newMother, ...prev]);

    if (isOffline) {
      setQueue((prev) => [...prev, newMother]);
    }
  }, [isOffline]);

  const syncDatabase = useCallback(() => {
    if (isOffline || queue.length === 0) return;
    setIsSyncing(true);
  }, [isOffline, queue]);

  const clearQueue = useCallback(() => {
    setQueue([]);
  }, []);

  // Simulated Sync Progress Loop
  useEffect(() => {
    if (isSyncing) {
      setSyncProgress(0);
      const interval = setInterval(() => {
        setSyncProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsSyncing(false);
            setQueue([]);
            // Update the mothers list sync tags
            setOfflineMothers((current) =>
              current.map((m) =>
                m.lastSync === 'Pending Sync (Offline)' ? { ...m, lastSync: 'Synced just now' } : m
              )
            );
            return 100;
          }
          return prev + 10;
        });
      }, 300);
      return () => clearInterval(interval);
    }
  }, [isSyncing]);

  return (
    <OfflineContext.Provider
      value={{
        isOffline,
        toggleOffline,
        offlineMothers,
        addMotherOffline,
        syncProgress,
        isSyncing,
        syncDatabase,
        clearQueue,
      }}
    >
      {children}
    </OfflineContext.Provider>
  );
}

export function useOffline() {
  return useContext(OfflineContext);
}
