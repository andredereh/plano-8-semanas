// ============================================================
// DADOS DE NUTRIÇÃO — Plano alimentar do André
// Meta: 190–220g proteína/dia | ~2.200–2.400 kcal/dia
// ============================================================

export interface MealOption {
  name: string;
  protein: number; // gramas
  kcal: number;
  portion: string;
}

export interface Meal {
  id: string;
  label: string;
  time: string;
  proteinTarget: number; // g
  kcalTarget: number;
  icon: string;
  color: string;
  colorBg: string;
  colorBorder: string;
  options: MealOption[];
  tips: string;
}

export const MEALS: Meal[] = [
  {
    id: "cafe",
    label: "Café da Manhã",
    time: "06:00–08:00",
    proteinTarget: 38,
    kcalTarget: 450,
    icon: "🌅",
    color: "text-amber-300",
    colorBg: "bg-amber-900/30",
    colorBorder: "border-amber-700/50",
    tips: "Priorize proteína logo cedo — isso reduz o apetite ao longo do dia e protege a massa muscular.",
    options: [
      { name: "3 ovos mexidos + queijo branco 50g", protein: 32, kcal: 380, portion: "1 porção" },
      { name: "Iogurte grego integral (200g) + 2 ovos", protein: 36, kcal: 360, portion: "1 porção" },
      { name: "Omelete 3 ovos + presunto 50g", protein: 35, kcal: 350, portion: "1 porção" },
      { name: "Whey (1 scoop) + 2 ovos + fruta", protein: 42, kcal: 420, portion: "1 porção" },
    ],
  },
  {
    id: "almoco",
    label: "Almoço",
    time: "12:00–13:30",
    proteinTarget: 55,
    kcalTarget: 650,
    icon: "☀️",
    color: "text-blue-300",
    colorBg: "bg-blue-900/30",
    colorBorder: "border-blue-700/50",
    tips: "Maior refeição do dia. Priorize proteína magra + vegetais + carboidrato moderado.",
    options: [
      { name: "Frango grelhado 180g + arroz + salada", protein: 54, kcal: 620, portion: "1 prato" },
      { name: "Patinho moído 180g + batata-doce 150g", protein: 52, kcal: 640, portion: "1 prato" },
      { name: "Tilápia 200g + arroz integral + legumes", protein: 50, kcal: 580, portion: "1 prato" },
      { name: "Carne bovina magra 180g + feijão + salada", protein: 55, kcal: 660, portion: "1 prato" },
    ],
  },
  {
    id: "lanche",
    label: "Lanche da Tarde",
    time: "15:30–16:30",
    proteinTarget: 30,
    kcalTarget: 300,
    icon: "⚡",
    color: "text-emerald-300",
    colorBg: "bg-emerald-900/30",
    colorBorder: "border-emerald-700/50",
    tips: "Lanche estratégico antes ou depois do treino. Evite doces — aqui é onde o hábito antigo costuma atacar.",
    options: [
      { name: "Whey (1 scoop) + banana", protein: 26, kcal: 280, portion: "1 porção" },
      { name: "Iogurte grego 200g + castanhas 20g", protein: 22, kcal: 290, portion: "1 porção" },
      { name: "Queijo cottage 150g + fruta", protein: 24, kcal: 240, portion: "1 porção" },
      { name: "2 ovos cozidos + 1 fruta", protein: 14, kcal: 200, portion: "1 porção" },
    ],
  },
  {
    id: "jantar",
    label: "Jantar",
    time: "19:00–20:30",
    proteinTarget: 55,
    kcalTarget: 550,
    icon: "🌙",
    color: "text-violet-300",
    colorBg: "bg-violet-900/30",
    colorBorder: "border-violet-700/50",
    tips: "Jantar leve em carboidratos, rico em proteína. Facilita o sono e a recuperação muscular noturna.",
    options: [
      { name: "Salmão 180g + legumes no vapor", protein: 50, kcal: 480, portion: "1 porção" },
      { name: "Frango 180g + salada + azeite", protein: 54, kcal: 500, portion: "1 porção" },
      { name: "Omelete 4 ovos + vegetais", protein: 28, kcal: 380, portion: "1 porção" },
      { name: "Atum 2 latas + salada + azeite", protein: 52, kcal: 420, portion: "1 porção" },
    ],
  },
  {
    id: "ceia",
    label: "Ceia (Opcional)",
    time: "21:30–22:00",
    proteinTarget: 25,
    kcalTarget: 200,
    icon: "🌛",
    color: "text-slate-300",
    colorBg: "bg-slate-800/40",
    colorBorder: "border-slate-700/50",
    tips: "Opcional, mas poderoso: proteína de digestão lenta antes de dormir acelera a recuperação muscular.",
    options: [
      { name: "Caseína 1 scoop (ou queijo cottage 150g)", protein: 24, kcal: 180, portion: "1 porção" },
      { name: "2 ovos cozidos", protein: 14, kcal: 160, portion: "1 porção" },
      { name: "Iogurte grego 150g", protein: 16, kcal: 140, portion: "1 porção" },
    ],
  },
];

export const DAILY_TARGETS = {
  protein: 190,   // g mínimo
  proteinMax: 220, // g máximo
  kcal: 2200,
  kcalMax: 2400,
  water: 2.5,     // litros
};

export const FOODS_TO_AVOID = [
  { item: "Doces e sobremesas", why: "Pico de insulina → armazenamento de gordura" },
  { item: "Frituras e fast food", why: "Gordura trans + excesso calórico" },
  { item: "Refrigerantes e sucos industriais", why: "Açúcar líquido — não sacia, engorda" },
  { item: "Pão branco e massas refinadas", why: "Carboidrato de alto índice glicêmico" },
  { item: "Beliscos entre refeições", why: "Quebra o déficit calórico sem perceber" },
];

export const FOODS_TO_PRIORITIZE = [
  { item: "Frango, peixe, carne magra", why: "Proteína completa + baixo teor de gordura" },
  { item: "Ovos inteiros", why: "Proteína + gordura boa + vitaminas" },
  { item: "Iogurte grego e cottage", why: "Proteína + probióticos" },
  { item: "Vegetais e folhas verdes", why: "Volume sem calorias + micronutrientes" },
  { item: "Batata-doce e arroz integral", why: "Carboidrato de liberação lenta" },
];
