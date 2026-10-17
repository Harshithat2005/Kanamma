'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  Plus,
  CheckCircle,
  Heart,
  Scale,
  X,
  ClipboardList,
  RefreshCw,
  MapPin,
  Activity,
} from 'lucide-react';
import AshaShell from '../components/AshaShell';
import { useLanguage } from '../components/LanguageContext';

interface ApiRiskAssessment {
  id: string;
  riskLevel: string;
  highRiskProbability?: number | null;
  midRiskProbability?: number | null;
  lowRiskProbability?: number | null;
  modelVersion: string;
  createdAt: string;
}

interface ApiMother {
  id: string;
  name: string;
  age: number;
  phone?: string | null;
  address?: string | null;
  village?: string | null;
  district?: string | null;
  bloodGroup?: string | null;
  gestationalWeek?: number | null;
  weight?: number | null;
  hbLevel?: number | null;
  systolicBP?: number | null;
  diastolicBP?: number | null;
  bloodSugar?: number | null;
  bodyTemp?: number | null;
  heartRate?: number | null;
  riskAssessments?: ApiRiskAssessment[];
}

interface ScheduledVisit {
  id: string;
  motherId: string;
  motherName: string;
  village: string;
  date: string;
  time: string;
  status: 'pending' | 'completed';
  notes: string;
  bpLogged?: string;
  weightLogged?: number;
  hbLogged?: number;
  medsCompliant?: boolean;
  createdAt?: string;
  completedAt?: string;
  isDemo?: boolean;
}

