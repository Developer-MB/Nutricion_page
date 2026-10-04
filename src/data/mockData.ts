export interface LabResult {
  id: string;
  date: string;
  glucose: number;
  hba1c: number;
  status: 'Óptimo' | 'Moderado' | 'Alerta';
}

export interface FoodItem {
  id: string;
  name: string;
  portion: string;
  kcal: number;
  imageUrl: string;
  mealType: 'desayuno' | 'colacion-manana' | 'comida' | 'colacion-tarde' | 'cena';
  macros: { carbs: number; protein: number; fat: number };
}

export interface WeightRecord {
  month: string;
  weight: number;
  glucose: number;
}

export interface Patient {
  id: string;
  name: string;
  initials: string;
  folio: string;
  expediente: string;
  age: number;
  gender: 'Masculino' | 'Femenino';
  genderShort: 'Masc.' | 'Fem.';
  phone: string;
  email: string;
  avatarUrl?: string;
  condition: string;
  secondaryCondition?: string;
  conditionCategory: 'sano' | 'diabetes' | 'hipertension';
  status: 'Activo en tratamiento' | 'En seguimiento';
  lastConsultDate: string;
  lastConsultTopic: string;
  nextAppointment: string;
  nextAppointmentStatus: 'scheduled' | 'pending' | 'confirmed';
  compliance: number;
  currentWeight: number;
  weightDiff: number;
  height: number;
  bmi: number;
  bmiStatus: string;
  bodyFat: number;
  bodyFatDiff: number;
  targetWeight: number;
  accumulatedProgress: string;
  weightHistory: WeightRecord[];
  labs: LabResult[];
  nextLabDate: string;
  dietPlanTitle: string;
  dietPlanStage: string;
  mealsRecorded: string;
  hydrationCompliance: string;
  physicalActivity: string;
  clinicalNotes: string;
  avatarColorClass: string;
}

export interface Appointment {
  id: string;
  date: string;
  time: string;
  patientId: string;
  patientName: string;
  initials: string;
  folio: string;
  type: string;
  protocol: string;
  protocolColor: 'red' | 'green' | 'teal';
  status: 'En espera' | 'Confirmada' | 'Agendada';
  avatarBg: string;
  avatarText: string;
}

