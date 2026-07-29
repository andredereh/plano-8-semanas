// ============================================================
// DADOS DO PLANO DE 8 SEMANAS — André
// Athletic Dark Pro design system
// ============================================================

export type WorkoutType = "forca-a" | "corrida" | "forca-b" | "cardio" | "descanso";

export interface Exercise {
  name: string;
  detail: string;
}

export interface Workout {
  type: WorkoutType;
  label: string;
  duration: string;
  rpe: string;
  kcal: string;
  exercises: Exercise[];
  notes?: string;
}

export interface DayPlan {
  dayOfWeek: number; // 0=Dom, 1=Seg, 2=Ter, 3=Qua, 4=Qui, 5=Sex, 6=Sáb
  workout: Workout;
}

export interface WeekPlan {
  week: number;
  title: string;
  days: DayPlan[];
}

const REST: Workout = {
  type: "descanso",
  label: "Descanso",
  duration: "—",
  rpe: "—",
  kcal: "—",
  exercises: [],
  notes: "Recuperação ativa. Caminhada leve ou alongamento se quiser.",
};

const WARMUP_A: Exercise[] = [
  { name: "Mobilidade de tornozelo", detail: "10 círculos cada lado" },
  { name: "90/90 de quadril", detail: "10 repetições" },
  { name: "Elevações de joelho", detail: "10 repetições" },
  { name: "Rotações de braços", detail: "10 repetições" },
  { name: "Prancha alta", detail: "30 s" },
];

const WARMUP_B: Exercise[] = [
  { name: "Bike leve", detail: "2 min" },
  { name: "Mobilidade de sóleo/gastrocnêmio", detail: "10 reps dinâmicos na parede" },
  { name: "Afundos alternados", detail: "10 repetições" },
  { name: "Bons-dias sem peso", detail: "10 repetições" },
];

// ── SEMANA 0 — Pré-validação (29/07–02/08) ───────────────────
export const PRE_WEEK: WeekPlan = {
  week: 0,
  title: "Semana 0 — Pré-validação",
  days: [
    {
      dayOfWeek: 3, // Quarta 29/07
      workout: {
        type: "corrida", label: "Corrida Leve", duration: "30 min", rpe: "4–5", kcal: "~320",
        exercises: [
          { name: "Caminhada aquecimento", detail: "5 min" },
          { name: "Corrida leve contínua", detail: "20 min — ritmo confortável" },
          { name: "Caminhada desaquecimento", detail: "5 min" },
        ],
        notes: "Pré-validação: avalie como seu corpo responde. Sem pressão de pace.",
      },
    },
    { dayOfWeek: 4, workout: REST }, // Quinta 30/07 — descanso
    {
      dayOfWeek: 5, // Sexta 01/08
      workout: {
        type: "forca-a", label: "Força A", duration: "40 min", rpe: "5–6", kcal: "~300",
        exercises: [
          ...WARMUP_A,
          { name: "Agachamento livre", detail: "3×12" },
          { name: "Flexão inclinada (sofá)", detail: "3×10" },
          { name: "Remada com elástico", detail: "3×12" },
          { name: "Ponte de glúteo", detail: "3×15" },
          { name: "Prancha", detail: "3×30 s" },
        ],
        notes: "Pré-validação: foco em técnica. Use para calibrar sua forma antes da Semana 1.",
      },
    },
    { dayOfWeek: 6, workout: REST }, // Sábado 02/08 — em aberto
    { dayOfWeek: 0, workout: REST }, // Domingo 03/08 — início oficial
    { dayOfWeek: 1, workout: REST },
    { dayOfWeek: 2, workout: REST },
  ],
};

