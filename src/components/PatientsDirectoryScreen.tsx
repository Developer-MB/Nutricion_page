import React, { useState } from 'react';
import { Patient } from '../data/mockData';

interface PatientsDirectoryScreenProps {
  patients: Patient[];
  onSelectPatient: (patientId: string) => void;
  onNavigateHome: () => void;
  onNavigate: (view: string) => void;
  onOpenNewPatientModal: () => void;
}

export const PatientsDirectoryScreen: React.FC<PatientsDirectoryScreenProps> = ({
  patients,
  onSelectPatient,
  onNavigateHome,
  onNavigate,
  onOpenNewPatientModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'sano' | 'diabetes' | 'hipertension' | 'activo'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'name' | 'compliance' | 'next-consult'>('recent');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [reminderSent, setReminderSent] = useState(false);
  const [exportToast, setExportToast] = useState(false);

  const filteredPatients = patients
    .filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.folio.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.condition.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;
      if (activeCategory === 'all' || activeCategory === 'activo') return true;
      if (activeCategory === 'sano') return p.conditionCategory === 'sano';
      if (activeCategory === 'diabetes') return p.conditionCategory === 'diabetes' || p.condition.toLowerCase().includes('diabetes');
      if (activeCategory === 'hipertension')
        return p.conditionCategory === 'hipertension' || p.secondaryCondition?.toLowerCase().includes('hipertensión');
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'compliance') return b.compliance - a.compliance;
      return 0;
    });

  const handleExport = () => {
    setExportToast(true);
    setTimeout(() => setExportToast(false), 2500);
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col gap-space-lg">
        {/* Breadcrumb & Top Command Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
          <div className="flex flex-col">
            <div className="flex items-center gap-space-xs font-label-sm text-label-sm text-secondary mb-1">
              <button
                onClick={onNavigateHome}
                className="hover:text-primary transition-colors flex items-center gap-1 cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[15px]">home</span>
                <span>Inicio</span>
              </button>
              <span className="text-secondary/60">/</span>
              <span className="text-primary font-semibold">Pacientes</span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Gestión de Pacientes</h1>
            <p className="font-body-md text-body-md text-secondary mt-0.5">
              Administra el registro clínico, estados de salud y expedientes nutricionales
            </p>
          </div>
          <div className="flex items-center gap-space-sm self-start md:self-auto">
            <button
              onClick={handleExport}
              className="inline-flex items-center gap-space-xs px-space-md py-space-sm bg-surface-container-lowest text-secondary hover:text-on-surface rounded-lg shadow-sm font-label-md text-label-md hover:bg-surface-container-low transition-colors cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-headline-sm">file_download</span>
              <span>{exportToast ? 'Exportado CSV ✓' : 'Exportar'}</span>
            </button>
            <button
              onClick={onOpenNewPatientModal}
              className="inline-flex items-center gap-space-xs px-space-md py-space-sm bg-primary-container text-on-primary rounded-lg shadow-sm hover:bg-primary transition-all font-label-md text-label-md active:scale-95 cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-headline-sm font-semibold">add</span>
              <span>Nuevo Paciente</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">Total Expedientes</span>
              <span className="font-headline-lg text-display-lg text-on-surface font-bold mt-1 tabular-nums">42</span>
              <span className="font-label-sm text-label-sm text-tertiary flex items-center gap-0.5 mt-0.5 font-medium">
                <span className="material-symbols-outlined text-label-md">trending_up</span> +3 este mes
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-surface-container-low text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">group</span>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">Pacientes Sanos</span>
              <span className="font-headline-lg text-display-lg text-tertiary font-bold mt-1 tabular-nums">25</span>
              <span className="font-label-sm text-label-sm text-secondary mt-0.5">Control preventivo / fitness</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-tertiary-fixed/40 text-tertiary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px] icon-filled">health_and_safety</span>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">Diabetes / Metabólico</span>
              <span className="font-headline-lg text-display-lg text-error font-bold mt-1 tabular-nums">17</span>
              <span className="font-label-sm text-label-sm text-error/80 mt-0.5">Atención prioritaria glucémica</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-error-container/60 text-error flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px] icon-filled">monitor_heart</span>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">Apego Promedio</span>
              <span className="font-headline-lg text-display-lg text-primary font-bold mt-1 tabular-nums">81.4%</span>
              <span className="font-label-sm text-label-sm text-primary flex items-center gap-0.5 mt-0.5 font-medium">
                <span className="material-symbols-outlined text-label-md">check_circle</span> Alta adherencia
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary-fixed/50 text-primary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">verified</span>
            </div>
          </div>
        </div>

        {/* Filter Bar & Search Container */}
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col gap-space-md">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-space-md">
            <div className="flex items-center flex-1 max-w-xl bg-surface-container-low rounded-lg px-space-md py-space-xs text-on-surface">
              <span className="material-symbols-outlined text-headline-sm text-secondary mr-space-sm">search</span>
              <input
                className="w-full bg-transparent border-0 outline-none font-body-md text-body-md text-on-surface placeholder:text-secondary focus:outline-none"
                placeholder="Buscar por nombre, folio clínico o correo..."
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="text-label-sm text-secondary bg-surface-container px-1.5 py-0.5 rounded font-mono">⌘K</span>
            </div>

            <div className="flex items-center gap-space-sm justify-between lg:justify-end">
              <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-lg">
                <span className="material-symbols-outlined text-secondary text-body-md ml-1">sort</span>
                <select
                  className="bg-transparent font-label-md text-label-md text-on-surface border-0 outline-none pr-space-sm cursor-pointer"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                >
                  <option value="recent">Recientes primero</option>
                  <option value="name">Alfabético (A-Z)</option>
                  <option value="compliance">Mayor apego</option>
                  <option value="next-consult">Próxima cita</option>
                </select>
              </div>
              <div className="flex items-center gap-0.5 bg-surface-container-low p-1 rounded-lg">
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-1 rounded transition-colors cursor-pointer ${
                    viewMode === 'table' ? 'bg-surface-container-lowest text-primary shadow-xs' : 'text-secondary hover:text-on-surface'
                  }`}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px]">table_rows</span>
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1 rounded transition-colors cursor-pointer ${
                    viewMode === 'grid' ? 'bg-surface-container-lowest text-primary shadow-xs' : 'text-secondary hover:text-on-surface'
                  }`}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px]">grid_view</span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-space-xs overflow-x-auto pb-1">
            {[
              { id: 'all', label: 'Todos (42)' },
              { id: 'sano', label: 'Sanos (25)' },
              { id: 'diabetes', label: 'Diabetes (17)' },
              { id: 'hipertension', label: 'Hipertensión (6)' },
              { id: 'activo', label: 'Bajo seguimiento activo (38)' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`px-space-md py-1.5 rounded-full font-label-md text-label-md transition-all whitespace-nowrap cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-primary-container text-on-primary'
                    : 'bg-surface-container-low text-secondary hover:bg-surface-container-high hover:text-primary'
                }`}
                type="button"
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Patients Clinical Table */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low/70 text-secondary font-label-sm text-label-sm uppercase tracking-wider select-none">
                  <th className="py-space-md px-space-lg font-semibold">Paciente</th>
                  <th className="py-space-md px-space-md font-semibold">Condición / Diagnóstico</th>
                  <th className="py-space-md px-space-md font-semibold">Edad / Sexo</th>
                  <th className="py-space-md px-space-md font-semibold">Última Consulta</th>
                  <th className="py-space-md px-space-md font-semibold">Próxima Cita</th>
                  <th className="py-space-md px-space-md font-semibold">Apego al Plan</th>
                  <th className="py-space-md px-space-lg text-right font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-low/50 font-body-md text-body-md text-on-surface">
                {filteredPatients.map((patient) => {
                  const isHealthy = patient.conditionCategory === 'sano';
                  return (
                    <tr
                      key={patient.id}
                      onClick={() => onSelectPatient(patient.id)}
                      className="hover:bg-surface-container-low/40 transition-colors cursor-pointer"
                    >
                      <td className="py-space-md px-space-lg">
                        <div className="flex items-center gap-space-sm">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold font-headline-sm ${patient.avatarColorClass}`}>
                            {patient.initials}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-headline-sm text-headline-sm text-on-surface hover:text-primary truncate">{patient.name}</span>
                            <span className="font-label-sm text-label-sm text-secondary truncate">Folio: {patient.folio} • {patient.phone}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-space-md px-space-md">
                        <div className="flex flex-col gap-1 items-start">
                          <span className={`inline-flex items-center gap-1.5 px-space-sm py-0.5 rounded-full text-label-sm font-label-md ${isHealthy ? 'bg-[#ECFDF5] text-[#047857]' : 'bg-[#FFF1F2] text-[#BE123C]'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${isHealthy ? 'bg-[#047857]' : 'bg-[#BE123C]'}`}></span>
                            {patient.condition}
                          </span>
                          {patient.secondaryCondition && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-secondary-fixed-dim/30 text-secondary">
                              {patient.secondaryCondition}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-space-md px-space-md whitespace-nowrap text-secondary tabular-nums">
                        <span className="text-on-surface font-medium">{patient.age} años</span>
                        <span className="text-secondary/70 mx-1">•</span>
                        <span>{patient.genderShort}</span>
                      </td>
                      <td className="py-space-md px-space-md whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-medium text-on-surface">{patient.lastConsultDate}</span>
                          <span className="font-label-sm text-label-sm text-secondary">{patient.lastConsultTopic}</span>
                        </div>
                      </td>
                      <td className="py-space-md px-space-md whitespace-nowrap">
                        {patient.nextAppointmentStatus === 'pending' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-error-container/40 text-error font-label-sm text-label-sm font-semibold">
                            <span className="material-symbols-outlined text-[14px]">priority_high</span> {patient.nextAppointment}
                          </span>
                        ) : (
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-container-low font-label-sm text-label-sm ${patient.nextAppointmentStatus === 'scheduled' ? 'text-primary font-semibold' : 'text-secondary'}`}>
                            <span className="material-symbols-outlined text-[14px]">event</span> {patient.nextAppointment}
                          </span>
                        )}
                      </td>
                      <td className="py-space-md px-space-md whitespace-nowrap">
                        <div className="flex items-center gap-space-sm w-36 tabular-nums">
                          <div className="w-full bg-surface-container-low h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${patient.compliance >= 90 ? 'bg-tertiary-container' : patient.compliance >= 70 ? 'bg-primary-container' : 'bg-secondary'}`}
                              style={{ width: `${patient.compliance}%` }}
                            ></div>
                          </div>
                          <span className="font-label-md text-label-md font-semibold text-on-surface">{patient.compliance}%</span>
                        </div>
                      </td>
                      <td className="py-space-md px-space-lg text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-space-xs">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectPatient(patient.id);
                            }}
                            className="px-space-sm py-1 rounded bg-surface-container-low hover:bg-primary-container hover:text-on-primary text-primary transition-colors font-label-md text-label-md cursor-pointer"
                            type="button"
                          >
                            Ver
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectPatient(patient.id);
                            }}
                            className="p-1 text-secondary hover:text-on-surface rounded hover:bg-surface-container-low cursor-pointer"
                            type="button"
                          >
                            <span className="material-symbols-outlined text-headline-sm">more_vert</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-space-md bg-surface-container-low/30 flex flex-col sm:flex-row items-center justify-between gap-space-md">
            <div className="flex items-center gap-space-sm text-secondary font-label-md text-label-md">
              <span>
                Mostrando <strong className="text-on-surface">1 - {filteredPatients.length}</strong> de <strong className="text-on-surface">42</strong> pacientes
              </span>
              <span className="text-secondary/40">•</span>
              <div className="flex items-center gap-1">
                <span>Filas:</span>
                <select className="bg-transparent text-on-surface font-semibold border-0 outline-none cursor-pointer">
                  <option value="5">5</option>
                  <option value="10">10</option>
                </select>
              </div>
            </div>
            <nav className="flex items-center gap-1">
              <button className="p-1.5 rounded-lg text-secondary opacity-40" disabled type="button">
                <span className="material-symbols-outlined text-headline-sm">chevron_left</span>
              </button>
              <button className="w-8 h-8 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md font-semibold flex items-center justify-center" type="button">1</button>
              <button className="w-8 h-8 rounded-lg text-secondary hover:bg-surface-container-low font-label-md text-label-md flex items-center justify-center" type="button">2</button>
              <button className="w-8 h-8 rounded-lg text-secondary hover:bg-surface-container-low font-label-md text-label-md flex items-center justify-center" type="button">3</button>
              <span className="text-secondary px-1 font-label-md">...</span>
              <button className="w-8 h-8 rounded-lg text-secondary hover:bg-surface-container-low font-label-md text-label-md flex items-center justify-center" type="button">9</button>
              <button className="p-1.5 rounded-lg text-secondary hover:bg-surface-container-low" type="button">
                <span className="material-symbols-outlined text-headline-sm">chevron_right</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Bottom 3 Clinical Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-lg mt-space-sm">
          <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-space-sm">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-semibold">Distribución Metabólica</span>
                <span className="material-symbols-outlined text-primary text-headline-sm">pie_chart</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface">Prevalencia de Diagnósticos</h3>
              <p className="font-body-sm text-body-sm text-secondary mt-1">Monitoreo continuo de perfiles patológicos en consulta activa.</p>
              <div className="space-y-space-sm mt-space-md">
                <div>
                  <div className="flex justify-between font-label-sm text-label-sm mb-1">
                    <span className="text-on-surface font-medium">Sanos &amp; Preventivos (59.5%)</span>
                    <span className="text-tertiary font-semibold">25 pacientes</span>
                  </div>
                  <div className="w-full bg-surface-container-low h-2 rounded-full overflow-hidden">
                    <div className="bg-tertiary-container h-full rounded-full" style={{ width: '59.5%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between font-label-sm text-label-sm mb-1">
                    <span className="text-on-surface font-medium">Diabetes Tipo 1 y 2 (40.5%)</span>
                    <span className="text-error font-semibold">17 pacientes</span>
                  </div>
                  <div className="w-full bg-surface-container-low h-2 rounded-full overflow-hidden">
                    <div className="bg-error h-full rounded-full" style={{ width: '40.5%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-space-md mt-space-md flex items-center justify-between">
              <span className="font-label-sm text-label-sm text-secondary">Actualizado hoy a las 14:00</span>
              <button onClick={() => onNavigate('reportes')} className="font-label-md text-label-md text-primary font-semibold hover:underline flex items-center gap-0.5 cursor-pointer" type="button">
                Ver métricas clínicas <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-space-sm">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-semibold">Citas de Hoy</span>
                <span className="material-symbols-outlined text-primary text-headline-sm">calendar_clock</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface">Agenda Nutricional</h3>
              <p className="font-body-sm text-body-sm text-secondary mt-1">3 revisiones restantes programadas para esta tarde.</p>
              <div className="space-y-space-xs mt-space-md">
                <div onClick={() => onSelectPatient('p1')} className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low/50 hover:bg-surface-container-low cursor-pointer">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-tertiary"></span>
                    <span className="font-label-md text-label-md text-on-surface font-medium">Juan Pérez</span>
                  </div>
                  <span className="font-mono text-label-sm text-secondary font-semibold">16:00 PM</span>
                </div>
                <div onClick={() => onSelectPatient('p4')} className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low/50 hover:bg-surface-container-low cursor-pointer">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                    <span className="font-label-md text-label-md text-on-surface font-medium">Sofía Morales</span>
                  </div>
                  <span className="font-mono text-label-sm text-secondary font-semibold">17:15 PM</span>
                </div>
                <div onClick={() => onSelectPatient('p3')} className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low/50 hover:bg-surface-container-low cursor-pointer">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-error"></span>
                    <span className="font-label-md text-label-md text-on-surface font-medium">Carlos Ramírez</span>
                  </div>
                  <span className="font-mono text-label-sm text-secondary font-semibold">18:30 PM</span>
                </div>
              </div>
            </div>
            <button onClick={() => onNavigate('consultas')} className="w-full mt-space-md py-space-xs bg-surface-container-low hover:bg-surface-container text-primary font-label-md text-label-md rounded-lg transition-colors text-center font-semibold cursor-pointer" type="button">
              Abrir Calendario Completo
            </button>
          </div>

          <div className="bg-primary-container p-space-lg rounded-xl text-on-primary shadow-sm flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-space-sm py-0.5 rounded-full bg-primary-fixed/20 text-on-primary font-label-sm text-label-sm mb-space-sm font-semibold">
                <span className="material-symbols-outlined text-[15px]">tips_and_updates</span> Asistente Clínico IA
              </div>
              <h3 className="font-headline-md text-headline-md text-on-primary">Alerta de Apego Glucémico</h3>
              <p className="font-body-md text-body-md text-on-primary/80 mt-space-xs">
                2 pacientes con Diabetes Tipo 2 han reducido su registro calórico diario en más de un 25% durante la última semana. Se recomienda enviar recordatorio nutricional.
              </p>
            </div>
            <div className="pt-space-md mt-space-md">
              <button
                onClick={() => setReminderSent(true)}
                className="w-full py-2 bg-on-primary text-primary-container hover:bg-surface-bright rounded-lg font-label-md text-label-md font-bold transition-all shadow-sm cursor-pointer"
                type="button"
              >
                {reminderSent ? 'Recordatorio Enviado ✓' : 'Enviar Recordatorio Automatizado'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