export const ASSETS = {
  logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuCQJdJYbMUD176XwKFOd9qbGu5MnVS_7T2vIDBf-jMh6hlwMM1XejGry6vbf8WIQQaTkpD8jFWTV96CJBhJ6UrgtzxqJrC8lhPsdnCqi43i0zFlBLBcpGH563k_pylL4KDcK0TT0Il7QOA-8V5yvwiu_ZbQYgjWO0NrgIxtoJq2VCMjR9gzC7c8PurcCmrC_odgfg-Lzkrd4kY94yl1v-q4blr1gwRbRagH8vsntbj0FcLSxnHsAJEX",
  doctorProfile: "https://lh3.googleusercontent.com/aida-public/AB6AXuDqfpJzYMVd6qCLm4YSgC_vvjTcyzf47KfEX_TOsRxoHncIxSWL4m8gwO0xdxo72CHuOE-R2d3eQ-xhz1EYX0luAo_VU1XZjI5guCu2wLjy5icIzt6vSNR-C4t5oSRuHX5u5qIotX78SVC12WeuknZn5Jq3mjPvcg1Mq_drXl43w4hWkuNm_Bo7bilhPhHXVKh59RyERLUdCThc6ucY_p_uWliu2Ot1Pkb3lURacXcUCWj9HTl4IhAM",
  juanPerezAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBsqo56Np0g1Yc6JLaeUl7I_bz20huVL237DNs6XAwsyNYjlq0FIIAjLqC51BLp_vIkXUjeexReE514vv2tCAN97xeoYJ2UTET6AnHwvEPqHLcDW5wP5cJ-DX5WrbEP2C573RS6AhpS5R5h9SSiyFw3oxkGjFsOSNPN-GdL3Aec0I4qfcCFHxLqdw9OlSwSMOcQ53GxVR8Z4PiFbgKcBV6NvYIt-Aj0MdlAXbkzMLhVII9BGRjTHUIc",
  oatmealFood: "https://lh3.googleusercontent.com/aida-public/AB6AXuBVKGpZF5aciq6_C5oZqwNMvjap9EbJAVJcxTE6TOCC9FcnF0UWXn0k2pX9aeZyCvsxSMeO_1io8WxapWN5hHbqyS0Wkg5u09bwiMa0E70_aIX9WG7-VKyFEE70s7h_6dJ2_FELOPhKk0bDe_iHgQXmP1u3MzYoCSFIf24SSrAA_zsXj8Sa9btUKDJCqiWAOsn_ceP1G6acTYHg3OvDPNGrgbAefciyZTU8uYpPqR6AEXUkOhJdFsFA",
  bananaFood: "https://lh3.googleusercontent.com/aida-public/AB6AXuAduqcvo7X_Qn5J48Bfy_1nZtb7ISXoseOQXDy5BHwvT6NvCyypL0mJJ9UcKme4NnAmCDlm7OSiAOEj2LeI3H2AayZIcRJNAvPUwJlyqTD8VRry0tgUEn8Mx52SPOoLTLWfSWrlYNynxl70SIrYIv9QAvLvFHEn0UwAAZgNNCCQL3w7P7K3wEcm477dAtcJmXYLdOce_k5LE_JG79ad01prBwpEaQUfaXuEC-GMw-rBbS0pJkkQeZnw",
  milkFood: "https://lh3.googleusercontent.com/aida-public/AB6AXuApsWH2ii3pjHEZDmPJO8f0_tAKbSaNosif6OyGoXU1u9sfFbPgG6rIzbXwCSVbb9pAjOPOWlHrXRmwBzL5YRh_FlUkDyvfyZ1G099p09V4qbr8wVfQxWAjTntsSLm0Kfi3_z5BoS4AcYQ7HjasAtQdjUtN2UnyOjrS3NorouFupAVCUaNdkrcff708QhNZKnvJ7iPe96crCZmljPfh7Z2TG-fvxWuyxCxqd4k8bpenHB2d1uCplpuu",
};

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'p1',
    name: 'Juan Pérez',
    initials: 'JP',
    folio: '#NUT-2024-089',
    expediente: 'Expediente #NP-2024-089',
    age: 35,
    gender: 'Masculino',
    genderShort: 'Masc.',
    phone: '555 123 4567',
    email: 'juanperez@email.com',
    avatarUrl: ASSETS.juanPerezAvatar,
    condition: 'Diabetes Tipo 2',
    conditionCategory: 'diabetes',
    status: 'Activo en tratamiento',
    lastConsultDate: '10 Oct 2024',
    lastConsultTopic: 'Ajuste de carbohidratos',
    nextAppointment: '24 Oct, 10:00 AM',
    nextAppointmentStatus: 'scheduled',
    compliance: 82,
    currentWeight: 78,
    weightDiff: -2.4,
    height: 1.70,
    bmi: 27.0,
    bmiStatus: 'Sobrepeso',
    bodyFat: 22.4,
    bodyFatDiff: -1.2,
    targetWeight: 72.0,
    accumulatedProgress: '-7.5%',
    weightHistory: [
      { month: 'Ene', weight: 80, glucose: 165 },
      { month: 'Feb', weight: 75, glucose: 142 },
      { month: 'Mar', weight: 67, glucose: 118 },
      { month: 'Abr', weight: 63, glucose: 116 },
      { month: 'May', weight: 58, glucose: 115 },
    ],
    labs: [
      { id: 'l1', date: '10/10/2024', glucose: 125, hba1c: 6.5, status: 'Óptimo' },
      { id: 'l2', date: '15/08/2024', glucose: 132, hba1c: 6.8, status: 'Moderado' },
      { id: 'l3', date: '10/06/2024', glucose: 140, hba1c: 7.2, status: 'Alerta' },
    ],
    nextLabDate: '15 Nov 2024',
    dietPlanTitle: 'Normocalórico · 1,850 kcal/día',
    dietPlanStage: 'Semana 4 / Fase 2',
    mealsRecorded: '26 / 28 registradas',
    hydrationCompliance: '90% cumplido',
    physicalActivity: '4 días / semana',
    clinicalNotes: 'Excelente apego al desayuno y control de carbohidratos simples. Reporta niveles estables de energía durante la jornada laboral. Continuar con caminata de 30 min y mantener monitoreo de glucosa preprandial.',
    avatarColorClass: 'bg-secondary-container/60 text-on-secondary-fixed',
  },
  {
    id: 'p2',
    name: 'María López',
    initials: 'ML',
    folio: '#NUT-2024-094',
    expediente: 'Expediente #NP-2024-094',
    age: 28,
    gender: 'Femenino',
    genderShort: 'Fem.',
    phone: '+52 55 1289 4432',
    email: 'marialopez@email.com',
    condition: 'Sano',
    conditionCategory: 'sano',
    status: 'Activo en tratamiento',
    lastConsultDate: '12 Oct 2024',
    lastConsultTopic: 'Primera consulta / Evaluación',
    nextAppointment: '26 Oct, 11:30 AM',
    nextAppointmentStatus: 'confirmed',
    compliance: 95,
    currentWeight: 61.5,
    weightDiff: -1.5,
    height: 1.65,
    bmi: 22.6,
    bmiStatus: 'Normal',
    bodyFat: 19.8,
    bodyFatDiff: -0.8,
    targetWeight: 59.0,
    accumulatedProgress: '-4.2%',
    weightHistory: [
      { month: 'Ene', weight: 64, glucose: 96 },
      { month: 'Feb', weight: 63, glucose: 94 },
      { month: 'Mar', weight: 62.5, glucose: 91 },
      { month: 'Abr', weight: 62, glucose: 90 },
      { month: 'May', weight: 61.5, glucose: 89 },
    ],
    labs: [
      { id: 'l4', date: '12/10/2024', glucose: 89, hba1c: 5.2, status: 'Óptimo' },
      { id: 'l5', date: '10/07/2024', glucose: 92, hba1c: 5.3, status: 'Óptimo' },
    ],
    nextLabDate: '12 Ene 2025',
    dietPlanTitle: 'Mantenimiento · 1,900 kcal/día',
    dietPlanStage: 'Semana 2 / Fase 1',
    mealsRecorded: '27 / 28 registradas',
    hydrationCompliance: '96% cumplido',
    physicalActivity: '5 días / semana',
    clinicalNotes: 'Paciente con excelente composición corporal y hábitos saludables. Se ajusta aporte proteico post-entrenamiento para mejorar recuperación muscular.',
    avatarColorClass: 'bg-tertiary-fixed/50 text-on-tertiary-fixed',
  },
  {
    id: 'p3',
    name: 'Carlos Ramírez',
    initials: 'CR',
    folio: '#NUT-2024-031',
    expediente: 'Expediente #NP-2024-031',
    age: 42,
    gender: 'Masculino',
    genderShort: 'Masc.',
    phone: '+52 55 9823 1102',
    email: 'carlos.ramirez@email.com',
    condition: 'Diabetes Tipo 2',
    conditionCategory: 'diabetes',
    status: 'Activo en tratamiento',
    lastConsultDate: '11 Oct 2024',
    lastConsultTopic: 'Revisión de glucemia',
    nextAppointment: 'Pendiente agendar',
    nextAppointmentStatus: 'pending',
    compliance: 65,
    currentWeight: 88.2,
    weightDiff: -1.1,
    height: 1.75,
    bmi: 28.8,
    bmiStatus: 'Sobrepeso',
    bodyFat: 26.5,
    bodyFatDiff: -0.5,
    targetWeight: 79.0,
    accumulatedProgress: '-3.8%',
    weightHistory: [
      { month: 'Ene', weight: 92, glucose: 172 },
      { month: 'Feb', weight: 91, glucose: 158 },
      { month: 'Mar', weight: 90, glucose: 149 },
      { month: 'Abr', weight: 89, glucose: 141 },
      { month: 'May', weight: 88.2, glucose: 136 },
    ],
    labs: [
      { id: 'l6', date: '11/10/2024', glucose: 136, hba1c: 7.1, status: 'Alerta' },
      { id: 'l7', date: '05/08/2024', glucose: 148, hba1c: 7.4, status: 'Alerta' },
    ],
    nextLabDate: '10 Nov 2024',
    dietPlanTitle: 'Control Glucémico · 1,700 kcal/día',
    dietPlanStage: 'Semana 6 / Fase 2',
    mealsRecorded: '19 / 28 registradas',
    hydrationCompliance: '75% cumplido',
    physicalActivity: '2 días / semana',
    clinicalNotes: 'Requiere reforzar apego en colaciones vespertinas y cenas. Se recomienda revisar HbA1c reciente y enviar recordatorio de registro diario.',
    avatarColorClass: 'bg-error-container/40 text-error',
  },
  {
    id: 'p4',
    name: 'Ana Sofía Torres',
    initials: 'AT',
    folio: '#NUT-2024-055',
    expediente: 'Expediente #NP-2024-055',
    age: 31,
    gender: 'Femenino',
    genderShort: 'Fem.',
    phone: '+52 55 6745 2209',
    email: 'anasofia.torres@email.com',
    condition: 'Sano / Deportista',
    conditionCategory: 'sano',
    status: 'Activo en tratamiento',
    lastConsultDate: '08 Oct 2024',
    lastConsultTopic: 'Ajuste calórico hipertrofia',
    nextAppointment: '29 Oct, 09:00 AM',
    nextAppointmentStatus: 'scheduled',
    compliance: 90,
    currentWeight: 58.4,
    weightDiff: 0.8,
    height: 1.63,
    bmi: 22.0,
    bmiStatus: 'Óptimo',
    bodyFat: 17.2,
    bodyFatDiff: -0.9,
    targetWeight: 60.0,
    accumulatedProgress: '+3.2% masa magra',
    weightHistory: [
      { month: 'Ene', weight: 56.5, glucose: 88 },
      { month: 'Feb', weight: 57.0, glucose: 87 },
      { month: 'Mar', weight: 57.5, glucose: 89 },
      { month: 'Abr', weight: 58.0, glucose: 86 },
      { month: 'May', weight: 58.4, glucose: 85 },
    ],
    labs: [
      { id: 'l8', date: '08/10/2024', glucose: 85, hba1c: 5.0, status: 'Óptimo' },
    ],
    nextLabDate: '08 Ene 2025',
    dietPlanTitle: 'Hiperproteico Deportivo · 2,250 kcal/día',
    dietPlanStage: 'Semana 5 / Fase 2',
    mealsRecorded: '25 / 28 registradas',
    hydrationCompliance: '95% cumplido',
    physicalActivity: '6 días / semana',
    clinicalNotes: 'Evolución favorable en ganancia de masa muscular magra sin incremento de tejido adiposo.',
    avatarColorClass: 'bg-primary-fixed/40 text-primary',
  },
  {
    id: 'p5',
    name: 'Roberto Garza',
    initials: 'RG',
    folio: '#NUT-2024-019',
    expediente: 'Expediente #NP-2024-019',
    age: 54,
    gender: 'Masculino',
    genderShort: 'Masc.',
    phone: '+52 55 3301 9081',
    email: 'roberto.garza@email.com',
    condition: 'Diabetes / Metabólico',
    secondaryCondition: 'Hipertensión',
    conditionCategory: 'hipertension',
    status: 'Activo en tratamiento',
    lastConsultDate: '05 Oct 2024',
    lastConsultTopic: 'Control lipídico y sodio',
    nextAppointment: '03 Nov, 16:30 PM',
    nextAppointmentStatus: 'scheduled',
    compliance: 72,
    currentWeight: 83.0,
    weightDiff: -1.8,
    height: 1.72,
    bmi: 28.1,
    bmiStatus: 'Sobrepeso',
    bodyFat: 25.1,
    bodyFatDiff: -1.0,
    targetWeight: 75.0,
    accumulatedProgress: '-5.1%',
    weightHistory: [
      { month: 'Ene', weight: 87.5, glucose: 150 },
      { month: 'Feb', weight: 86.2, glucose: 144 },
      { month: 'Mar', weight: 85.0, glucose: 138 },
      { month: 'Abr', weight: 84.1, glucose: 131 },
      { month: 'May', weight: 83.0, glucose: 127 },
    ],
    labs: [
      { id: 'l9', date: '05/10/2024', glucose: 127, hba1c: 6.4, status: 'Óptimo' },
      { id: 'l10', date: '01/07/2024', glucose: 139, hba1c: 6.9, status: 'Moderado' },
    ],
    nextLabDate: '05 Dic 2024',
    dietPlanTitle: 'DASH Hiposódico · 1,750 kcal/día',
    dietPlanStage: 'Semana 8 / Fase 3',
    mealsRecorded: '21 / 28 registradas',
    hydrationCompliance: '84% cumplido',
    physicalActivity: '3 días / semana',
    clinicalNotes: 'Mejoría significativa en presión arterial y glucosa basal tras restricción de sodio procesado.',
    avatarColorClass: 'bg-secondary-fixed text-on-secondary-fixed',
  }
];