export const PLAN: WeekPlan[] = [
  // ── SEMANAS 1–2 ──────────────────────────────────────────
  {
    week: 1,
    title: "Semana 1 — Retomada",
    days: [
      {
        dayOfWeek: 1,
        workout: {
          type: "forca-a", label: "Força A", duration: "40 min", rpe: "5–6", kcal: "~300",
          exercises: [
            ...WARMUP_A,
            { name: "Agachamento livre", detail: "3×12" },
            { name: "Flexão inclinada (sofá)", detail: "3×10" },
            { name: "Remada com elástico", detail: "3×12" },
            { name: "Ponte de glúteo", detail: "3×15" },
            { name: "Prancha", detail: "3×30 s" },
            { name: "Caminhada na esteira", detail: "10 min — RPE 3" },
          ],
          notes: "3 voltas. Foco em técnica, não em carga.",
        },
      },
      { dayOfWeek: 2, workout: REST },
      {
        dayOfWeek: 3,
        workout: {
          type: "corrida", label: "Corrida Leve", duration: "35 min", rpe: "5", kcal: "~380",
          exercises: [
            { name: "Caminhada aquecimento", detail: "5 min + 2 min mobilidade" },
            { name: "Corrida leve contínua", detail: "25 min — 6:50–7:20/km" },
            { name: "Caminhada desaquecimento", detail: "5 min" },
          ],
          notes: "Ritmo confortável. Se precisar caminhar, caminhe.",
        },
      },
      { dayOfWeek: 4, workout: REST },
      {
        dayOfWeek: 5,
        workout: {
          type: "forca-b", label: "Força B", duration: "40 min", rpe: "5–6", kcal: "~290",
          exercises: [
            ...WARMUP_B,
            { name: "Afundo reverso", detail: "3×10 cada perna" },
            { name: "Desenvolvimento com elástico", detail: "3×12" },
            { name: "Terra romeno com elástico", detail: "3×12" },
            { name: "Remada baixa com elástico", detail: "3×12" },
            { name: "Prancha lateral", detail: "3×25 s cada lado" },
            { name: "Bike leve", detail: "15 min" },
          ],
          notes: "3 voltas. Controle o movimento na descida.",
        },
      },
      {
        dayOfWeek: 6,
        workout: {
          type: "cardio", label: "Cardio Principal", duration: "45 min", rpe: "5–6", kcal: "~450",
          exercises: [
            { name: "Aquecimento leve", detail: "10 min + 2 min mobilidade" },
            { name: "Ritmo confortável", detail: "20 min — RPE 5" },
            { name: "Ritmo um pouco mais firme", detail: "10 min — RPE 6" },
            { name: "Caminhada desaquecimento", detail: "5 min" },
          ],
          notes: "RPE médio 5–6. Não force.",
        },
      },
      { dayOfWeek: 0, workout: REST },
    ],
  },
  {
    week: 2,
    title: "Semana 2 — Consolidação",
    days: [
      {
        dayOfWeek: 1,
        workout: {
          type: "forca-a", label: "Força A", duration: "40 min", rpe: "5–6", kcal: "~310",
          exercises: [
            ...WARMUP_A,
            { name: "Agachamento livre", detail: "3×12" },
            { name: "Flexão inclinada (sofá)", detail: "3×10" },
            { name: "Remada com elástico", detail: "3×12" },
            { name: "Ponte de glúteo", detail: "3×15" },
            { name: "Prancha", detail: "3×30 s" },
            { name: "Caminhada na esteira", detail: "10 min — RPE 3" },
          ],
          notes: "3 voltas. Já deve sentir mais controle que na Semana 1.",
        },
      },
      { dayOfWeek: 2, workout: REST },
      {
        dayOfWeek: 3,
        workout: {
          type: "corrida", label: "Corrida Leve", duration: "40 min", rpe: "5", kcal: "~410",
          exercises: [
            { name: "Caminhada aquecimento", detail: "5 min + 2 min mobilidade" },
            { name: "Corrida leve contínua", detail: "30 min — 6:50–7:20/km" },
            { name: "Caminhada desaquecimento", detail: "5 min" },
          ],
          notes: "+5 min em relação à Semana 1. Ritmo igual.",
        },
      },
      { dayOfWeek: 4, workout: REST },
      {
        dayOfWeek: 5,
        workout: {
          type: "forca-b", label: "Força B", duration: "40 min", rpe: "5–6", kcal: "~300",
          exercises: [
            ...WARMUP_B,
            { name: "Afundo reverso", detail: "3×10 cada perna" },
            { name: "Desenvolvimento com elástico", detail: "3×12" },
            { name: "Terra romeno com elástico", detail: "3×12" },
            { name: "Remada baixa com elástico", detail: "3×12" },
            { name: "Prancha lateral", detail: "3×25 s cada lado" },
            { name: "Bike leve", detail: "15 min" },
          ],
        },
      },
      {
        dayOfWeek: 6,
        workout: {
          type: "cardio", label: "Cardio Principal", duration: "45 min", rpe: "5–6", kcal: "~450",
          exercises: [
            { name: "Aquecimento leve", detail: "10 min + 2 min mobilidade" },
            { name: "Ritmo confortável", detail: "20 min — RPE 5" },
            { name: "Ritmo firme", detail: "10 min — RPE 6" },
            { name: "Caminhada desaquecimento", detail: "5 min" },
          ],
        },
      },
      { dayOfWeek: 0, workout: REST },
    ],
  },
  // ── SEMANAS 3–4 ──────────────────────────────────────────
  {
    week: 3,
    title: "Semana 3 — Progressão",
    days: [
      {
        dayOfWeek: 1,
        workout: {
          type: "forca-a", label: "Força A", duration: "45 min", rpe: "6", kcal: "~340",
          exercises: [
            ...WARMUP_A,
            { name: "Agachamento livre", detail: "4×12" },
            { name: "Flexão inclinada (sofá)", detail: "4×10" },
            { name: "Remada com elástico", detail: "4×12" },
            { name: "Ponte de glúteo", detail: "4×15" },
            { name: "Prancha", detail: "4×40 s" },
            { name: "Elevação de ponta de pé", detail: "3×15" },
            { name: "Caminhada na esteira", detail: "10 min — RPE 3" },
          ],
          notes: "4 voltas agora. Prancha sobe para 40s.",
        },
      },
      { dayOfWeek: 2, workout: REST },
      {
        dayOfWeek: 3,
        workout: {
          type: "corrida", label: "Corrida Contínua", duration: "45 min", rpe: "5–6", kcal: "~460",
          exercises: [
            { name: "Caminhada aquecimento", detail: "5 min + 2 min mobilidade" },
            { name: "Corrida leve contínua", detail: "30 min — 6:50–7:20/km" },
            { name: "Ritmo mais firme", detail: "5 min — RPE 6" },
            { name: "Caminhada desaquecimento", detail: "5 min" },
          ],
          notes: "Últimos 5 min mais firmes. Primeira vez com variação de ritmo.",
        },
      },
      { dayOfWeek: 4, workout: REST },
      {
        dayOfWeek: 5,
        workout: {
          type: "forca-b", label: "Força B", duration: "45 min", rpe: "6", kcal: "~330",
          exercises: [
            ...WARMUP_B,
            { name: "Afundo reverso", detail: "4×10 cada perna" },
            { name: "Desenvolvimento com elástico", detail: "4×12" },
            { name: "Terra romeno com elástico", detail: "4×12" },
            { name: "Remada baixa com elástico", detail: "4×12" },
            { name: "Prancha lateral", detail: "4×25 s cada lado" },
            { name: "Bike leve", detail: "20 min" },
          ],
          notes: "4 voltas. Bike sobe para 20 min.",
        },
      },
      {
        dayOfWeek: 6,
        workout: {
          type: "cardio", label: "Intervalado Moderado", duration: "50 min", rpe: "6–7", kcal: "~520",
          exercises: [
            { name: "Aquecimento", detail: "10 min + 3 min mobilidade" },
            { name: "5× Bloco moderado", detail: "3 min — RPE 6–7" },
            { name: "Recuperação entre blocos", detail: "2 min leve" },
            { name: "Desaquecimento", detail: "5 min" },
          ],
          notes: "Primeiro treino intervalado do ciclo. Controle o RPE.",
        },
      },
      { dayOfWeek: 0, workout: REST },
    ],
  },
  {
    week: 4,
    title: "Semana 4 — Consolidação II",
    days: [
      {
        dayOfWeek: 1,
        workout: {
          type: "forca-a", label: "Força A", duration: "45 min", rpe: "6", kcal: "~345",
          exercises: [
            ...WARMUP_A,
            { name: "Agachamento livre", detail: "4×12" },
            { name: "Flexão inclinada (sofá)", detail: "4×10" },
            { name: "Remada com elástico", detail: "4×12" },
            { name: "Ponte de glúteo", detail: "4×15" },
            { name: "Prancha", detail: "4×40 s" },
            { name: "Elevação de ponta de pé", detail: "3×15" },
            { name: "Caminhada na esteira", detail: "10 min" },
          ],
        },
      },
      { dayOfWeek: 2, workout: REST },
      {
        dayOfWeek: 3,
        workout: {
          type: "corrida", label: "Corrida Contínua", duration: "45 min", rpe: "5–6", kcal: "~460",
          exercises: [
            { name: "Caminhada aquecimento", detail: "5 min + 2 min mobilidade" },
            { name: "Corrida leve contínua", detail: "30 min" },
            { name: "Ritmo mais firme", detail: "5 min — RPE 6" },
            { name: "Caminhada desaquecimento", detail: "5 min" },
          ],
        },
      },
      { dayOfWeek: 4, workout: REST },
      {
        dayOfWeek: 5,
        workout: {
          type: "forca-b", label: "Força B", duration: "45 min", rpe: "6", kcal: "~335",
          exercises: [
            ...WARMUP_B,
            { name: "Afundo reverso", detail: "4×10 cada perna" },
            { name: "Desenvolvimento com elástico", detail: "4×12" },
            { name: "Terra romeno com elástico", detail: "4×12" },
            { name: "Remada baixa com elástico", detail: "4×12" },
            { name: "Prancha lateral", detail: "4×25 s cada lado" },
            { name: "Bike leve", detail: "20 min" },
          ],
        },
      },
      {
        dayOfWeek: 6,
        workout: {
          type: "cardio", label: "Intervalado Moderado", duration: "50 min", rpe: "6–7", kcal: "~520",
          exercises: [
            { name: "Aquecimento", detail: "10 min + 3 min mobilidade" },
            { name: "5× Bloco moderado", detail: "3 min — RPE 6–7" },
            { name: "Recuperação entre blocos", detail: "2 min leve" },
            { name: "Desaquecimento", detail: "5 min" },
          ],
        },
      },
      { dayOfWeek: 0, workout: REST },
    ],
  },
  // ── SEMANAS 5–6 ──────────────────────────────────────────
  {
    week: 5,
    title: "Semana 5 — Intensificação",
    days: [
      {
        dayOfWeek: 1,
        workout: {
          type: "forca-a", label: "Força A", duration: "45 min", rpe: "6", kcal: "~350",
          exercises: [
            ...WARMUP_A,
            { name: "Agachamento livre (pausa 1s no fundo)", detail: "4×12" },
            { name: "Flexão inclinada (sofá)", detail: "4×10" },
            { name: "Remada com elástico", detail: "4×12" },
            { name: "Ponte de glúteo", detail: "4×15" },
            { name: "Prancha", detail: "4×40 s" },
            { name: "Elevação de ponta de pé", detail: "3×15" },
            { name: "Caminhada na esteira", detail: "10 min" },
          ],
          notes: "Novidade: pausa de 1s no fundo do agachamento.",
        },
      },
      { dayOfWeek: 2, workout: REST },
      {
        dayOfWeek: 3,
        workout: {
          type: "corrida", label: "Corrida Aeróbica", duration: "45 min", rpe: "5", kcal: "~470",
          exercises: [
            { name: "Caminhada aquecimento", detail: "2 min mobilidade" },
            { name: "Corrida contínua", detail: "45 min — RPE 5" },
          ],
          notes: "45 min contínuos. Ritmo confortável, sem variação.",
        },
      },
      { dayOfWeek: 4, workout: REST },
      {
        dayOfWeek: 5,
        workout: {
          type: "forca-b", label: "Força B", duration: "50 min", rpe: "6", kcal: "~360",
          exercises: [
            ...WARMUP_B,
            { name: "Afundo reverso", detail: "4×10 cada perna" },
            { name: "Desenvolvimento com elástico", detail: "4×12" },
            { name: "Terra romeno com elástico", detail: "4×12" },
            { name: "Remada baixa com elástico", detail: "4×12" },
            { name: "Prancha lateral", detail: "4×25 s cada lado" },
            { name: "Panturrilha em pé", detail: "3×15" },
            { name: "Bike leve", detail: "20–25 min" },
          ],
          notes: "Novo exercício: Panturrilha em pé.",
        },
      },
      {
        dayOfWeek: 6,
        workout: {
          type: "cardio", label: "Progressivo 6–7 km", duration: "50 min", rpe: "5–7", kcal: "~540",
          exercises: [
            { name: "2 km leve", detail: "RPE 4–5" },
            { name: "3 km confortável", detail: "RPE 5–6" },
            { name: "1–2 km firme", detail: "RPE 6–7" },
            { name: "Caminhada desaquecimento", detail: "5 min" },
          ],
          notes: "Primeiro treino progressivo por distância.",
        },
      },
      { dayOfWeek: 0, workout: REST },
    ],
  },
  {
    week: 6,
    title: "Semana 6 — Consolidação III",
    days: [
      {
        dayOfWeek: 1,
        workout: {
          type: "forca-a", label: "Força A", duration: "45 min", rpe: "6", kcal: "~355",
          exercises: [
            ...WARMUP_A,
            { name: "Agachamento livre (pausa 1s no fundo)", detail: "4×12" },
            { name: "Flexão inclinada (sofá)", detail: "4×10" },
            { name: "Remada com elástico", detail: "4×12" },
            { name: "Ponte de glúteo", detail: "4×15" },
            { name: "Prancha", detail: "4×40 s" },
            { name: "Elevação de ponta de pé", detail: "3×15" },
            { name: "Caminhada na esteira", detail: "10 min" },
          ],
        },
      },
      { dayOfWeek: 2, workout: REST },
      {
        dayOfWeek: 3,
        workout: {
          type: "corrida", label: "Corrida Aeróbica", duration: "45 min", rpe: "5", kcal: "~475",
          exercises: [
            { name: "Mobilidade", detail: "2 min" },
            { name: "Corrida contínua", detail: "45 min — RPE 5" },
          ],
        },
      },
      { dayOfWeek: 4, workout: REST },
      {
        dayOfWeek: 5,
        workout: {
          type: "forca-b", label: "Força B", duration: "50 min", rpe: "6", kcal: "~365",
          exercises: [
            ...WARMUP_B,
            { name: "Afundo reverso", detail: "4×10 cada perna" },
            { name: "Desenvolvimento com elástico", detail: "4×12" },
            { name: "Terra romeno com elástico", detail: "4×12" },
            { name: "Remada baixa com elástico", detail: "4×12" },
            { name: "Prancha lateral", detail: "4×25 s cada lado" },
            { name: "Panturrilha em pé", detail: "3×15" },
            { name: "Bike leve", detail: "20–25 min" },
          ],
        },
      },
      {
        dayOfWeek: 6,
        workout: {
          type: "cardio", label: "Progressivo 6–7 km", duration: "50 min", rpe: "5–7", kcal: "~545",
          exercises: [
            { name: "2 km leve", detail: "RPE 4–5" },
            { name: "3 km confortável", detail: "RPE 5–6" },
            { name: "1–2 km firme", detail: "RPE 6–7" },
            { name: "Caminhada desaquecimento", detail: "5 min" },
          ],
        },
      },
      { dayOfWeek: 0, workout: REST },
    ],
  },
  // ── SEMANAS 7–8 ──────────────────────────────────────────
  {
    week: 7,
    title: "Semana 7 — Pico",
    days: [
      {
        dayOfWeek: 1,
        workout: {
          type: "forca-a", label: "Força A", duration: "45 min", rpe: "6–7", kcal: "~360",
          exercises: [
            ...WARMUP_A,
            { name: "Agachamento livre (pausa 1s no fundo)", detail: "4×12" },
            { name: "Flexão inclinada (sofá)", detail: "4×10" },
            { name: "Remada com elástico", detail: "4×12" },
            { name: "Ponte de glúteo", detail: "4×15" },
            { name: "Prancha", detail: "4×40 s" },
            { name: "Elevação de ponta de pé", detail: "3×15" },
            { name: "Caminhada na esteira", detail: "10 min" },
          ],
        },
      },
      { dayOfWeek: 2, workout: REST },
      {
        dayOfWeek: 3,
        workout: {
          type: "corrida", label: "Corrida Principal", duration: "50 min", rpe: "5–6", kcal: "~520",
          exercises: [
            { name: "Mobilidade", detail: "2 min" },
            { name: "Corrida contínua", detail: "35 min — RPE 5" },
            { name: "Ritmo mais firme", detail: "15 min — RPE 6" },
          ],
          notes: "Últimos 15 min mais firmes. Maior desafio de corrida até agora.",
        },
      },
      { dayOfWeek: 4, workout: REST },
      {
        dayOfWeek: 5,
        workout: {
          type: "forca-b", label: "Força B", duration: "50 min", rpe: "6–7", kcal: "~370",
          exercises: [
            ...WARMUP_B,
            { name: "Afundo reverso", detail: "4×10 cada perna" },
            { name: "Desenvolvimento com elástico", detail: "4×12" },
            { name: "Terra romeno com elástico", detail: "4×12" },
            { name: "Remada baixa com elástico", detail: "4×12" },
            { name: "Prancha lateral", detail: "4×25 s cada lado" },
            { name: "Panturrilha em pé", detail: "3×15" },
            { name: "Bike leve", detail: "20–25 min" },
          ],
        },
      },
      {
        dayOfWeek: 6,
        workout: {
          type: "cardio", label: "Simulado Leve 8 km", duration: "55 min", rpe: "5–7", kcal: "~580",
          exercises: [
            { name: "2 km leve", detail: "RPE 4–5" },
            { name: "4 km confortável/firme", detail: "RPE 5–6" },
            { name: "2 km firme controlado", detail: "RPE 6–7" },
          ],
          notes: "Objetivo: terminar sentindo que sobraria energia para mais 1 km.",
        },
      },
      { dayOfWeek: 0, workout: REST },
    ],
  },
  {
    week: 8,
    title: "Semana 8 — Chegada",
    days: [
      {
        dayOfWeek: 1,
        workout: {
          type: "forca-a", label: "Força A", duration: "45 min", rpe: "6–7", kcal: "~365",
          exercises: [
            ...WARMUP_A,
            { name: "Agachamento livre (pausa 1s no fundo)", detail: "4×12" },
            { name: "Flexão inclinada (sofá)", detail: "4×10" },
            { name: "Remada com elástico", detail: "4×12" },
            { name: "Ponte de glúteo", detail: "4×15" },
            { name: "Prancha", detail: "4×40 s" },
            { name: "Elevação de ponta de pé", detail: "3×15" },
            { name: "Caminhada na esteira", detail: "10 min" },
          ],
        },
      },
      { dayOfWeek: 2, workout: REST },
      {
        dayOfWeek: 3,
        workout: {
          type: "corrida", label: "Corrida Principal", duration: "50 min", rpe: "5–6", kcal: "~525",
          exercises: [
            { name: "Mobilidade", detail: "2 min" },
            { name: "Corrida contínua", detail: "35 min — RPE 5" },
            { name: "Ritmo mais firme", detail: "15 min — RPE 6" },
          ],
        },
      },
      { dayOfWeek: 4, workout: REST },
      {
        dayOfWeek: 5,
        workout: {
          type: "forca-b", label: "Força B", duration: "50 min", rpe: "6–7", kcal: "~375",
          exercises: [
            ...WARMUP_B,
            { name: "Afundo reverso", detail: "4×10 cada perna" },
            { name: "Desenvolvimento com elástico", detail: "4×12" },
            { name: "Terra romeno com elástico", detail: "4×12" },
            { name: "Remada baixa com elástico", detail: "4×12" },
            { name: "Prancha lateral", detail: "4×25 s cada lado" },
            { name: "Panturrilha em pé", detail: "3×15" },
            { name: "Bike leve", detail: "20–25 min" },
          ],
        },
      },
      {
        dayOfWeek: 6,
        workout: {
          type: "cardio", label: "Simulado Final 8 km", duration: "55 min", rpe: "5–7", kcal: "~585",
          exercises: [
            { name: "2 km leve", detail: "RPE 4–5" },
            { name: "4 km confortável/firme", detail: "RPE 5–6" },
            { name: "2 km firme controlado", detail: "RPE 6–7" },
          ],
          notes: "🏁 Simulado final. Você chegou até aqui. Agora é só executar.",
        },
      },
      { dayOfWeek: 0, workout: REST },
    ],
  },
];

