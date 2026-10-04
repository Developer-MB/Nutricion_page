import React, { useState } from 'react';
import { ASSETS, FoodItem, INITIAL_FOOD_ITEMS, Patient } from '../data/mockData';

interface PatientProfileScreenProps {
  patient: Patient;
  onUpdateNotes: (patientId: string, notes: string) => void;
  onAddMeasurement: (patientId: string, weight: number, fat: number) => void;
  onOpenNewConsultModal: () => void;
  onBackToList: () => void;
}

export const PatientProfileScreen: React.FC<PatientProfileScreenProps> = ({
  patient,
  onUpdateNotes,
  onAddMeasurement,
  onOpenNewConsultModal,
  onBackToList,
}) => {
  const [activeTab, setActiveTab] = useState<string>('resumen');
  const [selectedMeal, setSelectedMeal] = useState<'desayuno' | 'colacion-manana' | 'comida' | 'colacion-tarde' | 'cena'>('desayuno');
  const [foodItems, setFoodItems] = useState<FoodItem[]>(INITIAL_FOOD_ITEMS);
  const [notes, setNotes] = useState(patient.clinicalNotes);
  const [notesSaved, setNotesSaved] = useState(false);
  const [pdfDownloaded, setPdfDownloaded] = useState(false);
  const [showAddFoodModal, setShowAddFoodModal] = useState(false);
  const [newFoodName, setNewFoodName] = useState('');
  const [newFoodPortion, setNewFoodPortion] = useState('');
  const [newFoodKcal, setNewFoodKcal] = useState('120');
  const [showMeasureModal, setShowMeasureModal] = useState(false);
  const [newWeight, setNewWeight] = useState(String(patient.currentWeight));
  const [newFat, setNewFat] = useState(String(patient.bodyFat));

  const currentMealFoods = foodItems.filter((f) => f.mealType === selectedMeal);
  const breakfastKcal = foodItems
    .filter((f) => f.mealType === 'desayuno')
    .reduce((acc, item) => acc + item.kcal, 0);

  const handleSaveNotes = () => {
    onUpdateNotes(patient.id, notes);
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 2500);
  };

  const handleAddFood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFoodName.trim()) return;
    const added: FoodItem = {
      id: 'f-' + Date.now(),
      name: newFoodName,
      portion: newFoodPortion || '1 porción estándar (100 g)',
      kcal: Number(newFoodKcal) || 100,
      imageUrl: ASSETS.oatmealFood,
      mealType: selectedMeal,
      macros: { carbs: 20, protein: 8, fat: 4 },
    };
    setFoodItems([...foodItems, added]);
    setNewFoodName('');
    setNewFoodPortion('');
    setShowAddFoodModal(false);
  };

  const handleSaveMeasurement = (e: React.FormEvent) => {
    e.preventDefault();
    onAddMeasurement(patient.id, parseFloat(newWeight) || patient.currentWeight, parseFloat(newFat) || patient.bodyFat);
    setShowMeasureModal(false);
  };

  return (
    <div className="flex flex-col w-full">
      {/* Patient Header Card */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg mb-space-lg">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-space-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-space-lg">
            <div className="relative">
              {patient.avatarUrl ? (
                <img
                  alt={patient.name}
                  className="w-20 h-20 rounded-full object-cover shadow-sm bg-surface-container-low"
                  src={patient.avatarUrl}
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className={`w-20 h-20 rounded-full flex items-center justify-center font-display-lg text-display-lg shadow-sm ${patient.avatarColorClass}`}>
                  {patient.initials}
                </div>
              )}
              <span
                className="absolute bottom-0 right-0 w-4 h-4 bg-tertiary rounded-full ring-2 ring-surface-container-lowest"
                title="Activo"
              ></span>
            </div>

            <div className="flex flex-col">
              <div className="flex flex-wrap items-center gap-space-sm mb-space-xs">
                <h1 className="font-display-lg text-display-lg text-on-surface">{patient.name}</h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                  {patient.condition}
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-surface-container-low text-primary font-label-sm text-label-sm">
                  {patient.expediente}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-y-1 gap-x-space-md text-secondary font-body-sm text-body-sm">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-headline-sm text-primary">person</span>
                  {patient.age} años · {patient.gender}
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-headline-sm text-secondary">call</span>
                  {patient.phone}
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-headline-sm text-secondary">mail</span>
                  {patient.email}
                </span>
                <span className="flex items-center gap-1 text-tertiary">
                  <span className="material-symbols-outlined text-headline-sm">check_circle</span>
                  {patient.status}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-space-sm pt-space-sm lg:pt-0">
            <button
              onClick={onBackToList}
              className="inline-flex items-center gap-space-xs px-space-md py-space-sm rounded-lg bg-surface-container-low text-secondary hover:text-on-surface hover:bg-surface-container transition-colors font-label-md text-label-md cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-headline-sm">edit</span>
              <span>Editar Datos</span>
            </button>
            <button
              onClick={() => {
                setPdfDownloaded(true);
                setTimeout(() => setPdfDownloaded(false), 2500);
              }}
              className="inline-flex items-center gap-space-xs px-space-md py-space-sm rounded-lg bg-surface-container-low text-secondary hover:text-on-surface hover:bg-surface-container transition-colors font-label-md text-label-md cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-headline-sm">download</span>
              <span>{pdfDownloaded ? 'Expediente Descargado ✓' : 'Expediente PDF'}</span>
            </button>
            <button
              onClick={onOpenNewConsultModal}
              className="inline-flex items-center gap-space-xs px-space-md py-space-sm rounded-lg bg-primary-container text-on-primary font-label-md text-label-md shadow-sm hover:bg-primary transition-colors cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-headline-sm">add_circle</span>
              <span>Nueva Consulta</span>
            </button>
          </div>
        </div>
      </div>

      {/* Segmented Tab Navigation */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm mb-space-lg overflow-x-auto">
        <div className="flex items-center min-w-max px-space-md py-1.5 gap-space-xs">
          {[
            { id: 'resumen', label: 'Resumen Clínico', icon: 'clinical_notes' },
            { id: 'datos', label: 'Datos y Antecedentes', icon: 'badge' },
            { id: 'consultas', label: 'Consultas (Historial)', icon: 'event_repeat' },
            { id: 'mediciones', label: 'Mediciones', icon: 'straighten' },
            { id: 'laboratorios', label: 'Laboratorios', icon: 'biotech' },
            { id: 'plan', label: 'Plan Alimentario', icon: 'restaurant' },
            { id: 'seguimiento', label: 'Seguimiento y Adherencia', icon: 'trending_up' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-space-md py-space-sm rounded-lg font-label-md text-label-md transition-colors flex items-center gap-space-xs cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-primary-container text-on-primary shadow-sm'
                  : 'text-secondary hover:text-on-surface hover:bg-surface-container-low'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-headline-sm">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Clinical Grid: 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-space-lg">
        {/* Card 1: Mediciones Antropométricas */}
        {(activeTab === 'resumen' || activeTab === 'mediciones' || activeTab === 'datos') && (
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-space-md">
                <div className="flex items-center gap-space-sm">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-headline-md">straighten</span>
                  </div>
                  <div>
                    <h2 className="font-headline-md text-headline-md text-on-surface">Mediciones antropométricas</h2>
                    <p className="font-body-sm text-body-sm text-secondary">Registro histórico y cálculo biométrico</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowMeasureModal(true)}
                  className="inline-flex items-center gap-1 px-space-md py-space-xs rounded-lg bg-surface-container-low text-primary hover:bg-primary hover:text-on-primary transition-colors font-label-md text-label-md cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-headline-sm">add</span>
                  Nueva medición
                </button>
              </div>

              {/* Metric KPI Cards Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm mb-space-lg tabular-nums">
                <div className="bg-surface-container-low rounded-xl p-space-md text-center flex flex-col justify-center">
                  <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider mb-1">Peso actual</span>
                  <span className="font-headline-lg text-headline-lg font-bold text-on-surface">
                    {patient.currentWeight} <span className="font-label-md text-label-md text-secondary">kg</span>
                  </span>
                  <span className="font-body-sm text-body-sm text-tertiary flex items-center justify-center gap-0.5 mt-1 font-semibold">
                    <span className="material-symbols-outlined text-body-sm">arrow_downward</span> {patient.weightDiff} kg
                  </span>
                </div>

                <div className="bg-surface-container-low rounded-xl p-space-md text-center flex flex-col justify-center">
                  <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider mb-1">Estatura</span>
                  <span className="font-headline-lg text-headline-lg font-bold text-on-surface">
                    {patient.height.toFixed(2)} <span className="font-label-md text-label-md text-secondary">m</span>
                  </span>
                  <span className="font-body-sm text-body-sm text-secondary mt-1">Adulto estándar</span>
                </div>

                <div className="bg-surface-container-low rounded-xl p-space-md text-center flex flex-col justify-center">
                  <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider mb-1">IMC Calculado</span>
                  <span className="font-headline-lg text-headline-lg font-bold text-on-surface">{patient.bmi.toFixed(1)}</span>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-fixed-variant font-label-sm text-label-sm">
                    {patient.bmiStatus}
                  </span>
                </div>

                <div className="bg-surface-container-low rounded-xl p-space-md text-center flex flex-col justify-center">
                  <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider mb-1">% Grasa</span>
                  <span className="font-headline-lg text-headline-lg font-bold text-on-surface">
                    {patient.bodyFat} <span className="font-label-md text-label-md text-secondary">%</span>
                  </span>
                  <span className="font-body-sm text-body-sm text-tertiary flex items-center justify-center gap-0.5 mt-1 font-semibold">
                    <span className="material-symbols-outlined text-body-sm">arrow_downward</span> {patient.bodyFatDiff}%
                  </span>
                </div>
              </div>

              {/* Inline SVG Weight Evolution Chart */}
              <div className="bg-surface-bright rounded-xl p-space-md mb-space-md">
                <div className="flex items-center justify-between mb-space-sm">
                  <span className="font-label-md text-label-md font-semibold text-on-surface">Evolución de peso (kg)</span>
                  <span className="font-label-sm text-label-sm text-secondary">Últimos 5 meses</span>
                </div>
                <div className="w-full h-44">
                  <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 500 160">
                    <line className="text-surface-container-high" stroke="currentColor" strokeDasharray="3,3" strokeWidth="1" x1="40" x2="480" y1="20" y2="20"></line>
                    <line className="text-surface-container-high" stroke="currentColor" strokeDasharray="3,3" strokeWidth="1" x1="40" x2="480" y1="60" y2="60"></line>
                    <line className="text-surface-container-high" stroke="currentColor" strokeDasharray="3,3" strokeWidth="1" x1="40" x2="480" y1="100" y2="100"></line>
                    <line className="text-surface-container-high" stroke="currentColor" strokeWidth="1" x1="40" x2="480" y1="140" y2="140"></line>

                    <text className="text-[10px] fill-secondary font-label-sm" textAnchor="end" x="25" y="24">100</text>
                    <text className="text-[10px] fill-secondary font-label-sm" textAnchor="end" x="25" y="64">80</text>
                    <text className="text-[10px] fill-secondary font-label-sm" textAnchor="end" x="25" y="104">60</text>
                    <text className="text-[10px] fill-secondary font-label-sm" textAnchor="end" x="25" y="144">40</text>

                    <defs>
                      <linearGradient id="weightGrad" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#0f766e" stopOpacity="0.25"></stop>
                        <stop offset="100%" stopColor="#0f766e" stopOpacity="0.0"></stop>
                      </linearGradient>
                    </defs>

                    <path d="M 60,65 L 160,78 L 260,98 L 360,108 L 460,122 L 460,140 L 60,140 Z" fill="url(#weightGrad)"></path>
                    <path d="M 60,65 L 160,78 L 260,98 L 360,108 L 460,122" fill="none" stroke="#005c55" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"></path>

                    <circle cx="60" cy="65" fill="#ffffff" r="4.5" stroke="#005c55" strokeWidth="2.5"></circle>
                    <text className="text-[11px] font-bold fill-primary" textAnchor="middle" x="60" y="55">{patient.weightHistory[0]?.weight ?? 80} kg</text>
                    <text className="text-[11px] fill-secondary" textAnchor="middle" x="60" y="156">Ene</text>

                    <circle cx="160" cy="78" fill="#ffffff" r="4.5" stroke="#005c55" strokeWidth="2.5"></circle>
                    <text className="text-[11px] font-bold fill-primary" textAnchor="middle" x="160" y="68">{patient.weightHistory[1]?.weight ?? 75} kg</text>
                    <text className="text-[11px] fill-secondary" textAnchor="middle" x="160" y="156">Feb</text>

                    <circle cx="260" cy="98" fill="#ffffff" r="4.5" stroke="#005c55" strokeWidth="2.5"></circle>
                    <text className="text-[11px] font-bold fill-primary" textAnchor="middle" x="260" y="88">{patient.weightHistory[2]?.weight ?? 67} kg</text>
                    <text className="text-[11px] fill-secondary" textAnchor="middle" x="260" y="156">Mar</text>

                    <circle cx="360" cy="108" fill="#ffffff" r="4.5" stroke="#005c55" strokeWidth="2.5"></circle>
                    <text className="text-[11px] font-bold fill-primary" textAnchor="middle" x="360" y="98">{patient.weightHistory[3]?.weight ?? 63} kg</text>
                    <text className="text-[11px] fill-secondary" textAnchor="middle" x="360" y="156">Abr</text>

                    <circle cx="460" cy="122" fill="#005c55" r="5" stroke="#ffffff" strokeWidth="2.5"></circle>
                    <text className="text-[11px] font-bold fill-primary" textAnchor="middle" x="460" y="112">{patient.weightHistory[4]?.weight ?? 58} kg</text>
                    <text className="text-[11px] font-bold fill-on-surface" textAnchor="middle" x="460" y="156">May</text>
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-space-xs font-body-sm text-body-sm text-secondary">
              <span>
                Meta estipulada: <strong className="text-on-surface">{patient.targetWeight.toFixed(1)} kg</strong>
              </span>
              <span className="text-tertiary font-semibold">Progreso acumulado: {patient.accumulatedProgress}</span>
            </div>
          </div>
        )}

        {/* Card 2: Laboratorios / Diabetes */}
        {(activeTab === 'resumen' || activeTab === 'laboratorios' || activeTab === 'consultas') && (
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-space-md">
                <div className="flex items-center gap-space-sm">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-headline-md">bloodtype</span>
                  </div>
                  <div>
                    <h2 className="font-headline-md text-headline-md text-on-surface">Laboratorios / Diabetes</h2>
                    <p className="font-body-sm text-body-sm text-secondary">Control glucémico y hemoglobina glicada</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 px-space-sm py-1 rounded-full bg-surface-container-low text-tertiary font-label-sm text-label-sm font-semibold">
                  <span className="material-symbols-outlined text-label-md">check_circle</span> En rango meta
                </span>
              </div>

              {/* Tabular Lab Results */}
              <div className="bg-surface-bright rounded-xl overflow-hidden mb-space-md tabular-nums">
                <div className="grid grid-cols-4 px-space-md py-space-sm bg-surface-container-low font-label-sm text-label-sm text-secondary uppercase font-semibold">
                  <div>Fecha</div>
                  <div className="text-center">Glucosa (mg/dL)</div>
                  <div className="text-center">HbA1c (%)</div>
                  <div className="text-right">Estado</div>
                </div>
                <div className="divide-y divide-surface-container-high/30">
                  {patient.labs.map((lab) => (
                    <div
                      key={lab.id}
                      className="grid grid-cols-4 items-center px-space-md py-space-sm hover:bg-surface-container-low/50 transition-colors font-body-md text-body-md"
                    >
                      <div className="font-medium text-on-surface">{lab.date}</div>
                      <div
                        className={`text-center font-semibold ${
                          lab.status === 'Óptimo'
                            ? 'text-tertiary'
                            : lab.status === 'Moderado'
                            ? 'text-secondary'
                            : 'text-error'
                        }`}
                      >
                        {lab.glucose}
                      </div>
                      <div
                        className={`text-center font-semibold ${
                          lab.status === 'Óptimo'
                            ? 'text-tertiary'
                            : lab.status === 'Moderado'
                            ? 'text-secondary'
                            : 'text-error'
                        }`}
                      >
                        {lab.hba1c}
                      </div>
                      <div className="text-right">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full font-label-sm text-label-sm font-semibold ${
                            lab.status === 'Óptimo'
                              ? 'bg-surface-container-low text-tertiary'
                              : lab.status === 'Moderado'
                              ? 'bg-surface-container-high/50 text-secondary'
                              : 'bg-error-container text-on-error-container'
                          }`}
                        >
                          {lab.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Inline Glucose Trend Line Chart */}
              <div className="bg-surface-bright rounded-xl p-space-md mb-space-sm">
                <div className="flex items-center justify-between mb-space-xs">
                  <span className="font-label-md text-label-md font-semibold text-on-surface">Evolución glucosa en ayunas</span>
                  <span className="font-label-sm text-label-sm text-secondary">Referencia normal &lt; 130 mg/dL</span>
                </div>
                <div className="w-full h-32">
                  <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 500 120">
                    <line stroke="#007952" strokeDasharray="4,4" strokeWidth="1.5" x1="40" x2="480" y1="55" y2="55"></line>
                    <text className="text-[10px] fill-tertiary-container font-bold" textAnchor="end" x="475" y="48">Meta &lt; 130</text>
                    <line className="text-surface-container-high" stroke="currentColor" strokeWidth="0.75" x1="40" x2="480" y1="20" y2="20"></line>
                    <line className="text-surface-container-high" stroke="currentColor" strokeWidth="0.75" x1="40" x2="480" y1="95" y2="95"></line>
                    <text className="text-[10px] fill-secondary font-label-sm" textAnchor="end" x="25" y="24">200</text>
                    <text className="text-[10px] fill-secondary font-label-sm" textAnchor="end" x="25" y="59">130</text>
                    <text className="text-[10px] fill-secondary font-label-sm" textAnchor="end" x="25" y="99">50</text>

                    <path d="M 60,35 L 160,48 L 260,68 L 360,70 L 460,71" fill="none" stroke="#565e74" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"></path>
                    <circle cx="60" cy="35" fill="#ffffff" r="4" stroke="#565e74" strokeWidth="2"></circle>
                    <circle cx="160" cy="48" fill="#ffffff" r="4" stroke="#565e74" strokeWidth="2"></circle>
                    <circle cx="260" cy="68" fill="#ffffff" r="4" stroke="#565e74" strokeWidth="2"></circle>
                    <circle cx="360" cy="70" fill="#ffffff" r="4" stroke="#565e74" strokeWidth="2"></circle>
                    <circle cx="460" cy="71" fill="#007952" r="5" stroke="#ffffff" strokeWidth="2"></circle>
                    <text className="text-[10px] fill-secondary" textAnchor="middle" x="60" y="112">Ene</text>
                    <text className="text-[10px] fill-secondary" textAnchor="middle" x="160" y="112">Feb</text>
                    <text className="text-[10px] fill-secondary" textAnchor="middle" x="260" y="112">Mar</text>
                    <text className="text-[10px] fill-secondary" textAnchor="middle" x="360" y="112">Abr</text>
                    <text className="text-[10px] font-bold fill-tertiary" textAnchor="middle" x="460" y="112">May</text>
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-space-xs font-body-sm text-body-sm">
              <span className="text-secondary">
                Próximo perfil lipídico y HbA1c: <strong className="text-on-surface">{patient.nextLabDate}</strong>
              </span>
              <button
                onClick={() => setActiveTab('laboratorios')}
                className="text-primary hover:underline font-semibold font-label-sm text-label-sm flex items-center gap-0.5 cursor-pointer"
                type="button"
              >
                Ver historial completo <span className="material-symbols-outlined text-label-md">arrow_forward</span>
              </button>
            </div>
          </div>
        )}

        {/* Card 3: Plan Alimentario Activo */}
        {(activeTab === 'resumen' || activeTab === 'plan') && (
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-space-md">
                <div className="flex items-center gap-space-sm">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-headline-md">restaurant_menu</span>
                  </div>
                  <div>
                    <h2 className="font-headline-md text-headline-md text-on-surface">Plan alimentario activo</h2>
                    <p className="font-body-sm text-body-sm text-secondary">{patient.dietPlanTitle}</p>
                  </div>
                </div>
                <span className="px-space-sm py-0.5 rounded-full bg-surface-container-low text-primary font-label-sm text-label-sm font-semibold">
                  {patient.dietPlanStage}
                </span>
              </div>

              {/* Meal Selector Tabs */}
              <div className="flex items-center gap-space-xs p-1 bg-surface-container-low rounded-lg mb-space-md overflow-x-auto">
                {[
                  { id: 'desayuno', label: `Desayuno (${breakfastKcal} kcal)` },
                  { id: 'colacion-manana', label: 'Colación Mañana' },
                  { id: 'comida', label: 'Comida' },
                  { id: 'colacion-tarde', label: 'Colación Tarde' },
                  { id: 'cena', label: 'Cena' },
                ].map((meal) => (
                  <button
                    key={meal.id}
                    onClick={() => setSelectedMeal(meal.id as any)}
                    className={`px-space-md py-space-xs rounded-md font-label-md text-label-md transition-all whitespace-nowrap cursor-pointer ${
                      selectedMeal === meal.id
                        ? 'bg-surface-container-lowest text-primary font-semibold shadow-sm'
                        : 'text-secondary hover:text-on-surface'
                    }`}
                    type="button"
                  >
                    {meal.label}
                  </button>
                ))}
              </div>

              {/* Food List Items */}
              <div className="space-y-space-sm mb-space-md">
                {currentMealFoods.map((food) => (
                  <div
                    key={food.id}
                    className="flex items-center justify-between p-space-sm bg-surface-bright rounded-xl hover:bg-surface-container-low/60 transition-colors"
                  >
                    <div className="flex items-center gap-space-md">
                      <img
                        alt={food.name}
                        className="w-12 h-12 rounded-lg object-cover bg-surface-container-low"
                        src={food.imageUrl}
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex flex-col">
                        <span className="font-label-lg text-label-lg font-bold text-on-surface">{food.name}</span>
                        <span className="font-body-sm text-body-sm text-secondary">{food.portion}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-space-md">
                      <div className="text-right tabular-nums">
                        <span className="font-label-lg text-label-lg font-bold text-primary">{food.kcal}</span>
                        <span className="font-body-sm text-body-sm text-secondary block">kcal</span>
                      </div>
                      <button
                        onClick={() => setFoodItems(foodItems.filter((item) => item.id !== food.id))}
                        aria-label="Eliminar alimento"
                        title="Quitar alimento"
                        className="p-1 text-secondary hover:text-error cursor-pointer"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-headline-sm">more_vert</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Macro distribution summary bar */}
              <div className="bg-surface-container-low rounded-xl p-space-sm mb-space-md">
                <div className="flex items-center justify-between font-label-sm text-label-sm mb-1.5">
                  <span className="text-on-surface font-semibold">Distribución de Macronutrientes</span>
                  <span className="text-secondary">Totales: Carb 50% · Prot 25% · Lip 25%</span>
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden flex bg-surface-container-high">
                  <div className="h-full bg-primary-container" style={{ width: '50%' }} title="Carbohidratos 50%"></div>
                  <div className="h-full bg-tertiary-container" style={{ width: '25%' }} title="Proteínas 25%"></div>
                  <div className="h-full bg-secondary" style={{ width: '25%' }} title="Lípidos 25%"></div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-space-sm">
              <button
                onClick={() => setShowAddFoodModal(true)}
                className="flex-1 inline-flex items-center justify-center gap-space-xs py-space-sm px-space-md rounded-lg bg-primary-container text-on-primary hover:bg-primary transition-colors font-label-md text-label-md font-semibold shadow-sm cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-headline-sm">add</span>
                <span>Agregar alimento</span>
              </button>
              <button
                onClick={() => {
                  const mealOrder: Array<'desayuno' | 'colacion-manana' | 'comida' | 'colacion-tarde' | 'cena'> = [
                    'desayuno',
                    'colacion-manana',
                    'comida',
                    'colacion-tarde',
                    'cena',
                  ];
                  const nextIdx = (mealOrder.indexOf(selectedMeal) + 1) % mealOrder.length;
                  setSelectedMeal(mealOrder[nextIdx]);
                }}
                aria-label="Cambiar tiempo de comida"
                title="Alternar tiempo de comida"
                className="inline-flex items-center justify-center p-space-sm rounded-lg bg-surface-container-low text-secondary hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-headline-sm">sync_alt</span>
              </button>
            </div>
          </div>
        )}

        {/* Card 4: Seguimiento y Adherencia */}
        {(activeTab === 'resumen' || activeTab === 'seguimiento') && (
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-space-md">
                <div className="flex items-center gap-space-sm">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-headline-md">monitoring</span>
                  </div>
                  <div>
                    <h2 className="font-headline-md text-headline-md text-on-surface">Seguimiento y Adherencia</h2>
                    <p className="font-body-sm text-body-sm text-secondary">Apego al tratamiento y notas de consulta</p>
                  </div>
                </div>
                <span className="font-label-sm text-label-sm text-secondary">Semana 4</span>
              </div>

              {/* Adherence Score Widget */}
              <div className="flex items-center gap-space-lg p-space-md bg-surface-bright rounded-xl mb-space-md">
                <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-surface-container-high"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3.5"
                    ></path>
                    <path
                      className="text-tertiary"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeDasharray={`${patient.compliance}, 100`}
                      strokeLinecap="round"
                      strokeWidth="3.5"
                    ></path>
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center text-center tabular-nums">
                    <span className="font-headline-md text-headline-md font-bold text-on-surface">{patient.compliance}%</span>
                    <span className="font-label-sm text-[10px] text-secondary">Adherencia</span>
                  </div>
                </div>

                <div className="flex flex-col gap-space-xs flex-1">
                  <div className="flex items-center justify-between text-body-sm font-body-sm">
                    <span className="text-secondary">Registro de comidas:</span>
                    <span className="font-semibold text-on-surface">{patient.mealsRecorded}</span>
                  </div>
                  <div className="flex items-center justify-between text-body-sm font-body-sm">
                    <span className="text-secondary">Hidratación (2.2 L):</span>
                    <span className="font-semibold text-tertiary">{patient.hydrationCompliance}</span>
                  </div>
                  <div className="flex items-center justify-between text-body-sm font-body-sm">
                    <span className="text-secondary">Actividad física:</span>
                    <span className="font-semibold text-primary">{patient.physicalActivity}</span>
                  </div>
                </div>
              </div>

              {/* Clinical Observations Text Area */}
              <div className="space-y-space-xs mb-space-md">
                <label className="font-label-md text-label-md font-semibold text-on-surface flex items-center justify-between" htmlFor="clinical-notes">
                  <span>Observaciones del especialista</span>
                  <span className="font-body-sm text-body-sm text-secondary font-normal">Dra. Ana López</span>
                </label>
                <div className="bg-surface-bright rounded-xl p-space-md">
                  <textarea
                    className="w-full bg-transparent border-0 outline-none resize-none font-body-md text-body-md text-on-surface placeholder:text-secondary focus:outline-none"
                    id="clinical-notes"
                    placeholder="Ingresar notas clínicas de evolución..."
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-space-sm pt-space-xs">
              <span className="font-body-sm text-body-sm text-secondary flex items-center gap-1">
                <span className="material-symbols-outlined text-headline-sm text-tertiary">verified_user</span>
                {notesSaved ? 'Guardado exitosamente hace un momento' : 'Actualizado hace 2 horas'}
              </span>
              <div className="flex items-center gap-space-xs">
                <button
                  onClick={() => setNotes(patient.clinicalNotes)}
                  className="px-space-md py-space-sm rounded-lg bg-surface-container-low text-secondary hover:text-on-surface hover:bg-surface-container font-label-md text-label-md transition-colors cursor-pointer"
                  type="button"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveNotes}
                  className="px-space-md py-space-sm rounded-lg bg-primary-container text-on-primary hover:bg-primary font-label-md text-label-md font-semibold transition-colors shadow-sm cursor-pointer"
                  type="button"
                >
                  {notesSaved ? 'Guardado ✓' : 'Guardar seguimiento'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Food Modal */}
      {showAddFoodModal && (
        <div className="fixed inset-0 bg-inverse-surface/40 backdrop-blur-xs z-50 flex items-center justify-center p-space-md">
          <div className="bg-surface-container-lowest rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-space-lg bg-surface-container-low/50 flex items-center justify-between">
              <h3 className="font-headline-md text-headline-md text-on-surface">Agregar Alimento al Plan</h3>
              <button onClick={() => setShowAddFoodModal(false)} className="text-secondary hover:text-on-surface cursor-pointer" type="button">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleAddFood} className="p-space-lg space-y-space-md">
              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-1">Alimento</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Pechuga de pavo o aguacate"
                  value={newFoodName}
                  onChange={(e) => setNewFoodName(e.target.value)}
                  className="w-full px-space-md py-space-sm rounded-lg bg-surface-container-low text-on-surface outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-space-sm">
                <div>
                  <label className="block font-label-md text-label-md text-on-surface mb-1">Porción</label>
                  <input
                    type="text"
                    placeholder="Ej. 1 taza (100 g)"
                    value={newFoodPortion}
                    onChange={(e) => setNewFoodPortion(e.target.value)}
                    className="w-full px-space-md py-space-sm rounded-lg bg-surface-container-low text-on-surface outline-none"
                  />
                </div>
                <div>
                  <label className="block font-label-md text-label-md text-on-surface mb-1">Energía (kcal)</label>
                  <input
                    type="number"
                    required
                    value={newFoodKcal}
                    onChange={(e) => setNewFoodKcal(e.target.value)}
                    className="w-full px-space-md py-space-sm rounded-lg bg-surface-container-low text-on-surface outline-none"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-space-sm pt-2">
                <button type="button" onClick={() => setShowAddFoodModal(false)} className="px-space-md py-space-sm text-secondary cursor-pointer">
                  Cancelar
                </button>
                <button type="submit" className="px-space-md py-space-sm bg-primary-container text-on-primary rounded-lg font-semibold cursor-pointer">
                  Añadir al Tiempo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Measurement Modal */}
      {showMeasureModal && (
        <div className="fixed inset-0 bg-inverse-surface/40 backdrop-blur-xs z-50 flex items-center justify-center p-space-md">
          <div className="bg-surface-container-lowest rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-space-lg bg-surface-container-low/50 flex items-center justify-between">
              <h3 className="font-headline-md text-headline-md text-on-surface">Nueva Medición Antropométrica</h3>
              <button onClick={() => setShowMeasureModal(false)} className="text-secondary hover:text-on-surface cursor-pointer" type="button">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleSaveMeasurement} className="p-space-lg space-y-space-md">
              <div className="grid grid-cols-2 gap-space-md">
                <div>
                  <label className="block font-label-md text-label-md text-on-surface mb-1">Peso actual (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={newWeight}
                    onChange={(e) => setNewWeight(e.target.value)}
                    className="w-full px-space-md py-space-sm rounded-lg bg-surface-container-low text-on-surface outline-none"
                  />
                </div>
                <div>
                  <label className="block font-label-md text-label-md text-on-surface mb-1">% Grasa Corporal</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={newFat}
                    onChange={(e) => setNewFat(e.target.value)}
                    className="w-full px-space-md py-space-sm rounded-lg bg-surface-container-low text-on-surface outline-none"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-space-sm pt-2">
                <button type="button" onClick={() => setShowMeasureModal(false)} className="px-space-md py-space-sm text-secondary cursor-pointer">
                  Cancelar
                </button>
                <button type="submit" className="px-space-md py-space-sm bg-primary-container text-on-primary rounded-lg font-semibold cursor-pointer">
                  Guardar Medición
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