export default function AshaVisits() {
  const { t } = useLanguage();

  const [mothers, setMothers] = useState<ApiMother[]>([]);
  const [visits, setVisits] = useState<ScheduledVisit[]>([]);

  const [loading, setLoading] = useState(true);
  const [loadingVisits, setLoadingVisits] = useState(true);

  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [logVitalsOpen, setLogVitalsOpen] =
    useState<ScheduledVisit | null>(null);

  const [saving, setSaving] = useState(false);
  const [demoMode, setDemoMode] = useState(false);

  const [error, setError] = useState('');

  const [newVisit, setNewVisit] = useState({
    motherId: '',
    date: '',
    time: '10:00 AM',
    notes: '',
  });

  const [vitalsForm, setVitalsForm] = useState({
    bp: '',
    weight: '',
    hb: '',
    medsCompliant: true,
    notes: '',
  });

  /*
   * =========================================================
   * DEMO VISITS
   * Used automatically when /api/mothers/visits is not available.
   * =========================================================
   */

  const createDemoVisits = (
    apiMothers: ApiMother[]
  ): ScheduledVisit[] => {
    if (apiMothers.length === 0) {
      return [];
    }

    const today = new Date();

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const dayAfter = new Date(today);
    dayAfter.setDate(today.getDate() + 2);

    const formatDate = (date: Date) => {
      return date.toISOString().split('T')[0];
    };

    const mother1 = apiMothers[0];
    const mother2 = apiMothers[1] || apiMothers[0];
    const mother3 = apiMothers[2] || apiMothers[0];

    return [
      {
        id: 'demo-visit-001',
        motherId: mother1.id,
        motherName: mother1.name,
        village: mother1.village || 'Rampura',
        date: formatDate(today),
        time: '10:30 AM',
        status: 'pending',
        notes: 'Routine ANC screening and blood pressure check.',
        isDemo: true,
      },
      {
        id: 'demo-visit-002',
        motherId: mother2.id,
        motherName: mother2.name,
        village: mother2.village || 'Rampura',
        date: formatDate(tomorrow),
        time: '11:00 AM',
        status: 'pending',
        notes: 'Check Hb level, weight and medication compliance.',
        isDemo: true,
      },
      {
        id: 'demo-visit-003',
        motherId: mother3.id,
        motherName: mother3.name,
        village: mother3.village || 'Rampura',
        date: formatDate(dayAfter),
        time: '09:30 AM',
        status: 'completed',
        notes: 'Routine home screening completed successfully.',
        bpLogged: '120/80',
        weightLogged: mother3.weight || 58.5,
        hbLogged: mother3.hbLevel || 11.2,
        medsCompliant: true,
        completedAt: new Date().toISOString(),
        isDemo: true,
      },
    ];
  };

  /*
   * =========================================================
   * FETCH MOTHERS
   * =========================================================
   */

  const fetchMothers = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('/api/mothers', {
        method: 'GET',
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error('Unable to load mothers.');
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(
          data.error || 'Unable to load mothers.'
        );
      }

      const loadedMothers: ApiMother[] =
        data.mothers || [];

      setMothers(loadedMothers);

      return loadedMothers;
    } catch (err) {
      console.error('Mother fetch error:', err);

      setError(
        err instanceof Error
          ? err.message
          : 'Unable to load mothers.'
      );

      return [];
    } finally {
      setLoading(false);
    }
  };

  /*
   * =========================================================
   * FETCH VISITS
   *
   * If API doesn't exist yet, automatically use demo data.
   * This prevents the <!DOCTYPE JSON error.
   * =========================================================
   */

  const fetchVisits = async (
    apiMothers?: ApiMother[]
  ) => {
    try {
      setLoadingVisits(true);

      const response = await fetch('/api/mothers/visits', {
        method: 'GET',
        cache: 'no-store',
      });

      /*
       * Important:
       * Don't immediately call response.json().
       * A missing API returns HTML.
       */

      const contentType =
        response.headers.get('content-type') || '';

      if (
        !response.ok ||
        !contentType.includes('application/json')
      ) {
        throw new Error('VISITS_API_UNAVAILABLE');
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error('VISITS_API_UNAVAILABLE');
      }

      setVisits(data.visits || []);
      setDemoMode(false);

    } catch (err) {
      console.log(
        'Visits API unavailable. Using demo visit data.'
      );

      const availableMothers =
        apiMothers || mothers;

      const demoVisits =
        createDemoVisits(availableMothers);

      setVisits(demoVisits);
      setDemoMode(true);

    } finally {
      setLoadingVisits(false);
    }
  };

  /*
   * =========================================================
   * INITIAL LOAD
   * =========================================================
   */

  useEffect(() => {
    const loadData = async () => {
      const loadedMothers =
        await fetchMothers();

      await fetchVisits(loadedMothers);
    };

    loadData();
  }, []);

  /*
   * =========================================================
   * DATE HELPERS
   * =========================================================
   */

  const today =
    new Date().toISOString().split('T')[0];

  const formatDate = (dateString: string) => {
    if (!dateString) {
      return 'Demo Date';
    }

    const date = new Date(
      `${dateString}T00:00:00`
    );

    if (Number.isNaN(date.getTime())) {
      return dateString;
    }

    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  /*
   * =========================================================
   * VISIT FILTERS
   * =========================================================
   */

  const pendingVisits = useMemo(
    () =>
      visits.filter(
        (visit) =>
          visit.status === 'pending'
      ),
    [visits]
  );

  const completedVisits = useMemo(
    () =>
      visits.filter(
        (visit) =>
          visit.status === 'completed'
      ),
    [visits]
  );

  /*
   * =========================================================
   * SCHEDULE VISIT
   * =========================================================
   */

  const handleScheduleVisit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!newVisit.motherId) {
      setError(
        'Please select a mother.'
      );
      return;
    }

    const selectedMother =
      mothers.find(
        (mother) =>
          mother.id === newVisit.motherId
      );

    if (!selectedMother) {
      setError(
        'Selected mother could not be found.'
      );
      return;
    }

    try {
      setSaving(true);
      setError('');

      /*
       * If backend is available, use it.
       */

      if (!demoMode) {
        const response = await fetch(
          '/api/mothers/visits',
          {
            method: 'POST',
            headers: {
              'Content-Type':
                'application/json',
            },
            body: JSON.stringify({
              motherId:
                selectedMother.id,
              date:
                newVisit.date || today,
              time:
                newVisit.time,
              notes:
                newVisit.notes,
            }),
          }
        );

        const contentType =
          response.headers.get(
            'content-type'
          ) || '';

        if (
          response.ok &&
          contentType.includes(
            'application/json'
          )
        ) {
          const data =
            await response.json();

          if (data.success) {
            setScheduleOpen(false);

            setNewVisit({
              motherId: '',
              date: '',
              time: '10:00 AM',
              notes: '',
            });

            await fetchVisits();
            return;
          }
        }
      }

      /*
       * DEMO MODE
       * Store the visit in browser state.
       */

      const demoVisit: ScheduledVisit = {
        id:
          `demo-${Date.now()}`,
        motherId:
          selectedMother.id,
        motherName:
          selectedMother.name,
        village:
          selectedMother.village ||
          'Rampura',
        date:
          newVisit.date || today,
        time:
          newVisit.time ||
          '10:00 AM',
        status: 'pending',
        notes:
          newVisit.notes ||
          'Routine ANC home screening visit.',
        isDemo: true,
      };

      setVisits((current) => [
        demoVisit,
        ...current,
      ]);

      setDemoMode(true);
      setScheduleOpen(false);

      setNewVisit({
        motherId: '',
        date: '',
        time: '10:00 AM',
        notes: '',
      });

    } catch (err) {
      console.error(
        'Schedule visit error:',
        err
      );

      setError(
        'Visit scheduled in demo mode.'
      );
    } finally {
      setSaving(false);
    }
  };

  /*
   * =========================================================
   * OPEN VITALS
   * =========================================================
   */

  const openVitalsModal = (
    visit: ScheduledVisit
  ) => {
    setError('');
    setLogVitalsOpen(visit);

    const mother =
      mothers.find(
        (item) =>
          item.id === visit.motherId
      );

    setVitalsForm({
      bp:
        visit.bpLogged ||
        (mother?.systolicBP &&
        mother?.diastolicBP
          ? `${mother.systolicBP}/${mother.diastolicBP}`
          : '120/80'),

      weight:
        visit.weightLogged?.toString() ||
        mother?.weight?.toString() ||
        '58.5',

      hb:
        visit.hbLogged?.toString() ||
        mother?.hbLevel?.toString() ||
        '11.2',

      medsCompliant:
        visit.medsCompliant ??
        true,

      notes:
        visit.notes ||
        'Routine home screening completed.',
    });
  };

  /*
   * =========================================================
   * COMPLETE VISIT
   * =========================================================
   */

  const handleLogVitalsSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!logVitalsOpen) {
      return;
    }

    try {
      setSaving(true);
      setError('');

      /*
       * Try real API first.
       */

      if (!demoMode) {
        const response =
          await fetch(
            `/api/mothers/visits/${logVitalsOpen.id}`,
            {
              method: 'PATCH',
              headers: {
                'Content-Type':
                  'application/json',
              },
              body: JSON.stringify({
                status: 'completed',
                bpLogged:
                  vitalsForm.bp,
                weightLogged:
                  Number(
                    vitalsForm.weight
                  ),
                hbLogged:
                  Number(
                    vitalsForm.hb
                  ),
                medsCompliant:
                  vitalsForm.medsCompliant,
                notes:
                  vitalsForm.notes,
              }),
            }
          );

        const contentType =
          response.headers.get(
            'content-type'
          ) || '';

        if (
          response.ok &&
          contentType.includes(
            'application/json'
          )
        ) {
          const data =
            await response.json();

          if (data.success) {
            setLogVitalsOpen(null);
            await fetchVisits();
            return;
          }
        }
      }

      /*
       * DEMO MODE UPDATE
       */

      setVisits((current) =>
        current.map((visit) =>
          visit.id ===
          logVitalsOpen.id
            ? {
                ...visit,
                status:
                  'completed',
                bpLogged:
                  vitalsForm.bp ||
                  '120/80',
                weightLogged:
                  Number(
                    vitalsForm.weight
                  ) || 58.5,
                hbLogged:
                  Number(
                    vitalsForm.hb
                  ) || 11.2,
                medsCompliant:
                  vitalsForm.medsCompliant,
                notes:
                  vitalsForm.notes ||
                  'Routine screening completed.',
                completedAt:
                  new Date().toISOString(),
                isDemo: true,
              }
            : visit
        )
      );

      setDemoMode(true);
      setLogVitalsOpen(null);

    } catch (err) {
      console.error(
        'Complete visit error:',
        err
      );

      setError(
        'Visit completed in demo mode.'
      );
    } finally {
      setSaving(false);
    }
  };

  /*
   * =========================================================
   * CALENDAR
   * =========================================================
   */

  const currentDate =
    new Date();

  const calendarYear =
    currentDate.getFullYear();

  const calendarMonth =
    currentDate.getMonth();

  const monthName =
    currentDate.toLocaleDateString(
      'en-IN',
      {
        month: 'long',
        year: 'numeric',
      }
    );

  const firstDay =
    new Date(
      calendarYear,
      calendarMonth,
      1
    ).getDay();

  const daysInMonth =
    new Date(
      calendarYear,
      calendarMonth + 1,
      0
    ).getDate();

  const mondayOffset =
    firstDay === 0
      ? 6
      : firstDay - 1;

  const calendarCells = [
    ...Array(
      mondayOffset
    ).fill(null),
    ...Array.from(
      {
        length:
          daysInMonth,
      },
      (_, index) =>
        index + 1
    ),
  ];

  const hasVisitOnDay = (
    day: number
  ) => {
    const dateString =
      `${calendarYear}-${String(
        calendarMonth + 1
      ).padStart(2, '0')}-${String(
        day
      ).padStart(2, '0')}`;

    return visits.some(
      (visit) =>
        visit.date ===
        dateString
    );
  };

  const isToday = (
    day: number
  ) => {
    const dateString =
      `${calendarYear}-${String(
        calendarMonth + 1
      ).padStart(2, '0')}-${String(
        day
      ).padStart(2, '0')}`;

    return (
      dateString === today
    );
  };

  /*
   * =========================================================
   * REFRESH
   * =========================================================
   */

  const refreshAll = async () => {
    const loadedMothers =
      await fetchMothers();

    await fetchVisits(
      loadedMothers
    );
  };

  return (
    <AshaShell>
      <div className="space-y-6 max-w-4xl mx-auto pb-12 relative">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex justify-between items-center">

          <div>
            <h3 className="font-serif text-lg font-bold text-[#2A1525]">
              {t('visits')}
            </h3>

            <p className="text-xs text-[#8A7A82]">
              Manage home health screenings and document medical compliances
            </p>
          </div>

          <div className="flex items-center gap-2">

            <button
              onClick={refreshAll}
              disabled={
                loading ||
                loadingVisits
              }
              className="p-2 rounded-xl border border-[#C8877A]/15 bg-white text-[#8A7A82] hover:text-[#C8877A] transition-all disabled:opacity-50"
              title="Refresh"
            >
              <RefreshCw
                className={`w-4 h-4 ${
                  loading ||
                  loadingVisits
                    ? 'animate-spin'
                    : ''
                }`}
              />
            </button>

            <button
              onClick={() => {
                setError('');
                setScheduleOpen(
                  true
                );
              }}
              className="bg-[#C8877A] hover:bg-[#C8877A]/95 text-white shadow-md px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>
                Schedule Visit
              </span>
            </button>

          </div>
        </div>

        {/* =================================================
            DEMO MODE INDICATOR
        ================================================= */}

        {demoMode && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 flex items-center justify-between gap-3">

            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-600" />

              <p className="text-[11px] text-amber-700">
                <span className="font-bold">
                  Demo Mode:
                </span>{' '}
                Visit records are simulated because the Visits API is not connected yet.
              </p>
            </div>

            <span className="text-[9px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
              DEMO
            </span>

          </div>
        )}

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 rounded-2xl px-4 py-3 text-xs">
            {error}
          </div>
        )}

        {/* =================================================
            SUMMARY
        ================================================= */}

        <div className="grid grid-cols-3 gap-3">

          <div className="bg-white border border-[#C8877A]/15 rounded-2xl p-4">
            <p className="text-[10px] uppercase tracking-wider text-[#8A7A82]">
              Mothers
            </p>

            <p className="text-xl font-bold text-[#2A1525] mt-1">
              {loading
                ? '...'
                : mothers.length}
            </p>
          </div>

          <div className="bg-white border border-[#C8877A]/15 rounded-2xl p-4">
            <p className="text-[10px] uppercase tracking-wider text-[#8A7A82]">
              Pending Visits
            </p>

            <p className="text-xl font-bold text-amber-600 mt-1">
              {pendingVisits.length}
            </p>
          </div>

          <div className="bg-white border border-[#C8877A]/15 rounded-2xl p-4">
            <p className="text-[10px] uppercase tracking-wider text-[#8A7A82]">
              Completed
            </p>

            <p className="text-xl font-bold text-[#4CAF9A] mt-1">
              {completedVisits.length}
            </p>
          </div>

        </div>

        {/* =================================================
            VISIT COLUMNS
        ================================================= */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* ================= PENDING ================= */}

          <div className="bg-white border border-[#C8877A]/15 rounded-3xl p-5 shadow-sm space-y-4">

            <h4 className="font-serif text-base font-bold text-[#2A1525] flex items-center gap-2 border-b border-[#C8877A]/10 pb-2">
              <Clock className="w-4 h-4 text-amber-500" />
              Pending Screening Visits
            </h4>

            <div className="space-y-3">

              {loadingVisits ? (
                <p className="text-center text-xs text-[#8A7A82] py-6">
                  Loading visits...
                </p>
              ) : (
                <>
                  {pendingVisits.map(
                    (visit) => (
                      <div
                        key={visit.id}
                        className="bg-[#FEFAF8] border border-[#C8877A]/10 rounded-2xl p-4 space-y-3"
                      >

                        <div className="flex justify-between items-start gap-3">

                          <div className="flex items-center gap-2">

                            <div className="w-9 h-9 rounded-full bg-[#C8877A]/15 flex items-center justify-center font-serif text-xs font-bold text-[#C8877A]">
                              {visit.motherName
                                .charAt(
                                  0
                                )
                                .toUpperCase()}
                            </div>

                            <div>
                              <p className="text-xs font-bold text-[#2A1525]">
                                {visit.motherName}
                              </p>

                              <p className="text-[10px] text-[#8A7A82] flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {visit.village}
                              </p>
                            </div>

                          </div>

                          <div className="text-right">
                            <p className="text-[10px] text-[#C8877A] font-semibold">
                              {formatDate(
                                visit.date
                              )}
                            </p>

                            <p className="text-[10px] text-[#8A7A82] font-mono">
                              {visit.time}
                            </p>
                          </div>

                        </div>

                        <div className="bg-white rounded-xl p-3 border border-[#C8877A]/5">

                          <p className="text-[10px] text-[#8A7A82]">
                            Visit purpose
                          </p>

                          <p className="text-[11px] text-[#2A1525] mt-0.5">
                            {visit.notes}
                          </p>

                        </div>

                        <div className="flex justify-between items-center pt-1">

                          {visit.isDemo && (
                            <span className="text-[8px] font-bold uppercase tracking-wider bg-amber-50 text-amber-600 border border-amber-100 px-2 py-1 rounded-full">
                              Demo Visit
                            </span>
                          )}

                          <button
                            onClick={() =>
                              openVitalsModal(
                                visit
                              )
                            }
                            className="ml-auto bg-[#2A1525] hover:bg-[#C8877A] text-white text-[10px] font-semibold px-3 py-1.5 rounded-lg transition-all"
                          >
                            Log Vitals &amp; Complete
                          </button>

                        </div>

                      </div>
                    )
                  )}

                  {pendingVisits.length ===
                    0 && (
                    <p className="text-center text-xs text-[#8A7A82] py-6">
                      No pending scheduled visits.
                    </p>
                  )}
                </>
              )}

            </div>
          </div>

          {/* ================= COMPLETED ================= */}

          <div className="bg-white border border-[#C8877A]/15 rounded-3xl p-5 shadow-sm space-y-4">

            <h4 className="font-serif text-base font-bold text-[#2A1525] flex items-center gap-2 border-b border-[#C8877A]/10 pb-2">
              <CheckCircle className="w-4 h-4 text-[#4CAF9A]" />
              Completed Visit Reports
            </h4>

            <div className="space-y-3 max-h-[430px] overflow-y-auto pr-1">

              {loadingVisits ? (
                <p className="text-center text-xs text-[#8A7A82] py-6">
                  Loading reports...
                </p>
              ) : (
                <>
                  {completedVisits.map(
                    (visit) => (
                      <div
                        key={visit.id}
                        className="bg-emerald-50/10 border border-emerald-100/50 rounded-2xl p-4 space-y-3"
                      >

                        <div className="flex justify-between items-start gap-3">

                          <div className="flex items-center gap-2">

                            <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center font-serif text-xs font-bold text-emerald-600">
                              {visit.motherName
                                .charAt(
                                  0
                                )
                                .toUpperCase()}
                            </div>

                            <div>
                              <p className="text-xs font-bold text-[#2A1525]">
                                {visit.motherName}
                              </p>

                              <p className="text-[10px] text-[#8A7A82]">
                                {visit.village} · Home Screening
                              </p>
                            </div>

                          </div>

                          <span className="text-[8px] bg-emerald-50 text-emerald-600 font-bold border border-emerald-100 px-2 py-1 rounded-full">
                            COMPLETED
                          </span>

                        </div>

                        <div className="grid grid-cols-4 gap-2 text-center text-[10px] bg-white p-2.5 rounded-xl border border-emerald-100/40">

                          <div>
                            <p className="text-[#8A7A82] text-[8px] uppercase tracking-wider">
                              BP
                            </p>

                            <p className="font-semibold text-[#2A1525] font-mono">
                              {visit.bpLogged ||
                                '120/80'}
                            </p>
                          </div>

                          <div>
                            <p className="text-[#8A7A82] text-[8px] uppercase tracking-wider">
                              Weight
                            </p>

                            <p className="font-semibold text-[#2A1525] font-mono">
                              {visit.weightLogged ||
                                58.5}{' '}
                              kg
                            </p>
                          </div>

                          <div>
                            <p className="text-[#8A7A82] text-[8px] uppercase tracking-wider">
                              Hb
                            </p>

                            <p className="font-semibold text-[#2A1525] font-mono">
                              {visit.hbLogged ||
                                11.2}{' '}
                              g/dL
                            </p>
                          </div>

                          <div>
                            <p className="text-[#8A7A82] text-[8px] uppercase tracking-wider">
                              Meds
                            </p>

                            <p
                              className={`font-semibold text-[9px] ${
                                visit.medsCompliant !==
                                  false
                                  ? 'text-[#4CAF9A]'
                                  : 'text-red-500'
                              }`}
                            >
                              {visit.medsCompliant !==
                              false
                                ? 'Yes'
                                : 'No'}
                            </p>
                          </div>

                        </div>

                        <div className="bg-white rounded-xl p-2.5 border border-[#C8877A]/5">

                          <p className="text-[10px] text-[#8A7A82]">
                            Screening observation
                          </p>

                          <p className="text-[10px] text-[#2A1525] mt-0.5">
                            {visit.notes ||
                              'Routine ANC screening completed.'}
                          </p>

                        </div>

                        {visit.isDemo && (
                          <div className="flex justify-end">
                            <span className="text-[8px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 border border-amber-100 px-2 py-1 rounded-full">
                              Demo Data
                            </span>
                          </div>
                        )}

                      </div>
                    )
                  )}

                  {completedVisits.length ===
                    0 && (
                    <p className="text-center text-xs text-[#8A7A82] py-6">
                      No completed visits recorded.
                    </p>
                  )}
                </>
              )}

            </div>
          </div>
        </div>

        {/* =================================================
            CALENDAR
        ================================================= */}

        <div className="bg-white border border-[#C8877A]/15 rounded-3xl p-5 shadow-sm">

          <div className="flex justify-between items-center mb-4">

            <h4 className="font-serif text-base font-bold text-[#2A1525]">
              Calendar Schedule Tracker
            </h4>

            <span className="text-xs text-[#C8877A] font-semibold">
              {monthName}
            </span>

          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-xs border-b border-[#C8877A]/10 pb-2 mb-2 font-semibold text-[#8A7A82]">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-xs">

            {calendarCells.map(
              (day, index) => {

                if (day === null) {
                  return (
                    <div
                      key={`empty-${index}`}
                      className="min-h-[58px]"
                    />
                  );
                }

                const todayCell =
                  isToday(day);

                const visitDay =
                  hasVisitOnDay(day);

                return (
                  <div
                    key={day}
                    className={`min-h-[58px] p-2 rounded-xl flex flex-col justify-between border transition-all ${
                      todayCell
                        ? 'bg-[#C8877A]/10 border-[#C8877A] font-bold text-[#C8877A]'
                        : 'bg-[#FEFAF8] border-[#C8877A]/5 text-[#2A1525]/75'
                    }`}
                  >
                    <span>
                      {day}
                    </span>

                    {visitDay && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C8877A] mx-auto mb-1 animate-pulse" />
                    )}
                  </div>
                );
              }
            )}

          </div>
        </div>

        {/* =================================================
            SCHEDULE MODAL
        ================================================= */}

        <AnimatePresence>
          {scheduleOpen && (
            <>
              <motion.div
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 0.3,
                }}
                exit={{
                  opacity: 0,
                }}
                className="fixed inset-0 bg-black z-40"
                onClick={() =>
                  setScheduleOpen(
                    false
                  )
                }
              />

              <motion.div
                initial={{
                  scale: 0.95,
                  y: 15,
                }}
                animate={{
                  scale: 1,
                  y: 0,
                }}
                exit={{
                  scale: 0.95,
                  y: 15,
                }}
                className="fixed inset-x-4 top-1/4 md:left-1/3 md:right-1/3 bg-white border border-[#C8877A]/25 rounded-3xl p-6 shadow-2xl z-50 space-y-4"
              >

                <div className="flex justify-between items-center border-b border-[#C8877A]/10 pb-3">

                  <h4 className="font-serif text-base font-bold text-[#2A1525] flex items-center gap-1.5">
                    <Calendar className="w-5 h-5 text-[#C8877A]" />
                    Schedule Home Visit
                  </h4>

                  <button
                    onClick={() =>
                      setScheduleOpen(
                        false
                      )
                    }
                    className="p-1 hover:bg-[#F5E8E6] rounded-full text-[#8A7A82]"
                  >
                    <X className="w-4 h-4" />
                  </button>

                </div>

                <form
                  onSubmit={
                    handleScheduleVisit
                  }
                  className="space-y-4 text-xs"
                >

                  <div className="space-y-1">

                    <label className="font-bold text-[#2A1525] block">
                      Select Mother
                    </label>

                    <select
                      value={
                        newVisit.motherId
                      }
                      onChange={(e) =>
                        setNewVisit(
                          (prev) => ({
                            ...prev,
                            motherId:
                              e.target
                                .value,
                          })
                        )
                      }
                      required
                      className="w-full border border-[#C8877A]/20 rounded-xl px-3 py-2 bg-white"
                    >

                      <option value="">
                        Select pregnant mother...
                      </option>

                      {mothers.map(
                        (mother) => (
                          <option
                            key={
                              mother.id
                            }
                            value={
                              mother.id
                            }
                          >
                            {mother.name} —{' '}
                            {mother.village ||
                              'Rampura'}
                          </option>
                        )
                      )}

                    </select>

                  </div>

                  <div className="grid grid-cols-2 gap-3">

                    <div className="space-y-1">

                      <label className="font-bold text-[#2A1525] block">
                        Date
                      </label>

                      <input
                        type="date"
                        required
                        min={today}
                        value={
                          newVisit.date
                        }
                        onChange={(e) =>
                          setNewVisit(
                            (prev) => ({
                              ...prev,
                              date:
                                e.target
                                  .value,
                            })
                          )
                        }
                        className="w-full border border-[#C8877A]/20 rounded-xl px-3 py-2"
                      />

                    </div>

                    <div className="space-y-1">

                      <label className="font-bold text-[#2A1525] block">
                        Time Slot
                      </label>

                      <input
                        type="text"
                        required
                        value={
                          newVisit.time
                        }
                        onChange={(e) =>
                          setNewVisit(
                            (prev) => ({
                              ...prev,
                              time:
                                e.target
                                  .value,
                            })
                          )
                        }
                        placeholder="10:30 AM"
                        className="w-full border border-[#C8877A]/20 rounded-xl px-3 py-2"
                      />

                    </div>

                  </div>

                  <div className="space-y-1">

                    <label className="font-bold text-[#2A1525] block">
                      Screening Intent / Visit Notes
                    </label>

                    <textarea
                      value={
                        newVisit.notes
                      }
                      onChange={(e) =>
                        setNewVisit(
                          (prev) => ({
                            ...prev,
                            notes:
                              e.target
                                .value,
                          })
                        )
                      }
                      placeholder="e.g. Check blood pressure and Hb"
                      className="w-full border border-[#C8877A]/20 rounded-xl px-3 py-2 h-16"
                    />

                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full bg-[#2A1525] hover:bg-[#C8877A] disabled:opacity-50 text-white py-2.5 rounded-xl font-semibold transition-all"
                  >
                    {saving
                      ? 'Scheduling...'
                      : 'Confirm Visit Schedule'}
                  </button>

                </form>

              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* =================================================
            LOG VITALS MODAL
        ================================================= */}

        <AnimatePresence>
          {logVitalsOpen && (
            <>
              <motion.div
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 0.3,
                }}
                exit={{
                  opacity: 0,
                }}
                className="fixed inset-0 bg-black z-40"
                onClick={() =>
                  setLogVitalsOpen(
                    null
                  )
                }
              />

              <motion.div
                initial={{
                  scale: 0.95,
                  y: 15,
                }}
                animate={{
                  scale: 1,
                  y: 0,
                }}
                exit={{
                  scale: 0.95,
                  y: 15,
                }}
                className="fixed inset-x-4 top-1/4 md:left-1/3 md:right-1/3 bg-white border border-[#C8877A]/25 rounded-3xl p-6 shadow-2xl z-50 space-y-4"
              >

                <div className="flex justify-between items-center border-b border-[#C8877A]/10 pb-3">

                  <div>
                    <h4 className="font-serif text-base font-bold text-[#2A1525] flex items-center gap-1.5">
                      <ClipboardList className="w-5 h-5 text-[#4CAF9A]" />
                      Log Screening Vitals
                    </h4>

                    <p className="text-[10px] text-[#8A7A82] mt-0.5">
                      Mother:{' '}
                      {
                        logVitalsOpen.motherName
                      }
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      setLogVitalsOpen(
                        null
                      )
                    }
                    className="p-1 hover:bg-[#F5E8E6] rounded-full text-[#8A7A82]"
                  >
                    <X className="w-4 h-4" />
                  </button>

                </div>

                <form
                  onSubmit={
                    handleLogVitalsSubmit
                  }
                  className="space-y-4 text-xs"
                >

                  <div className="grid grid-cols-2 gap-3">

                    <div className="space-y-1">

                      <label className="font-bold text-[#2A1525] block flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5 text-red-500" />
                        BP (mmHg)
                      </label>

                      <input
                        type="text"
                        required
                        value={
                          vitalsForm.bp
                        }
                        onChange={(e) =>
                          setVitalsForm(
                            (prev) => ({
                              ...prev,
                              bp:
                                e.target
                                  .value,
                            })
                          )
                        }
                        placeholder="120/80"
                        className="w-full border border-[#C8877A]/20 rounded-xl px-3 py-2"
                      />

                    </div>

                    <div className="space-y-1">

                      <label className="font-bold text-[#2A1525] block flex items-center gap-1">
                        <Scale className="w-3.5 h-3.5 text-indigo-500" />
                        Weight (Kg)
                      </label>

                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        required
                        value={
                          vitalsForm.weight
                        }
                        onChange={(e) =>
                          setVitalsForm(
                            (prev) => ({
                              ...prev,
                              weight:
                                e.target
                                  .value,
                            })
                          )
                        }
                        placeholder="58.5"
                        className="w-full border border-[#C8877A]/20 rounded-xl px-3 py-2"
                      />

                    </div>

                  </div>

                  <div className="grid grid-cols-2 gap-3">

                    <div className="space-y-1">

                      <label className="font-bold text-[#2A1525] block">
                        Hemoglobin (Hb g/dL)
                      </label>

                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        required
                        value={
                          vitalsForm.hb
                        }
                        onChange={(e) =>
                          setVitalsForm(
                            (prev) => ({
                              ...prev,
                              hb:
                                e.target
                                  .value,
                            })
                          )
                        }
                        placeholder="11.2"
                        className="w-full border border-[#C8877A]/20 rounded-xl px-3 py-2"
                      />

                    </div>

                    <div className="space-y-1">

                      <label className="font-bold text-[#2A1525] block">
                        Medication Compliance
                      </label>

                      <select
                        value={
                          vitalsForm.medsCompliant
                            ? 'yes'
                            : 'no'
                        }
                        onChange={(e) =>
                          setVitalsForm(
                            (prev) => ({
                              ...prev,
                              medsCompliant:
                                e.target
                                  .value ===
                                'yes',
                            })
                          )
                        }
                        className="w-full border border-[#C8877A]/20 rounded-xl px-3 py-2 bg-white"
                      >

                        <option value="yes">
                          Compliant (Taken)
                        </option>

                        <option value="no">
                          Non-Compliant (Missed)
                        </option>

                      </select>

                    </div>

                  </div>

                  <div className="space-y-1">

                    <label className="font-bold text-[#2A1525] block">
                      Screening Observation Notes
                    </label>

                    <textarea
                      value={
                        vitalsForm.notes
                      }
                      onChange={(e) =>
                        setVitalsForm(
                          (prev) => ({
                            ...prev,
                            notes:
                              e.target
                                .value,
                          })
                        )
                      }
                      className="w-full border border-[#C8877A]/20 rounded-xl px-3 py-2 h-16"
                    />

                  </div>

                  <div className="bg-[#FEFAF8] border border-[#C8877A]/10 rounded-xl px-3 py-2 text-[9px] text-[#8A7A82]">
                    Demo values are pre-filled where clinical measurements are not available. Replace them with actual measurements during real deployment.
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full bg-[#4CAF9A] hover:bg-[#4CAF9A]/95 disabled:opacity-50 text-white py-2.5 rounded-xl font-semibold transition-all"
                  >
                    {saving
                      ? 'Saving Report...'
                      : 'Save Report & Complete Visit'}
                  </button>

                </form>

              </motion.div>
            </>
          )}
        </AnimatePresence>

      </div>
    </AshaShell>
  );
}