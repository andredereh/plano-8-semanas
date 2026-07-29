// ============================================================
// WEIGHT MODAL — Modal para registrar peso
// ============================================================
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Scale } from "lucide-react";
import { saveWeightEntry } from "@/lib/storage";

interface WeightModalProps {
  open: boolean;
  onClose: () => void;
}

export default function WeightModal({ open, onClose }: WeightModalProps) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  function handleSave() {
    const num = parseFloat(value.replace(",", "."));
    if (isNaN(num) || num < 50 || num > 200) {
      setError("Digite um peso válido entre 50 e 200 kg");
      return;
    }
    saveWeightEntry(num);
    setValue("");
    setError("");
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
                  <Scale className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-black text-white">Registrar Peso</h3>
                  <p className="text-xs text-slate-400">Hoje de manhã, em jejum</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-800 transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="relative mb-4">
              <input
                type="number"
                step="0.1"
                placeholder="Ex: 116.4"
                value={value}
                onChange={(e) => { setValue(e.target.value); setError(""); }}
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
                autoFocus
                className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-4 text-2xl font-black text-white text-center focus:outline-none focus:border-blue-500 transition-colors"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">kg</span>
            </div>

            {error && <p className="text-red-400 text-sm text-center mb-3">{error}</p>}

            <button
              onClick={handleSave}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-colors active:scale-95 text-base"
            >
              Salvar
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

