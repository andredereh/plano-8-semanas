// ============================================================
// START DATE MODAL — Configurar data de início do plano
// ============================================================
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CalendarDays, Info } from "lucide-react";
import { getStartDate, setStartDate } from "@/lib/storage";

interface StartDateModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (date: Date) => void;
}

function toInputValue(date: Date): string {
  return date.toISOString().split("T")[0];
}

export default function StartDateModal({ open, onClose, onSave }: StartDateModalProps) {
  const [value, setValue] = useState<string>(() => toInputValue(getStartDate()));
  const [error, setError] = useState("");

  function handleSave() {
    const date = new Date(value + "T12:00:00");
    if (isNaN(date.getTime())) {
      setError("Data inválida.");
      return;
    }
    setStartDate(date);
    onSave(date);
    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-slate-900 rounded-t-3xl border-t border-white/10 p-6 z-50"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                  <CalendarDays className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-black text-white">Data de Início</h3>
                  <p className="text-xs text-slate-400">Quando começa o Dia 1 do plano?</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-800 transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <input
              type="date"
              value={value}
              onChange={(e) => { setValue(e.target.value); setError(""); }}
              className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-4 text-white text-center text-lg font-bold focus:outline-none focus:border-blue-500 transition-colors mb-4"
              style={{ colorScheme: "dark" }}
            />

            {/* Info box */}
            <div className="flex gap-2 bg-blue-950/50 border border-blue-800/50 rounded-xl p-3 mb-4">
              <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-300 leading-relaxed">
                O dashboard vai calcular automaticamente em qual semana e dia do ciclo você está, e mostrar o treino correto para cada dia.
              </p>
            </div>

            {error && <p className="text-red-400 text-sm text-center mb-3">{error}</p>}

            <button
              onClick={handleSave}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-colors active:scale-95 text-base"
            >
              Confirmar Início
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

