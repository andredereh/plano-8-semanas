// ============================================================
// WELCOME BANNER — Notificação do treino do dia
// Aparece no topo do dashboard, dispensável pelo usuário
// ============================================================
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Dumbbell, Zap } from "lucide-react";
import { Workout, WORKOUT_COLORS, WORKOUT_ICONS } from "@/lib/planData";
import { cn } from "@/lib/utils";

interface WelcomeBannerProps {
  workout: Workout;
  week: number;
  dayInCycle: number;
}

const MOTIVATIONAL: Record<string, string[]> = {
  "forca-a": [
    "Hoje é dia de construir força. Cada repetição conta.",
    "Força A no programa. Foco na técnica, não na carga.",
    "Seu corpo está pronto. Hora de trabalhar.",
  ],
  "forca-b": [
    "Força B hoje. Pernas e posterior — a base de tudo.",
    "Dia de Força B. Controle o movimento na descida.",
    "Construindo a base. Um treino de cada vez.",
  ],
  "corrida": [
    "Dia de corrida. Ritmo confortável — você consegue.",
    "Pés no chão, mente no objetivo. Vamos correr.",
    "Cada quilômetro hoje é um investimento no André de amanhã.",
  ],
  "cardio": [
    "Cardio hoje. Mantenha o RPE dentro do alvo.",
    "Dia de cardio. Consistência bate intensidade.",
    "Motor ligado. Vamos nessa.",
  ],
  "descanso": [
    "Hoje é dia de recuperação. Descanse sem culpa.",
    "Descanso é parte do treino. Aproveite.",
    "Recuperação ativa hoje. Seu corpo agradece.",
  ],
};

const DISMISSED_KEY = "p8s_banner_dismissed";

function getTodayDismissed(): boolean {
  const raw = localStorage.getItem(DISMISSED_KEY);
  if (!raw) return false;
  const { date } = JSON.parse(raw);
  return date === new Date().toISOString().split("T")[0];
}

function setTodayDismissed() {
  localStorage.setItem(DISMISSED_KEY, JSON.stringify({
    date: new Date().toISOString().split("T")[0],
  }));
}

export default function WelcomeBanner({ workout, week, dayInCycle }: WelcomeBannerProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Mostra o banner se ainda não foi dispensado hoje
    if (!getTodayDismissed()) {
      const timer = setTimeout(() => setVisible(true), 400);
      return () => clearTimeout(timer);
    }
  }, []);

  function dismiss() {
    setTodayDismissed();
    setVisible(false);
  }

  const colors = WORKOUT_COLORS[workout.type];
  const icon = WORKOUT_ICONS[workout.type];
  const messages = MOTIVATIONAL[workout.type] ?? MOTIVATIONAL["descanso"];
  // Seleciona mensagem baseada no dia do ciclo (determinístico)
  const message = messages[dayInCycle % messages.length];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -20, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -20, height: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 200 }}
          className={cn(
            "mx-4 mt-4 rounded-2xl border p-4 relative overflow-hidden",
            colors.bg, colors.border
          )}
        >
          {/* Glow de fundo */}
          <div className={cn("absolute inset-0 opacity-10 blur-2xl", colors.bg)} />

          <div className="relative flex items-start gap-3">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0",
              "bg-black/20"
            )}>
              {icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <Zap className={cn("w-3.5 h-3.5", colors.text)} />
                <p className={cn("text-xs font-bold uppercase tracking-widest", colors.text)}>
                  Semana {week} · Dia {dayInCycle}
                </p>
              </div>
              <p className="text-white font-black text-base leading-snug">
                {workout.type !== "descanso" ? (
                  <>Hoje é dia de <span className={colors.text}>{workout.label}</span></>
                ) : (
                  "Hoje é dia de descanso"
                )}
              </p>
              <p className="text-slate-300 text-sm mt-1 leading-relaxed">{message}</p>
            </div>
            <button
              onClick={dismiss}
              className="p-1.5 rounded-lg hover:bg-black/20 transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {workout.type !== "descanso" && (
            <div className="relative mt-3 pt-3 border-t border-white/10 flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <Dumbbell className={cn("w-3.5 h-3.5", colors.text)} />
                <span className="text-xs text-slate-300">{workout.duration}</span>
              </div>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-slate-300">RPE {workout.rpe}</span>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-slate-300">{workout.kcal} kcal</span>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