// Helpers
export function getTodayWorkout(startDate: Date): { workout: Workout; week: number; dayInCycle: number } {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);

  const diffMs = today.getTime() - start.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const todayDow = today.getDay();

  // Semana 0: antes do início oficial (diffDays < 0)
  if (diffDays < 0) {
    const dayPlan = PRE_WEEK.days.find((d) => d.dayOfWeek === todayDow);
    return {
      workout: dayPlan?.workout ?? REST,
      week: 0,
      dayInCycle: 0,
    };
  }

  const clampedDays = Math.max(0, Math.min(diffDays, 55));
  const dayInCycle = clampedDays + 1;
  const weekIndex = Math.min(Math.floor(clampedDays / 7), 7);
  const weekPlan = PLAN[weekIndex] ?? PLAN[0];
  const dayPlan = weekPlan.days.find((d) => d.dayOfWeek === todayDow);
  return {
    workout: dayPlan?.workout ?? REST,
    week: weekIndex + 1,
    dayInCycle,
  };
}

export function getWeekDays(startDate: Date, week: number): { date: Date; workout: Workout; isToday: boolean; isPast: boolean }[] {
  const weekPlan = PLAN[Math.min(week - 1, 7)] ?? PLAN[0];
  const weekStartOffset = (week - 1) * 7;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Build Mon–Sun for the given week
  const result = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + weekStartOffset + i);
    date.setHours(0, 0, 0, 0);
    const dow = date.getDay(); // 0=Sun…6=Sat
    const dayPlan = weekPlan.days.find((d) => d.dayOfWeek === dow);
    result.push({
      date,
      workout: dayPlan?.workout ?? REST,
      isToday: date.getTime() === today.getTime(),
      isPast: date.getTime() < today.getTime(),
    });
  }
  return result;
}

export const WORKOUT_COLORS: Record<WorkoutType, { bg: string; text: string; border: string }> = {
  "forca-a":  { bg: "bg-blue-900/40",   text: "text-blue-300",   border: "border-blue-700" },
  "corrida":  { bg: "bg-emerald-900/40", text: "text-emerald-300", border: "border-emerald-700" },
  "forca-b":  { bg: "bg-violet-900/40",  text: "text-violet-300",  border: "border-violet-700" },
  "cardio":   { bg: "bg-amber-900/40",   text: "text-amber-300",   border: "border-amber-700" },
  "descanso": { bg: "bg-slate-800/40",   text: "text-slate-400",   border: "border-slate-700" },
};

export const WORKOUT_ICONS: Record<WorkoutType, string> = {
  "forca-a":  "💪",
  "corrida":  "🏃",
  "forca-b":  "🦵",
  "cardio":   "🚴",
  "descanso": "😴",
};