export const INITIAL_FOOD_ITEMS: FoodItem[] = [
  {
    id: 'f1',
    name: 'Avena en hojuelas',
    portion: '1/2 taza (40 g) · Cocida en agua',
    kcal: 150,
    imageUrl: ASSETS.oatmealFood,
    mealType: 'desayuno',
    macros: { carbs: 27, protein: 5, fat: 2.5 },
  },
  {
    id: 'f2',
    name: 'Plátano fresco',
    portion: '1 pieza mediana (120 g)',
    kcal: 105,
    imageUrl: ASSETS.bananaFood,
    mealType: 'desayuno',
    macros: { carbs: 27, protein: 1.3, fat: 0.4 },
  },
  {
    id: 'f3',
    name: 'Leche descremada',
    portion: '1 vaso (250 ml)',
    kcal: 90,
    imageUrl: ASSETS.milkFood,
    mealType: 'desayuno',
    macros: { carbs: 12, protein: 8.5, fat: 0.5 },
  },
  {
    id: 'f4',
    name: 'Almendras fileteadas y Yogur Griego',
    portion: '150 g yogur natural + 10 almendras',
    kcal: 195,
    imageUrl: ASSETS.milkFood,
    mealType: 'colacion-manana',
    macros: { carbs: 9, protein: 16, fat: 9 },
  },
  {
    id: 'f5',
    name: 'Pechuga de pollo a la plancha con quinoa',
    portion: '150 g pechuga + 1/2 taza quinoa cocida',
    kcal: 420,
    imageUrl: ASSETS.oatmealFood,
    mealType: 'comida',
    macros: { carbs: 34, protein: 42, fat: 11 },
  },
  {
    id: 'f6',
    name: 'Manzana verde con crema de cacahuate',
    portion: '1 pieza + 1 cdita natural',
    kcal: 165,
    imageUrl: ASSETS.bananaFood,
    mealType: 'colacion-tarde',
    macros: { carbs: 22, protein: 4, fat: 7 },
  },
  {
    id: 'f7',
    name: 'Salmón al horno con espárragos',
    portion: '130 g filete + 1 taza espárragos al vapor',
    kcal: 360,
    imageUrl: ASSETS.oatmealFood,
    mealType: 'cena',
    macros: { carbs: 8, protein: 34, fat: 21 },
  },
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'a1',
    date: '10/10/2024',
    time: '09:30 AM',
    patientId: 'p1',
    patientName: 'Juan Pérez',
    initials: 'JP',
    folio: 'Folio: #N-4091',
    type: 'Seguimiento',
    protocol: 'Diabetes Tipo 2',
    protocolColor: 'red',
    status: 'En espera',
    avatarBg: 'bg-secondary-container',
    avatarText: 'text-on-secondary-fixed',
  },
  {
    id: 'a2',
    date: '10/10/2024',
    time: '11:00 AM',
    patientId: 'p2',
    patientName: 'María López',
    initials: 'ML',
    folio: 'Folio: #N-4098',
    type: 'Primera consulta',
    protocol: 'Evaluación y Plan',
    protocolColor: 'green',
    status: 'Confirmada',
    avatarBg: 'bg-primary-fixed',
    avatarText: 'text-on-primary-fixed',
  },
  {
    id: 'a3',
    date: '11/10/2024',
    time: '04:00 PM',
    patientId: 'p3',
    patientName: 'Carlos Ramírez',
    initials: 'CR',
    folio: 'Folio: #N-3882',
    type: 'Seguimiento',
    protocol: 'Diabetes Control',
    protocolColor: 'red',
    status: 'Agendada',
    avatarBg: 'bg-surface-container-highest',
    avatarText: 'text-on-background',
  },
  {
    id: 'a4',
    date: '12/10/2024',
    time: '10:15 AM',
    patientId: 'p4',
    patientName: 'Sofía Mendoza',
    initials: 'SM',
    folio: 'Folio: #N-4112',
    type: 'Antropometría',
    protocol: 'Rendimiento Deportivo',
    protocolColor: 'teal',
    status: 'Agendada',
    avatarBg: 'bg-secondary-fixed',
    avatarText: 'text-on-secondary-fixed',
  },
];
