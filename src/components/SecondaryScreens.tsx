import React, { useState } from 'react';
import { Appointment, ASSETS, INITIAL_FOOD_ITEMS, Patient } from '../data/mockData';

interface SecondaryScreensProps {
  section: string;
  patients: Patient[];
  appointments: Appointment[];
  onSelectPatient: (id: string) => void;
  onOpenNewConsultModal: () => void;
}

export const SecondaryScreens: React.FC<SecondaryScreensProps> = ({
  section,
  patients,
  appointments,
  onSelectPatient,
  onOpenNewConsultModal,
}) => {
  const [foodSearch, setFoodSearch] = useState('');
  const [savedConfig, setSavedConfig] = useState(false);

  if (section === 'consultas') {
    return (
      <div className="flex flex-col gap-space-lg w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
          <div>
            <h1 className="font-display-lg text-display-lg text-on-surface tracking-tight">Agenda de Consultas</h1>
            <p className="font-body-md text-body-md text-secondary mt-0.5">
              Programación semanal, control de asistencia y seguimiento clínico en tiempo real
            </p>
          </div>
          <button
            onClick={onOpenNewConsultModal}
            className="inline-flex items-center gap-space-xs px-space-md py-2.5 rounded-lg bg-primary-container hover:bg-primary text-on-primary font-label-lg text-label-lg shadow-sm cursor-pointer self-start"
            type="button"
          >
            <span className="material-symbols-outlined text-headline-sm">add_circle</span>
            <span>Agendar Consulta</span>
          </button>
        </div>

        <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
            {appointments.map((apt) => (
              <div
                key={apt.id}
                onClick={() => onSelectPatient(apt.patientId)}
                className="p-space-md rounded-xl bg-surface-bright hover:bg-surface-container-low/60 transition-colors flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-space-md">
                  <div className={`w-12 h-12 rounded-full ${apt.avatarBg} ${apt.avatarText} flex items-center justify-center font-bold`}>
                    {apt.initials}
                  </div>
                  <div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface">{apt.patientName}</h3>
                    <p className="font-body-sm text-body-sm text-secondary">
                      {apt.type} · {apt.protocol}
                    </p>
                    <p className="font-label-sm text-label-sm text-primary mt-1 tabular-nums">
                      {apt.date} a las {apt.time}
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-surface-container-low text-primary font-label-sm text-label-sm font-semibold">
                  {apt.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (section === 'plan-alimentario') {
    return (
      <div className="flex flex-col gap-space-lg w-full">
        <div>
          <h1 className="font-display-lg text-display-lg text-on-surface tracking-tight">Catálogo de Planes Alimentarios</h1>
          <p className="font-body-md text-body-md text-secondary mt-0.5">
            Plantillas clínicas estandarizadas por patología, requerimiento energético y distribución de macronutrientes
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
          {[
            {
              title: 'Mediterráneo Normocalórico',
              kcal: '1,850 kcal/día',
              macros: 'Carb 50% · Prot 25% · Lip 25%',
              desc: 'Ideal para síndrome metabólico, prevención cardiovascular y control glucémico sostenido.',
              patientId: 'p1',
            },
            {
              title: 'Hiperproteico Deportivo',
              kcal: '2,250 kcal/día',
              macros: 'Carb 45% · Prot 30% · Lip 25%',
              desc: 'Enfocado en síntesis proteica miofibrilar, recomposición corporal y rendimiento atlético.',
              patientId: 'p4',
            },
            {
              title: 'Control Glucémico Fase 1',
              kcal: '1,650 kcal/día',
              macros: 'Carb 40% · Prot 30% · Lip 30%',
              desc: 'Bajo índice glucémico con alta densidad de fibra soluble para pacientes con Diabetes Tipo 2.',
              patientId: 'p3',
            },
          ].map((plan, idx) => (
            <div key={idx} className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-space-sm">
                  <span className="px-2.5 py-0.5 rounded-full bg-surface-container-low text-primary font-label-sm text-label-sm font-semibold">
                    {plan.kcal}
                  </span>
                  <span className="material-symbols-outlined text-primary">restaurant_menu</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface">{plan.title}</h3>
                <p className="font-body-sm text-body-sm text-secondary mt-2">{plan.desc}</p>
                <div className="mt-space-md p-space-sm rounded-lg bg-surface-container-low font-label-sm text-label-sm text-on-surface">
                  {plan.macros}
                </div>
              </div>
              <button
                onClick={() => onSelectPatient(plan.patientId)}
                className="w-full mt-space-lg py-2 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md font-semibold hover:bg-primary transition-colors cursor-pointer"
                type="button"
              >
                Abrir en expediente clínico
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (section === 'alimentos') {
    const filteredFoods = INITIAL_FOOD_ITEMS.filter((f) =>
      f.name.toLowerCase().includes(foodSearch.toLowerCase())
    );
    return (
      <div className="flex flex-col gap-space-lg w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
          <div>
            <h1 className="font-display-lg text-display-lg text-on-surface tracking-tight">Base de Datos de Alimentos (SMAE)</h1>
            <p className="font-body-md text-body-md text-secondary mt-0.5">
              Equivalentes nutricionales, aporte calórico y composición bromatológica por ración
            </p>
          </div>
          <div className="flex items-center bg-surface-container-lowest rounded-lg px-space-md py-2 shadow-sm w-full sm:w-80">
            <span className="material-symbols-outlined text-secondary mr-2">search</span>
            <input
              type="text"
              value={foodSearch}
              onChange={(e) => setFoodSearch(e.target.value)}
              placeholder="Buscar alimento..."
              className="bg-transparent outline-none w-full font-body-md text-body-md"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
          {filteredFoods.map((food) => (
            <div key={food.id} className="bg-surface-container-lowest rounded-xl shadow-sm p-space-md flex items-center justify-between">
              <div className="flex items-center gap-space-md">
                <img
                  src={food.imageUrl}
                  alt={food.name}
                  className="w-14 h-14 rounded-lg object-cover bg-surface-container-low"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h3 className="font-label-lg text-label-lg font-bold text-on-surface">{food.name}</h3>
                  <p className="font-body-sm text-body-sm text-secondary">{food.portion}</p>
                  <p className="font-label-sm text-label-sm text-primary mt-1 tabular-nums">
                    C: {food.macros.carbs}g · P: {food.macros.protein}g · L: {food.macros.fat}g
                  </p>
                </div>
              </div>
              <div className="text-right tabular-nums">
                <span className="font-headline-sm text-headline-sm font-bold text-primary">{food.kcal}</span>
                <span className="block font-label-sm text-label-sm text-secondary">kcal</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (section === 'seguimiento' || section === 'reportes') {
    return (
      <div className="flex flex-col gap-space-lg w-full">
        <div>
          <h1 className="font-display-lg text-display-lg text-on-surface tracking-tight">
            {section === 'seguimiento' ? 'Monitoreo de Seguimiento y Adherencia' : 'Reportes Clínicos y Estadísticas'}
          </h1>
          <p className="font-body-md text-body-md text-secondary mt-0.5">
            Indicadores biométricos globales, evolución de hemoglobina glicada y apego por cohorte
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
          {patients.map((p) => (
            <div
              key={p.id}
              onClick={() => onSelectPatient(p.id)}
              className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg flex items-center justify-between hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-center gap-space-md">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${p.avatarColorClass}`}>
                  {p.initials}
                </div>
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">{p.name}</h3>
                  <p className="font-body-sm text-body-sm text-secondary">
                    {p.condition} · Meta: {p.targetWeight} kg (Actual: {p.currentWeight} kg)
                  </p>
                  <p className="font-label-sm text-label-sm text-tertiary mt-1">
                    Hidratación: {p.hydrationCompliance} · Ejercicio: {p.physicalActivity}
                  </p>
                </div>
              </div>
              <div className="text-right tabular-nums">
                <span className="font-headline-md text-headline-md font-bold text-primary">{p.compliance}%</span>
                <span className="block font-label-sm text-label-sm text-secondary">Apego</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-space-lg w-full max-w-3xl">
      <div>
        <h1 className="font-display-lg text-display-lg text-on-surface tracking-tight">Configuración del Consultorio</h1>
        <p className="font-body-md text-body-md text-secondary mt-0.5">
          Perfil profesional de especialista, credenciales médicas y preferencias de expediente clínico
        </p>
      </div>
      <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg space-y-space-md">
        <div className="flex items-center gap-space-md pb-space-md border-b border-surface-container-low">
          <img
            src={ASSETS.doctorProfile}
            alt="Dra. Ana López"
            className="w-16 h-16 rounded-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div>
            <h3 className="font-headline-md text-headline-md text-on-surface">Dra. Ana López, RDN, CNSC</h3>
            <p className="font-body-sm text-body-sm text-secondary">Nutrióloga Clínica Especialista en Metabolismo · Cédula Profesional Verificada</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
          <div>
            <label className="block font-label-md text-label-md text-on-surface mb-1">Consultorio / Clínica</label>
            <input
              type="text"
              defaultValue="Centro de Nutrición Clínica & Metabolismo Integral"
              className="w-full px-space-md py-space-sm rounded-lg bg-surface-container-low text-on-surface outline-none"
            />
          </div>
          <div>
            <label className="block font-label-md text-label-md text-on-surface mb-1">Correo Institucional</label>
            <input
              type="email"
              defaultValue="dra.lopez@nutriapp.com"
              className="w-full px-space-md py-space-sm rounded-lg bg-surface-container-low text-on-surface outline-none"
            />
          </div>
        </div>
        <div className="flex justify-end pt-2">
          <button
            onClick={() => {
              setSavedConfig(true);
              setTimeout(() => setSavedConfig(false), 2500);
            }}
            className="px-space-lg py-space-sm rounded-lg bg-primary-container text-on-primary font-label-md text-label-md font-semibold cursor-pointer"
            type="button"
          >
            {savedConfig ? 'Preferencias Guardadas ✓' : 'Guardar Cambios'}
          </button>
        </div>
      </div>
    </div>
  );
};
