import { trpc } from "@/lib/trpc";
import { Activity, Heart, Flame, Timer, TrendingUp, RefreshCw, Zap } from "lucide-react";

export default function LastWorkoutCard() {
  const { data, isLoading, refetch, isFetching } = trpc.coros.getLastActivity.useQuery(undefined, {
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const activity = data?.activity;

  const badgeColor = (status: string) => {
    if (status === "ok") return "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";
    if (status === "warning") return "bg-amber-500/20 text-amber-400 border border-amber-500/30";
    return "bg-blue-500/20 text-blue-400 border border-blue-500/30";
  };

  return (
    <div className="rounded-2xl bg-[#1a1f2e] border border-white/8 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-semibold uppercase tracking-widest text-white/50">
            Último Treino
          </span>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="p-1.5 rounded-lg hover:bg-white/8 transition-colors disabled:opacity-50"
          title="Atualizar"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-white/40 ${isFetching ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="space-y-2">
          <div className="h-5 w-40 rounded bg-white/8 animate-pulse" />
          <div className="h-4 w-56 rounded bg-white/8 animate-pulse" />
          <div className="grid grid-cols-3 gap-2 mt-3">
            {[0,1,2].map(i => (
              <div key={i} className="h-12 rounded-xl bg-white/8 animate-pulse" />
            ))}
          </div>
        </div>
      )}

      {/* Sem atividade */}
      {!isLoading && !activity && (
        <div className="text-center py-4">
          <Activity className="w-8 h-8 text-white/20 mx-auto mb-2" />
          <p className="text-sm text-white/40">Nenhum treino nos últimos 7 dias</p>
          <p className="text-xs text-white/25 mt-1">Sincronize uma atividade no COROS</p>
        </div>
      )}

      {/* Atividade encontrada */}
      {!isLoading && activity && (
        <div className="space-y-3">
          {/* Nome + data + badge */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-base font-bold text-white leading-tight">{activity.sportName}</p>
              <p className="text-xs text-white/40 mt-0.5">
                {new Date(activity.date + "T12:00:00").toLocaleDateString("pt-BR", {
                  weekday: "long", day: "numeric", month: "short"
                })}
              </p>
            </div>
            <span className={`text-xs font-semibold px-2 py-1 rounded-lg whitespace-nowrap ${badgeColor(activity.validation.status)}`}>
              {activity.validation.badge}
            </span>
          </div>

          {/* Métricas principais */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white/5 rounded-xl p-2.5 text-center">
              <Timer className="w-3.5 h-3.5 text-blue-400 mx-auto mb-1" />
              <p className="text-sm font-bold text-white">{activity.duration}</p>
              <p className="text-[10px] text-white/40">Duração</p>
            </div>
            {activity.distance && (
              <div className="bg-white/5 rounded-xl p-2.5 text-center">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400 mx-auto mb-1" />
                <p className="text-sm font-bold text-white">{activity.distance}</p>
                <p className="text-[10px] text-white/40">Distância</p>
              </div>
            )}
            {activity.avgPace && (
              <div className="bg-white/5 rounded-xl p-2.5 text-center">
                <Zap className="w-3.5 h-3.5 text-yellow-400 mx-auto mb-1" />
                <p className="text-sm font-bold text-white">{activity.avgPace}</p>
                <p className="text-[10px] text-white/40">Pace Médio</p>
              </div>
            )}
            {activity.detail?.avgHr && (
              <div className="bg-white/5 rounded-xl p-2.5 text-center">
                <Heart className="w-3.5 h-3.5 text-rose-400 mx-auto mb-1" />
                <p className="text-sm font-bold text-white">{activity.detail.avgHr} bpm</p>
                <p className="text-[10px] text-white/40">FC Média</p>
              </div>
            )}
            {activity.detail?.calories && (
              <div className="bg-white/5 rounded-xl p-2.5 text-center">
                <Flame className="w-3.5 h-3.5 text-orange-400 mx-auto mb-1" />
                <p className="text-sm font-bold text-white">{activity.detail.calories} kcal</p>
                <p className="text-[10px] text-white/40">Calorias</p>
              </div>
            )}
          </div>

          {/* Análise automática */}
          <div className={`rounded-xl p-3 text-xs leading-relaxed ${
            activity.validation.status === "ok"
              ? "bg-emerald-500/10 text-emerald-300"
              : activity.validation.status === "warning"
              ? "bg-amber-500/10 text-amber-300"
              : "bg-blue-500/10 text-blue-300"
          }`}>
            {activity.validation.message}
          </div>
        </div>
      )}
    </div>
  );
}
