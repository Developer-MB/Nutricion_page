/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth';
import {
  collection,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import {
  auth,
  db,
  googleAuthProvider,
  handleFirestoreError,
  OperationType,
} from './lib/firebase';
import {
  Appointment,
  ASSETS,
  INITIAL_APPOINTMENTS,
  INITIAL_PATIENTS,
  Patient,
} from './data/mockData';
import { LoginScreen } from './components/LoginScreen';
import { DashboardScreen } from './components/DashboardScreen';
import { PatientsDirectoryScreen } from './components/PatientsDirectoryScreen';
import { PatientProfileScreen } from './components/PatientProfileScreen';
import { SecondaryScreens } from './components/SecondaryScreens';

export type ActiveScreen =
  | 'login'
  | 'inicio'
  | 'pacientes'
  | 'expediente'
  | 'consultas'
  | 'plan-alimentario'
  | 'alimentos'
  | 'seguimiento'
  | 'reportes'
  | 'configuracion';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('inicio');
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('p1');
  const [globalSearch, setGlobalSearch] = useState<string>('');
  const [showNewPatientModal, setShowNewPatientModal] = useState(false);
  const [showNewConsultModal, setShowNewConsultModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Firebase Auth state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // New Patient Form State
  const [npName, setNpName] = useState('');
  const [npEmail, setNpEmail] = useState('');
  const [npAge, setNpAge] = useState('32');
  const [npGender, setNpGender] = useState<'Masculino' | 'Femenino'>('Femenino');
  const [npPhone, setNpPhone] = useState('+52 55 ');
  const [npCondition, setNpCondition] = useState<'sano' | 'diabetes' | 'hipertension'>('sano');

  // New Consult Form State
  const [ncPatientId, setNcPatientId] = useState('p1');
  const [ncDate, setNcDate] = useState('14/10/2024');
  const [ncTime, setNcTime] = useState('10:30 AM');
  const [ncType, setNcType] = useState('Seguimiento');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  // Firestore real-time synchronization when authenticated
  useEffect(() => {
    if (!isAuthReady || !currentUser || !currentUser.emailVerified) return;

    const patientsQuery = query(
      collection(db, 'patients'),
      where('ownerId', '==', currentUser.uid)
    );

    const unsubPatients = onSnapshot(
      patientsQuery,
      (snapshot) => {
        if (!snapshot.empty) {
          const remotePatients = snapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            const fallback =
              INITIAL_PATIENTS.find((p) => p.id === docSnap.id) || INITIAL_PATIENTS[0];
            return {
              ...fallback,
              ...data,
              id: docSnap.id,
            } as Patient;
          });
          setPatients((prev) => {
            const remoteIds = new Set(remotePatients.map((r) => r.id));
            const remainingInitial = prev.filter((p) => !remoteIds.has(p.id));
            return [...remotePatients, ...remainingInitial];
          });
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'patients');
      }
    );

    const appointmentsQuery = query(
      collection(db, 'appointments'),
      where('ownerId', '==', currentUser.uid)
    );

    const unsubAppointments = onSnapshot(
      appointmentsQuery,
      (snapshot) => {
        if (!snapshot.empty) {
          const remoteApts = snapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            return {
              id: docSnap.id,
              date: data.date,
              time: data.time,
              patientId: data.patientId,
              patientName: data.patientName,
              initials: data.initials,
              folio: data.folio,
              type: data.type,
              protocol: data.protocol,
              protocolColor: data.protocolColor,
              status: data.status,
              avatarBg: 'bg-primary-fixed',
              avatarText: 'text-on-primary-fixed',
            } as Appointment;
          });
          setAppointments((prev) => {
            const remoteIds = new Set(remoteApts.map((r) => r.id));
            const remaining = prev.filter((a) => !remoteIds.has(a.id));
            return [...remoteApts, ...remaining];
          });
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'appointments');
      }
    );

    return () => {
      unsubPatients();
      unsubAppointments();
    };
  }, [isAuthReady, currentUser]);

  const selectedPatient = patients.find((p) => p.id === selectedPatientId) || patients[0];

  const handleSelectPatient = (patientId: string) => {
    setSelectedPatientId(patientId);
    setActiveScreen('expediente');
  };

  // Helper to ensure a patient exists in Firestore under strict blueprint schema before updating/referencing
  const ensurePatientInFirestore = async (patient: Patient, uid: string) => {
    const cleanId = patient.id.replace(/[^a-zA-Z0-9_-]/g, '');
    const docRef = doc(db, 'patients', cleanId);
    const payload = {
      ownerId: uid.slice(0, 128),
      name: patient.name.slice(0, 120),
      initials: patient.initials.slice(0, 4),
      folio: patient.folio.slice(0, 40),
      expediente: patient.expediente.slice(0, 60),
      age: Math.min(130, Math.max(0, Number(patient.age) || 30)),
      gender: patient.gender === 'Masculino' ? 'Masculino' : 'Femenino',
      genderShort: patient.gender === 'Masculino' ? 'Masc.' : 'Fem.',
      phone: (patient.phone || '+52 55 0000 0000').slice(0, 40),
      email: (patient.email || 'paciente@nutriapp.com').slice(0, 120),
      condition: (patient.condition || 'Sano').slice(0, 80),
      conditionCategory: ['sano', 'diabetes', 'hipertension'].includes(patient.conditionCategory)
        ? patient.conditionCategory
        : 'sano',
      status:
        patient.status === 'En seguimiento' ? 'En seguimiento' : 'Activo en tratamiento',
      compliance: Math.min(100, Math.max(0, Number(patient.compliance) || 85)),
      currentWeight: Math.min(400, Math.max(1, Number(patient.currentWeight) || 70)),
      height: Math.min(3, Math.max(0.5, Number(patient.height) || 1.7)),
      bmi: Math.min(100, Math.max(5, Number(patient.bmi) || 24.2)),
      bodyFat: Math.min(80, Math.max(1, Number(patient.bodyFat) || 20)),
      clinicalNotes: (patient.clinicalNotes || '').slice(0, 2000),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    try {
      await setDoc(docRef, payload);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `patients/${cleanId}`);
    }
  };

  const handleCreatePatient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!npName.trim()) return;
    const parts = npName.trim().split(' ');
    const initials =
      parts.length >= 2
        ? (parts[0][0] + parts[1][0]).toUpperCase()
        : npName.slice(0, 2).toUpperCase();

    const newId = 'p_' + Date.now();
    const newPatient: Patient = {
      id: newId,
      name: npName.trim().slice(0, 120),
      initials: initials.slice(0, 4),
      folio: `#NUT-2024-${Math.floor(100 + Math.random() * 899)}`,
      expediente: `Expediente #NP-2024-${Math.floor(100 + Math.random() * 899)}`,
      age: Number(npAge) || 30,
      gender: npGender,
      genderShort: npGender === 'Masculino' ? 'Masc.' : 'Fem.',
      phone: (npPhone || '+52 55 4000 1234').slice(0, 40),
      email: (npEmail || 'paciente@nutriapp.com').slice(0, 120),
      condition:
        npCondition === 'sano'
          ? 'Sano'
          : npCondition === 'diabetes'
          ? 'Diabetes Tipo 2'
          : 'Hipertensión',
      conditionCategory: npCondition,
      status: 'Activo en tratamiento',
      lastConsultDate: 'Hoy, 10 Oct 2024',
      lastConsultTopic: 'Primera consulta / Evaluación',
      nextAppointment: '25 Oct, 11:00 AM',
      nextAppointmentStatus: 'scheduled',
      compliance: 88,
      currentWeight: 70.0,
      weightDiff: -1.0,
      height: 1.68,
      bmi: 24.8,
      bmiStatus: 'Normal',
      bodyFat: 21.0,
      bodyFatDiff: -0.5,
      targetWeight: 66.0,
      accumulatedProgress: '-2.5%',
      weightHistory: [
        { month: 'Ene', weight: 73, glucose: 105 },
        { month: 'Feb', weight: 72, glucose: 102 },
        { month: 'Mar', weight: 71.5, glucose: 99 },
        { month: 'Abr', weight: 70.8, glucose: 97 },
        { month: 'May', weight: 70.0, glucose: 95 },
      ],
      labs: [{ id: 'l-new', date: '10/10/2024', glucose: 95, hba1c: 5.4, status: 'Óptimo' }],
      nextLabDate: '15 Dic 2024',
      dietPlanTitle: 'Normocalórico · 1,800 kcal/día',
      dietPlanStage: 'Semana 1 / Fase 1',
      mealsRecorded: '25 / 28 registradas',
      hydrationCompliance: '92% cumplido',
      physicalActivity: '4 días / semana',
      clinicalNotes:
        'Expediente clínico inicial aperturado. Se asigna plan alimentario personalizado.',
      avatarColorClass: 'bg-primary-fixed text-on-primary-fixed',
    };

    setPatients([newPatient, ...patients]);
    setSelectedPatientId(newPatient.id);
    setShowNewPatientModal(false);
    setNpName('');
    setNpEmail('');
    setActiveScreen('expediente');

    if (currentUser && currentUser.emailVerified) {
      await ensurePatientInFirestore(newPatient, currentUser.uid);
    }
  };

  const handleCreateConsult = async (e: React.FormEvent) => {
    e.preventDefault();
    const target = patients.find((p) => p.id === ncPatientId) || patients[0];
    const aptId = 'apt_' + Date.now();
    const newApt: Appointment = {
      id: aptId,
      date: ncDate.slice(0, 30),
      time: ncTime.slice(0, 20),
      patientId: target.id,
      patientName: target.name.slice(0, 120),
      initials: target.initials.slice(0, 4),
      folio: `Folio: ${target.folio}`.slice(0, 60),
      type: ncType.slice(0, 60),
      protocol: target.condition.slice(0, 80),
      protocolColor: target.conditionCategory === 'diabetes' ? 'red' : 'green',
      status: 'Confirmada',
      avatarBg: 'bg-primary-fixed',
      avatarText: 'text-on-primary-fixed',
    };
    setAppointments([newApt, ...appointments]);
    setShowNewConsultModal(false);

    if (currentUser && currentUser.emailVerified) {
      await ensurePatientInFirestore(target, currentUser.uid);
      try {
        await setDoc(doc(db, 'appointments', aptId), {
          ownerId: currentUser.uid,
          patientId: target.id.replace(/[^a-zA-Z0-9_-]/g, ''),
          patientName: newApt.patientName,
          initials: newApt.initials,
          folio: newApt.folio,
          date: newApt.date,
          time: newApt.time,
          type: newApt.type,
          protocol: newApt.protocol,
          protocolColor: newApt.protocolColor,
          status: newApt.status,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, `appointments/${aptId}`);
      }
    }
  };

  const handleUpdateNotes = async (patientId: string, notes: string) => {
    const sanitizedNotes = notes.slice(0, 2000);
    setPatients((prev) =>
      prev.map((p) => (p.id === patientId ? { ...p, clinicalNotes: sanitizedNotes } : p))
    );

    if (currentUser && currentUser.emailVerified) {
      const cleanId = patientId.replace(/[^a-zA-Z0-9_-]/g, '');
      try {
        await updateDoc(doc(db, 'patients', cleanId), {
          clinicalNotes: sanitizedNotes,
          updatedAt: serverTimestamp(),
        });
      } catch {
        const target = patients.find((p) => p.id === patientId);
        if (target) {
          await ensurePatientInFirestore(
            { ...target, clinicalNotes: sanitizedNotes },
            currentUser.uid
          );
        }
      }
    }
  };

  const handleAddMeasurement = async (patientId: string, weight: number, fat: number) => {
    const target = patients.find((p) => p.id === patientId);
    if (!target) return;
    const bmi = Number((weight / (target.height * target.height)).toFixed(1));

    setPatients((prev) =>
      prev.map((p) => {
        if (p.id !== patientId) return p;
        return {
          ...p,
          currentWeight: weight,
          bodyFat: fat,
          bmi,
        };
      })
    );

    if (currentUser && currentUser.emailVerified) {
      const cleanId = patientId.replace(/[^a-zA-Z0-9_-]/g, '');
      try {
        await updateDoc(doc(db, 'patients', cleanId), {
          currentWeight: weight,
          bodyFat: fat,
          bmi,
          updatedAt: serverTimestamp(),
        });
      } catch {
        await ensurePatientInFirestore(
          { ...target, currentWeight: weight, bodyFat: fat, bmi },
          currentUser.uid
        );
      }
    }
  };

  const handleGoogleSignInHeader = async () => {
    try {
      await signInWithPopup(auth, googleAuthProvider);
      setShowProfileMenu(false);
    } catch (err) {
      console.error('Google Sign-In error:', err);
    }
  };

  // Global quick switcher bar so user can inspect all 4 reference screens effortlessly
  const renderScreenSwitcherBar = () => (
    <div className="fixed bottom-4 right-4 z-50 bg-inverse-surface/95 backdrop-blur-md text-inverse-on-surface p-1.5 rounded-full shadow-xl border border-white/10 flex items-center gap-1">
      <span className="px-2.5 py-1 font-label-sm text-label-sm text-inverse-on-surface/70 hidden sm:inline">
        Vistas de Referencia:
      </span>
      {[
        { id: 'inicio', label: '1. Dashboard General', icon: 'grid_view' },
        { id: 'pacientes', label: '2. Gestión Pacientes', icon: 'group' },
        { id: 'expediente', label: '3. Expediente Juan Pérez', icon: 'clinical_notes' },
        { id: 'login', label: '4. Portal Login', icon: 'login' },
      ].map((item) => (
        <button
          key={item.id}
          onClick={() => {
            if (item.id === 'expediente') {
              setSelectedPatientId('p1');
            }
            setActiveScreen(item.id as ActiveScreen);
          }}
          className={`px-3 py-1.5 rounded-full font-label-sm text-label-sm flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
            activeScreen === item.id
              ? 'bg-primary-container text-on-primary font-semibold shadow-xs'
              : 'text-inverse-on-surface/80 hover:text-white hover:bg-white/10'
          }`}
          type="button"
        >
          <span className="material-symbols-outlined text-[15px]">{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );

  if (activeScreen === 'login') {
    return (
      <>
        <LoginScreen onLoginSuccess={() => setActiveScreen('inicio')} />
        {renderScreenSwitcherBar()}
      </>
    );
  }

  const navItems: Array<{ id: ActiveScreen; label: string; icon: string }> = [
    { id: 'inicio', label: 'Inicio', icon: 'grid_view' },
    { id: 'pacientes', label: 'Pacientes', icon: 'group' },
    { id: 'consultas', label: 'Consultas', icon: 'event_available' },
    { id: 'plan-alimentario', label: 'Plan alimentario', icon: 'restaurant_menu' },
    { id: 'alimentos', label: 'Alimentos', icon: 'nutrition' },
    { id: 'seguimiento', label: 'Seguimiento', icon: 'monitoring' },
    { id: 'reportes', label: 'Reportes', icon: 'bar_chart' },
    { id: 'configuracion', label: 'Configuración', icon: 'settings' },
  ];

  const searchResults =
    globalSearch.trim().length > 0
      ? patients.filter(
          (p) =>
            p.name.toLowerCase().includes(globalSearch.toLowerCase()) ||
            p.folio.toLowerCase().includes(globalSearch.toLowerCase())
        )
      : [];

  return (
    <div className="bg-background font-body-md text-on-surface antialiased min-h-screen">
      {/* Persistent Left Sidebar matching HTML */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-inverse-surface z-50 flex flex-col justify-between select-none shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col flex-1 overflow-y-auto">
          <div
            onClick={() => setActiveScreen('inicio')}
            className="h-16 flex items-center gap-space-sm px-space-lg cursor-pointer"
          >
            <img
              alt="NutriApp Logo"
              className="h-8 w-auto object-contain rounded"
              src={ASSETS.logo}
              referrerPolicy="no-referrer"
            />
            <span className="font-headline-md text-headline-md font-bold tracking-tight text-inverse-on-surface">
              NutriApp
            </span>
          </div>

          <nav className="flex-1 px-space-sm py-space-sm space-y-space-xs">
            {navItems.map((item) => {
              const isActive =
                activeScreen === item.id ||
                (item.id === 'pacientes' && activeScreen === 'expediente');
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveScreen(item.id)}
                  className={`w-full flex items-center gap-space-sm px-space-md py-space-sm rounded-lg transition-colors font-label-md text-label-md cursor-pointer ${
                    isActive
                      ? 'bg-primary-container text-on-primary-container'
                      : 'text-inverse-on-surface hover:bg-surface-container-high/10 hover:text-inverse-on-surface'
                  }`}
                  type="button"
                >
                  <span className="material-symbols-outlined text-headline-sm">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-space-md bg-inverse-surface">
          <div
            onClick={() => setActiveScreen('expediente')}
            title="Ver expediente activo de Juan Pérez"
            className="p-space-sm bg-surface-container-low/10 hover:bg-surface-container-low/15 transition-colors rounded-lg flex items-center justify-between cursor-pointer"
          >
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-inverse-on-surface/70">
                Licencia Clínica
              </span>
              <span className="font-label-md text-label-md font-semibold text-inverse-on-surface">
                Plan Pro Nutrición
              </span>
            </div>
            <span className="material-symbols-outlined text-tertiary-fixed text-headline-sm">
              verified
            </span>
          </div>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="pl-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="fixed top-0 left-64 right-0 h-16 bg-surface-container-lowest/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-space-xl">
          <div className="relative flex items-center w-96">
            <div className="flex items-center w-full px-space-md py-space-xs rounded-lg bg-surface-container-low">
              <span className="material-symbols-outlined text-headline-sm text-secondary mr-space-sm">
                search
              </span>
              <input
                className="w-full bg-transparent border-0 outline-none font-body-md text-body-md text-on-surface placeholder:text-secondary focus:outline-none"
                placeholder="Buscar paciente o folio..."
                type="text"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
              />
              {globalSearch && (
                <button
                  onClick={() => setGlobalSearch('')}
                  className="text-secondary hover:text-on-surface cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              )}
            </div>

            {searchResults.length > 0 && (
              <div className="absolute top-12 left-0 w-full bg-surface-container-lowest rounded-xl shadow-lg border border-surface-container overflow-hidden z-50">
                {searchResults.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      handleSelectPatient(p.id);
                      setGlobalSearch('');
                    }}
                    className="w-full px-space-md py-2.5 text-left hover:bg-surface-container-low flex items-center justify-between transition-colors cursor-pointer"
                    type="button"
                  >
                    <div>
                      <p className="font-label-md text-label-md text-on-surface font-semibold">
                        {p.name}
                      </p>
                      <p className="font-label-sm text-label-sm text-secondary">{p.folio}</p>
                    </div>
                    <span className="font-label-sm text-label-sm text-primary">{p.condition}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-space-lg">
            {/* Notifications Button */}
            <div className="relative">
              <button
                aria-label="Notificaciones"
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowProfileMenu(false);
                }}
                className="relative p-space-xs rounded-full hover:bg-surface-container-low text-secondary hover:text-on-surface transition-colors cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-headline-md">notifications</span>
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-error"></span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-surface-container-lowest rounded-xl shadow-xl border border-surface-container p-space-md z-50">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-surface-container-low">
                    <span className="font-label-md text-label-md font-bold text-on-surface">
                      Notificaciones Clínicas
                    </span>
                    <span className="text-label-sm text-primary font-semibold">2 nuevas</span>
                  </div>
                  <div className="space-y-2">
                    <div
                      onClick={() => {
                        handleSelectPatient('p1');
                        setShowNotifications(false);
                      }}
                      className="p-2 rounded-lg bg-surface-container-low/60 hover:bg-surface-container-low cursor-pointer"
                    >
                      <p className="font-label-sm text-label-sm font-semibold text-on-surface">
                        Laboratorio actualizado: Juan Pérez
                      </p>
                      <p className="font-body-sm text-body-sm text-secondary">
                        Glucosa en ayunas: 125 mg/dL (En rango meta)
                      </p>
                    </div>
                    <div
                      onClick={() => {
                        handleSelectPatient('p3');
                        setShowNotifications(false);
                      }}
                      className="p-2 rounded-lg bg-error-container/30 hover:bg-error-container/50 cursor-pointer"
                    >
                      <p className="font-label-sm text-label-sm font-semibold text-error">
                        Alerta HbA1c: Carlos Ramírez
                      </p>
                      <p className="font-body-sm text-body-sm text-secondary">
                        Requiere agendar revisión de control glucémico.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Doctor Profile Dropdown */}
            <div className="relative">
              <div
                onClick={() => {
                  setShowProfileMenu(!showProfileMenu);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-space-sm pl-space-md cursor-pointer"
              >
                <img
                  alt="Dra. Ana López"
                  className="w-8 h-8 rounded-full object-cover"
                  src={currentUser?.photoURL || ASSETS.doctorProfile}
                  referrerPolicy="no-referrer"
                />
                <div className="flex flex-col text-left">
                  <span className="font-label-lg text-label-lg text-on-surface">
                    {currentUser?.displayName || 'Dra. Ana López'}
                  </span>
                  <span className="font-label-sm text-label-sm text-secondary">
                    Nutrióloga Clínica
                  </span>
                </div>
                <span className="material-symbols-outlined text-headline-sm text-secondary ml-space-xs">
                  arrow_drop_down
                </span>
              </div>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-60 bg-surface-container-lowest rounded-xl shadow-xl border border-surface-container py-1.5 z-50">
                  {!currentUser ? (
                    <button
                      onClick={handleGoogleSignInHeader}
                      className="w-full px-space-md py-2 text-left font-body-sm text-body-sm text-primary font-semibold hover:bg-surface-container-low flex items-center gap-2 cursor-pointer"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-base">account_circle</span>
                      Conectar cuenta Google
                    </button>
                  ) : (
                    <div className="px-space-md py-1.5 text-label-sm text-tertiary border-b border-surface-container-low">
                      Sincronizado: {currentUser.email}
                    </div>
                  )}
                  <button
                    onClick={() => {
                      setActiveScreen('configuracion');
                      setShowProfileMenu(false);
                    }}
                    className="w-full px-space-md py-2 text-left font-body-sm text-body-sm text-on-surface hover:bg-surface-container-low flex items-center gap-2 cursor-pointer"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-base text-secondary">person</span>
                    Perfil de Especialista
                  </button>
                  <button
                    onClick={() => {
                      handleSelectPatient('p1');
                      setShowProfileMenu(false);
                    }}
                    className="w-full px-space-md py-2 text-left font-body-sm text-body-sm text-on-surface hover:bg-surface-container-low flex items-center gap-2 cursor-pointer"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-base text-primary">
                      clinical_notes
                    </span>
                    Expediente Juan Pérez
                  </button>
                  <div className="my-1 border-t border-surface-container-low"></div>
                  <button
                    onClick={async () => {
                      if (currentUser) {
                        await signOut(auth);
                      }
                      setShowProfileMenu(false);
                      setActiveScreen('login');
                    }}
                    className="w-full px-space-md py-2 text-left font-body-sm text-body-sm text-error hover:bg-error-container/30 flex items-center gap-2 cursor-pointer"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-base">logout</span>
                    Cerrar sesión (Ver Login)
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Viewport */}
        <main className="relative pt-16 flex-1 w-full px-space-xl py-space-xl bg-background pb-20">
          <div className="mt-space-lg">
            {activeScreen === 'inicio' && (
              <DashboardScreen
                patients={patients}
                appointments={appointments}
                onSelectPatient={handleSelectPatient}
                onNavigate={(view) => setActiveScreen(view as ActiveScreen)}
                onOpenNewPatientModal={() => setShowNewPatientModal(true)}
                onOpenNewConsultModal={() => setShowNewConsultModal(true)}
              />
            )}

            {activeScreen === 'pacientes' && (
              <PatientsDirectoryScreen
                patients={patients}
                onSelectPatient={handleSelectPatient}
                onNavigateHome={() => setActiveScreen('inicio')}
                onNavigate={(view) => setActiveScreen(view as ActiveScreen)}
                onOpenNewPatientModal={() => setShowNewPatientModal(true)}
              />
            )}

            {activeScreen === 'expediente' && (
              <PatientProfileScreen
                patient={selectedPatient}
                onUpdateNotes={handleUpdateNotes}
                onAddMeasurement={handleAddMeasurement}
                onOpenNewConsultModal={() => setShowNewConsultModal(true)}
                onBackToList={() => setActiveScreen('pacientes')}
              />
            )}

            {(activeScreen === 'consultas' ||
              activeScreen === 'plan-alimentario' ||
              activeScreen === 'alimentos' ||
              activeScreen === 'seguimiento' ||
              activeScreen === 'reportes' ||
              activeScreen === 'configuracion') && (
              <SecondaryScreens
                section={activeScreen}
                patients={patients}
                appointments={appointments}
                onSelectPatient={handleSelectPatient}
                onOpenNewConsultModal={() => setShowNewConsultModal(true)}
              />
            )}
          </div>
        </main>
      </div>

      {/* Modal: Registro de Nuevo Paciente */}
      {showNewPatientModal && (
        <div className="fixed inset-0 bg-inverse-surface/40 backdrop-blur-xs z-50 flex items-center justify-center p-space-md">
          <div className="bg-surface-container-lowest rounded-xl shadow-xl w-full max-w-xl overflow-hidden">
            <div className="p-space-lg bg-surface-container-low/50 flex items-center justify-between">
              <div className="flex items-center gap-space-sm">
                <div className="w-9 h-9 rounded-lg bg-primary-container text-on-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-headline-sm">person_add</span>
                </div>
                <div>
                  <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">
                    Registrar Nuevo Paciente
                  </h2>
                  <p className="font-body-sm text-body-sm text-secondary">
                    Añade la información inicial para crear el expediente clínico
                  </p>
                </div>
              </div>
              <button
                className="p-1 rounded-full text-secondary hover:text-on-surface hover:bg-surface-container cursor-pointer"
                onClick={() => setShowNewPatientModal(false)}
                type="button"
              >
                <span className="material-symbols-outlined text-headline-md">close</span>
              </button>
            </div>

            <form className="p-space-lg flex flex-col gap-space-md" onSubmit={handleCreatePatient}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                <div className="flex flex-col gap-1">
                  <label className="font-label-md text-label-md text-on-surface font-semibold">
                    Nombre Completo
                  </label>
                  <input
                    className="px-space-md py-space-sm rounded-lg bg-surface-container-low text-on-surface border-0 outline-none focus:ring-2 focus:ring-primary text-body-md"
                    placeholder="Ej. Mariana Sánchez Gómez"
                    required
                    maxLength={120}
                    type="text"
                    value={npName}
                    onChange={(e) => setNpName(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-label-md text-label-md text-on-surface font-semibold">
                    Correo Electrónico
                  </label>
                  <input
                    className="px-space-md py-space-sm rounded-lg bg-surface-container-low text-on-surface border-0 outline-none focus:ring-2 focus:ring-primary text-body-md"
                    placeholder="mariana.sanchez@ejemplo.com"
                    required
                    maxLength={120}
                    type="email"
                    value={npEmail}
                    onChange={(e) => setNpEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md">
                <div className="flex flex-col gap-1">
                  <label className="font-label-md text-label-md text-on-surface font-semibold">
                    Edad
                  </label>
                  <input
                    className="px-space-md py-space-sm rounded-lg bg-surface-container-low text-on-surface border-0 outline-none focus:ring-2 focus:ring-primary text-body-md"
                    max="120"
                    min="1"
                    placeholder="Años"
                    required
                    type="number"
                    value={npAge}
                    onChange={(e) => setNpAge(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-label-md text-label-md text-on-surface font-semibold">
                    Sexo
                  </label>
                  <select
                    value={npGender}
                    onChange={(e) => setNpGender(e.target.value as any)}
                    className="px-space-md py-space-sm rounded-lg bg-surface-container-low text-on-surface border-0 outline-none focus:ring-2 focus:ring-primary text-body-md"
                  >
                    <option value="Femenino">Femenino</option>
                    <option value="Masculino">Masculino</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-label-md text-label-md text-on-surface font-semibold">
                    Teléfono
                  </label>
                  <input
                    className="px-space-md py-space-sm rounded-lg bg-surface-container-low text-on-surface border-0 outline-none focus:ring-2 focus:ring-primary text-body-md"
                    placeholder="+52 55..."
                    maxLength={40}
                    type="tel"
                    value={npPhone}
                    onChange={(e) => setNpPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label-md text-label-md text-on-surface font-semibold">
                  Condición / Diagnóstico Inicial
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1">
                  <label className="flex items-center gap-2 p-2 rounded-lg bg-surface-container-low hover:bg-surface-container cursor-pointer text-body-sm">
                    <input
                      checked={npCondition === 'sano'}
                      onChange={() => setNpCondition('sano')}
                      className="accent-primary"
                      name="condicion"
                      type="radio"
                      value="sano"
                    />
                    <span>Sano / Preventivo</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 rounded-lg bg-surface-container-low hover:bg-surface-container cursor-pointer text-body-sm">
                    <input
                      checked={npCondition === 'diabetes'}
                      onChange={() => setNpCondition('diabetes')}
                      className="accent-primary"
                      name="condicion"
                      type="radio"
                      value="diabetes"
                    />
                    <span>Diabetes Tipo 2</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 rounded-lg bg-surface-container-low hover:bg-surface-container cursor-pointer text-body-sm">
                    <input
                      checked={npCondition === 'hipertension'}
                      onChange={() => setNpCondition('hipertension')}
                      className="accent-primary"
                      name="condicion"
                      type="radio"
                      value="hipertension"
                    />
                    <span>Hipertensión</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-space-sm pt-space-sm mt-space-sm">
                <button
                  className="px-space-md py-space-sm text-secondary hover:text-on-surface font-label-md text-label-md transition-colors cursor-pointer"
                  onClick={() => setShowNewPatientModal(false)}
                  type="button"
                >
                  Cancelar
                </button>
                <button
                  className="px-space-lg py-space-sm bg-primary-container text-on-primary rounded-lg font-label-md text-label-md font-semibold hover:bg-primary transition-all cursor-pointer"
                  type="submit"
                >
                  Guardar y Crear Expediente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Agendar Nueva Consulta */}
      {showNewConsultModal && (
        <div className="fixed inset-0 bg-inverse-surface/40 backdrop-blur-xs z-50 flex items-center justify-center p-space-md">
          <div className="bg-surface-container-lowest rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-space-lg bg-surface-container-low/50 flex items-center justify-between">
              <div className="flex items-center gap-space-sm">
                <div className="w-9 h-9 rounded-lg bg-primary-container text-on-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-headline-sm">event_available</span>
                </div>
                <div>
                  <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">
                    Nueva Consulta Clínica
                  </h2>
                  <p className="font-body-sm text-body-sm text-secondary">
                    Programar cita en agenda del consultorio
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowNewConsultModal(false)}
                className="p-1 text-secondary hover:text-on-surface cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateConsult} className="p-space-lg space-y-space-md">
              <div>
                <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
                  Seleccionar Paciente
                </label>
                <select
                  value={ncPatientId}
                  onChange={(e) => setNcPatientId(e.target.value)}
                  className="w-full px-space-md py-space-sm rounded-lg bg-surface-container-low text-on-surface outline-none"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.folio})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-space-md">
                <div>
                  <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
                    Fecha
                  </label>
                  <input
                    type="text"
                    maxLength={30}
                    value={ncDate}
                    onChange={(e) => setNcDate(e.target.value)}
                    className="w-full px-space-md py-space-sm rounded-lg bg-surface-container-low text-on-surface outline-none"
                  />
                </div>
                <div>
                  <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
                    Hora
                  </label>
                  <input
                    type="text"
                    maxLength={20}
                    value={ncTime}
                    onChange={(e) => setNcTime(e.target.value)}
                    className="w-full px-space-md py-space-sm rounded-lg bg-surface-container-low text-on-surface outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
                  Tipo de Consulta
                </label>
                <select
                  value={ncType}
                  onChange={(e) => setNcType(e.target.value)}
                  className="w-full px-space-md py-space-sm rounded-lg bg-surface-container-low text-on-surface outline-none"
                >
                  <option value="Seguimiento">Seguimiento Metabólico</option>
                  <option value="Primera consulta">Primera consulta / Evaluación</option>
                  <option value="Antropometría">Control Antropométrico</option>
                </select>
              </div>

              <div className="flex justify-end gap-space-sm pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewConsultModal(false)}
                  className="px-space-md py-space-sm text-secondary cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-space-lg py-space-sm bg-primary-container text-on-primary rounded-lg font-semibold cursor-pointer"
                >
                  Agendar Cita
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {renderScreenSwitcherBar()}
    </div>
  );
}
