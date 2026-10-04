import React from 'react';
import { Appointment, Patient } from '../data/mockData';

interface DashboardScreenProps {
  patients: Patient[];
  appointments: Appointment[];
  onSelectPatient: (patientId: string) => void;
  onNavigate: (view: string) => void;
  onOpenNewPatientModal: () => void;
  onOpenNewConsultModal: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  patients,
  appointments,
  onSelectPatient,
  onNavigate,
  onOpenNewPatientModal,
  onOpenNewConsultModal,
}) => {
  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md mb-space-xl">
        <div>
          <div className="flex items-center gap-space-xs text-secondary font-label-md text-label-md mb-space-xs">
            <span className="material-symbols-outlined text-headline-sm text-primary">calendar_today</span>
            <span>Jueves, 10 de Octubre de 2024</span>
            <span className="inline-block w-1 h-1 rounded-full bg-secondary opacity-50 mx-1"></span>
            <span className="text-tertiary font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim inline-block animate-pulse"></span>
              Consultorio Activo
            </span>
          </div>
          <h1 className="font-display-lg text-display-lg text-on-surface tracking-tight">Dashboard General</h1>
          <p className="font-body-md text-body-md text-secondary mt-0.5">
            Bienvenida, Dra. Ana López. Tiene {appointments.length} consultas agendadas para la jornada de hoy.
          </p>
        </div>
        <div className="flex items-center gap-space-sm self-start md:self-auto">
          <button
            onClick={onOpenNewPatientModal}
            className="inline-flex items-center gap-space-xs px-space-md py-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-lg text-label-lg transition-all duration-200 shadow-sm cursor-pointer whitespace-nowrap"
            type="button"
          >
            <span className="material-symbols-outlined text-headline-sm text-secondary">person_add</span>
            <span>Nuevo Paciente</span>
          </button>
          <button
            onClick={onOpenNewConsultModal}
            className="inline-flex items-center gap-space-xs px-space-md py-2.5 rounded-lg bg-primary-container hover:bg-primary text-on-primary font-label-lg text-label-lg transition-all duration-200 shadow-md cursor-pointer whitespace-nowrap"
            type="button"
          >
            <span className="material-symbols-outlined text-headline-sm">add_circle</span>
            <span>Nueva Consulta</span>
          </button>
        </div>
      </div>

      {/* Metric KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-lg mb-space-xl">
        {/* Card 1: Pacientes Activos */}
        <div
          onClick={() => onNavigate('pacientes')}
          className="relative overflow-hidden rounded-xl bg-[#ecfdf5] p-space-lg flex items-center justify-between shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer"
        >
          <div className="flex flex-col z-10">
            <span className="font-label-md text-label-md font-semibold text-[#047857] uppercase tracking-wider">
              Pacientes activos
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-display-lg text-display-lg font-bold text-[#064e3b] tabular-nums">42</span>
              <span className="inline-flex items-center text-xs font-semibold text-[#047857] bg-[#d1fae5] px-1.5 py-0.5 rounded-full">
                <span className="material-symbols-outlined text-xs mr-0.5">trending_up</span>+8%
              </span>
            </div>
            <span className="font-body-sm text-body-sm text-[#065f46] mt-0.5">3 altas médicas este mes</span>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-white/80 backdrop-blur flex items-center justify-center text-[#059669] shadow-sm">
            <span className="material-symbols-outlined text-[32px] icon-filled">group</span>
          </div>
          <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-[#10b981]/10 pointer-events-none"></div>
        </div>

        {/* Card 2: Consultas este mes */}
        <div
          onClick={() => onNavigate('consultas')}
          className="relative overflow-hidden rounded-xl bg-[#eff6ff] p-space-lg flex items-center justify-between shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer"
        >
          <div className="flex flex-col z-10">
            <span className="font-label-md text-label-md font-semibold text-[#1d4ed8] uppercase tracking-wider">
              Consultas este mes
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-display-lg text-display-lg font-bold text-[#1e3a8a] tabular-nums">18</span>
              <span className="inline-flex items-center text-xs font-semibold text-[#1d4ed8] bg-[#dbeafe] px-1.5 py-0.5 rounded-full">
                Meta 80%
              </span>
            </div>
            <span className="font-body-sm text-body-sm text-[#1e40af] mt-0.5">4 pendientes esta semana</span>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-white/80 backdrop-blur flex items-center justify-center text-[#2563eb] shadow-sm">
            <span className="material-symbols-outlined text-[32px] icon-filled">calendar_month</span>
          </div>
          <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-[#3b82f6]/10 pointer-events-none"></div>
        </div>

        {/* Card 3: Planes Creados */}
        <div
          onClick={() => onNavigate('plan-alimentario')}
          className="relative overflow-hidden rounded-xl bg-[#fffbeb] p-space-lg flex items-center justify-between shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer"
        >
          <div className="flex flex-col z-10">
            <span className="font-label-md text-label-md font-semibold text-[#b45309] uppercase tracking-wider">
              Planes creados
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-display-lg text-display-lg font-bold text-[#78350f] tabular-nums">25</span>
              <span className="inline-flex items-center text-xs font-semibold text-[#b45309] bg-[#fef3c7] px-1.5 py-0.5 rounded-full">
                +5 nuevos
              </span>
            </div>
            <span className="font-body-sm text-body-sm text-[#92400e] mt-0.5">Dietas personalizadas</span>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-white/80 backdrop-blur flex items-center justify-center text-[#d97706] shadow-sm">
            <span className="material-symbols-outlined text-[32px] icon-filled">description</span>
          </div>
          <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-[#f59e0b]/10 pointer-events-none"></div>
        </div>

        {/* Card 4: Pacientes en Seguimiento */}
        <div
          onClick={() => onNavigate('seguimiento')}
          className="relative overflow-hidden rounded-xl bg-[#f5f3ff] p-space-lg flex items-center justify-between shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer"
        >
          <div className="flex flex-col z-10">
            <span className="font-label-md text-label-md font-semibold text-[#6d28d9] uppercase tracking-wider">
              Pacientes en seguimiento
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-display-lg text-display-lg font-bold text-[#4c1d95] tabular-nums">30</span>
              <span className="inline-flex items-center text-xs font-semibold text-[#6d28d9] bg-[#ede9fe] px-1.5 py-0.5 rounded-full">
                Adherencia 91%
              </span>
            </div>
            <span className="font-body-sm text-body-sm text-[#5b21b6] mt-0.5">Control de objetivos activo</span>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-white/80 backdrop-blur flex items-center justify-center text-[#7c3aed] shadow-sm">
            <span className="material-symbols-outlined text-[32px] icon-filled">query_stats</span>
          </div>
          <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-[#8b5cf6]/10 pointer-events-none"></div>
        </div>
      </div>

      {/* Main Asymmetric Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
        {/* Left Column: Consultations Table & Alerts (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col gap-space-lg">
          {/* Próximas Consultas Card */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg">
            <div className="flex items-center justify-between pb-space-md mb-space-sm">
              <div>
                <h2 className="font-headline-md text-headline-md text-on-surface">Próximas consultas</h2>
                <p className="font-body-sm text-body-sm text-secondary">
                  Citas y revisiones clínicas programadas para las próximas 48 horas
                </p>
              </div>
              <div className="flex items-center gap-space-xs">
                <span className="px-space-sm py-1 bg-surface-container-low text-secondary rounded-lg font-label-sm text-label-sm font-semibold">
                  Semana 41
                </span>
                <button
                  onClick={() => onNavigate('consultas')}
                  className="p-1 rounded-lg text-secondary hover:text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer"
                  title="Filtrar agenda"
                  type="button"
                >
                  <span className="material-symbols-outlined text-headline-sm">filter_list</span>
                </button>
              </div>
            </div>

            {/* Table Container */}
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-surface-container-low text-secondary font-label-sm text-label-sm uppercase tracking-wider rounded-lg">
                    <th className="py-2.5 px-space-md rounded-l-lg font-semibold">Fecha / Hora</th>
                    <th className="py-2.5 px-space-md font-semibold">Paciente</th>
                    <th className="py-2.5 px-space-md font-semibold">Tipo &amp; Protocolo</th>
                    <th className="py-2.5 px-space-md font-semibold text-center">Estado</th>
                    <th className="py-2.5 px-space-md rounded-r-lg font-semibold text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y-0 text-on-surface font-body-md text-body-md">
                  {appointments.map((apt) => (
                    <tr
                      key={apt.id}
                      onClick={() => onSelectPatient(apt.patientId)}
                      className="hover:bg-surface-container-low/60 transition-colors group cursor-pointer"
                    >
                      <td className="py-3.5 px-space-md whitespace-nowrap tabular-nums">
                        <div className="flex flex-col">
                          <span className="font-label-lg text-label-lg text-on-surface">{apt.date}</span>
                          <span className="font-body-sm text-body-sm text-secondary flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs">schedule</span>
                            {apt.time}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-space-md whitespace-nowrap">
                        <div className="flex items-center gap-space-sm">
                          <div
                            className={`w-9 h-9 rounded-full ${apt.avatarBg} flex items-center justify-center ${apt.avatarText} font-bold font-label-md text-label-md`}
                          >
                            {apt.initials}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-label-lg text-label-lg text-on-surface font-semibold group-hover:text-primary transition-colors">
                              {apt.patientName}
                            </span>
                            <span className="font-body-sm text-body-sm text-secondary">{apt.folio}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-space-md whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-label-md text-label-md text-on-surface font-medium">{apt.type}</span>
                          <span
                            className={`inline-flex items-center gap-1 font-body-sm text-body-sm ${
                              apt.protocolColor === 'red'
                                ? 'text-[#ba1a1a]'
                                : apt.protocolColor === 'green'
                                ? 'text-[#047857]'
                                : 'text-[#005e3f]'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                apt.protocolColor === 'red'
                                  ? 'bg-[#ba1a1a]'
                                  : apt.protocolColor === 'green'
                                  ? 'bg-[#047857]'
                                  : 'bg-[#005e3f]'
                              }`}
                            ></span>
                            {apt.protocol}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-space-md whitespace-nowrap text-center">
                        {apt.status === 'En espera' && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#fffbeb] text-[#b45309]">
                            En espera
                          </span>
                        )}
                        {apt.status === 'Confirmada' && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#ecfdf5] text-[#047857]">
                            Confirmada
                          </span>
                        )}
                        {apt.status === 'Agendada' && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#eff6ff] text-[#1d4ed8]">
                            Agendada
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-space-md whitespace-nowrap text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectPatient(apt.patientId);
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-primary-container text-primary hover:text-on-primary-container font-label-md text-label-md font-semibold transition-all cursor-pointer"
                          type="button"
                        >
                          <span>{apt.status === 'En espera' ? 'Atender' : 'Ver'}</span>
                          {apt.status === 'En espera' && (
                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-space-md pt-space-sm flex items-center justify-between text-secondary font-body-sm text-body-sm">
              <span>Mostrando {appointments.length} de 18 consultas agendadas este mes</span>
              <button
                onClick={() => onNavigate('consultas')}
                className="font-label-md text-label-md text-primary font-semibold hover:underline flex items-center gap-0.5 cursor-pointer"
                type="button"
              >
                Ver calendario completo
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
          </div>

          {/* Alertas Clínicas Banner / Action Box */}
          <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md">
            <div className="flex items-center gap-space-md">
              <div className="w-12 h-12 rounded-xl bg-error-container text-error flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-headline-lg">notification_important</span>
              </div>
              <div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface">
                  2 Alertas clínicas de laboratorio
                </h3>
                <p className="font-body-sm text-body-sm text-secondary mt-0.5">
                  Juan Pérez y Carlos Ramírez requieren revisión de Hemoglobina Glicosilada (HbA1c) previo a ajuste de dieta.
                </p>
              </div>
            </div>
            <button
              onClick={() => onSelectPatient('p1')}
              className="shrink-0 px-space-md py-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md font-semibold transition-colors cursor-pointer"
              type="button"
            >
              Revisar folios
            </button>
          </div>
        </div>

        {/* Right Column: Patient Summary Donut & Quick Diet Plans (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-space-lg">
          {/* Resumen de Pacientes (Donut Card) */}
          <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm">
            <div className="flex items-center justify-between mb-space-md">
              <h2 className="font-headline-md text-headline-md text-on-surface">Resumen de pacientes</h2>
              <button
                onClick={() => onNavigate('pacientes')}
                className="material-symbols-outlined text-secondary text-headline-sm cursor-pointer hover:text-on-surface"
                title="Ver detalles de pacientes"
                type="button"
              >
                more_horiz
              </button>
            </div>

            {/* SVG Donut Chart with matching emerald green and blue sectors */}
            <div className="flex flex-col items-center justify-center my-space-sm">
              <div className="relative w-44 h-44 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" fill="transparent" r="38" stroke="#eff4ff" strokeWidth="16"></circle>
                  {/* Sanos: 60% */}
                  <circle
                    className="transition-all duration-700 ease-out"
                    cx="50"
                    cy="50"
                    fill="transparent"
                    r="38"
                    stroke="#059669"
                    strokeDasharray="143.25 238.76"
                    strokeLinecap="round"
                    strokeWidth="16"
                  ></circle>
                  {/* Diabetes: 40% */}
                  <circle
                    className="transition-all duration-700 ease-out"
                    cx="50"
                    cy="50"
                    fill="transparent"
                    r="38"
                    stroke="#2563eb"
                    strokeDasharray="95.5 238.76"
                    strokeDashoffset="-143.25"
                    strokeLinecap="round"
                    strokeWidth="16"
                  ></circle>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="font-display-lg text-display-lg font-bold text-on-surface leading-none tabular-nums">
                    42
                  </span>
                  <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider mt-1">
                    Pacientes
                  </span>
                </div>
              </div>

              {/* Legend */}
              <div className="w-full mt-space-lg space-y-space-sm">
                <div className="flex items-center justify-between p-space-sm rounded-lg bg-surface-container-low/70">
                  <div className="flex items-center gap-space-sm">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#059669] shrink-0"></span>
                    <span className="font-label-lg text-label-lg text-on-surface">Sanos</span>
                  </div>
                  <div className="flex items-center gap-1 font-label-lg text-label-lg text-secondary tabular-nums">
                    <span className="font-bold text-on-surface">60%</span>
                    <span>(25)</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-space-sm rounded-lg bg-surface-container-low/70">
                  <div className="flex items-center gap-space-sm">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#2563eb] shrink-0"></span>
                    <span className="font-label-lg text-label-lg text-on-surface">Diabetes</span>
                  </div>
                  <div className="flex items-center gap-1 font-label-lg text-label-lg text-secondary tabular-nums">
                    <span className="font-bold text-on-surface">40%</span>
                    <span>(17)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-space-md pt-space-sm text-center">
              <p className="font-body-sm text-body-sm text-secondary">
                Tasa de apego glucémico promedio: <span className="font-semibold text-tertiary">84.2%</span>
              </p>
            </div>
          </div>

          {/* Planes Alimentarios Recientes Card */}
          <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm">
            <div className="flex items-center justify-between mb-space-md">
              <h2 className="font-headline-md text-headline-md text-on-surface">Planes recientes</h2>
              <button
                onClick={() => onNavigate('plan-alimentario')}
                className="font-label-sm text-label-sm text-primary font-semibold hover:underline cursor-pointer"
                type="button"
              >
                Ver catálogo
              </button>
            </div>

            <div className="space-y-space-sm">
              {/* Template 1 */}
              <div
                onClick={() => onSelectPatient('p1')}
                className="p-space-sm rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-space-sm min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined text-headline-sm">set_meal</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-label-md text-label-md font-semibold text-on-surface truncate">
                      Mediterráneo 1800 kcal
                    </span>
                    <span className="font-body-sm text-body-sm text-secondary truncate">
                      Normocalórico • 5 tiempos
                    </span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-secondary text-headline-sm">chevron_right</span>
              </div>

              {/* Template 2 */}
              <div
                onClick={() => onSelectPatient('p4')}
                className="p-space-sm rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-space-sm min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-secondary-container flex items-center justify-center text-secondary shrink-0">
                    <span className="material-symbols-outlined text-headline-sm">fitness_center</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-label-md text-label-md font-semibold text-on-surface truncate">
                      Hiperproteico Deportivo
                    </span>
                    <span className="font-body-sm text-body-sm text-secondary truncate">
                      2.0g/kg • Hipertrofia
                    </span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-secondary text-headline-sm">chevron_right</span>
              </div>

              {/* Template 3 */}
              <div
                onClick={() => onSelectPatient('p3')}
                className="p-space-sm rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-space-sm min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-surface-tint/10 flex items-center justify-center text-primary-container shrink-0">
                    <span className="material-symbols-outlined text-headline-sm">bloodtype</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-label-md text-label-md font-semibold text-on-surface truncate">
                      Control Glucémico Fase 1
                    </span>
                    <span className="font-body-sm text-body-sm text-secondary truncate">
                      Bajo índice IG • 1500 kcal
                    </span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-secondary text-headline-sm">chevron_right</span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('plan-alimentario')}
              className="w-full mt-space-md py-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-primary font-label-md text-label-md font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-sm">post_add</span>
              <span>Crear nueva plantilla</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
