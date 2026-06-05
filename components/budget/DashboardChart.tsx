"use client";
//DashboardChart.tsx

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, ComposedChart,
} from "recharts";
import { TrendingUp, TrendingDown, BarChart3, Activity } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useCurrency } from "@/context/CurrencyContext";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Mouvement {
  id: string;
  nom: string;
  montant: number;
  type: "ajout" | "depense";
  created_at: string;
}

interface Props {
  mouvements: Mouvement[];
  budgetTotal: number;
  dateDebut: string;
  dateFin: string;
}

type ViewMode = "evolution" | "daily";

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label, budgetTotal, t }: any) {
  if (!active || !payload?.length) return null;
  const { format } = useCurrency();
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      className="rounded-2xl border border-white/[0.09] bg-slate-950/97
        backdrop-blur-2xl shadow-2xl p-4 min-w-[160px]"
      style={{ boxShadow: "0 20px 40px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06)" }}
    >
      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-600 mb-3">
        {label}
      </p>
      {payload.map((entry: any, i: number) => (
        <div key={i} className="flex items-center justify-between gap-6 mb-1.5">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: entry.color }} />
            <span className="text-[11px] text-slate-400 font-medium">{entry.name}</span>
          </div>
          <span className="text-[12px] font-black font-mono" style={{ color: entry.color }}>
            {format(Number(entry.value))}
          </span>
        </div>
      ))}
      {budgetTotal > 0 && (
        <div className="mt-2 pt-2 border-t border-white/[0.06]">
          <div className="flex items-center justify-between gap-4">
            <span className="text-[10px] text-slate-600">
              {t?.dashboardChart?.budgetTotal ?? "Budget total"}
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              {budgetTotal.toLocaleString()} Ar
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyChart({ t }: { t: any }) {
  return (
    <div className="flex flex-col items-center justify-center h-48 gap-3">
      <div className="w-12 h-12 rounded-3xl bg-white/[0.02] border border-white/[0.06]
        flex items-center justify-center">
        <BarChart3 size={22} className="text-slate-700" />
      </div>
      <p className="text-slate-600 text-xs font-bold text-center">
        {t?.dashboardChart?.emptyTitle ?? "Aucune donnée à afficher"}
        <br />
        <span className="font-normal text-slate-700">
          {t?.dashboardChart?.emptySub ?? "Commence à enregistrer des opérations"}
        </span>
      </p>
    </div>
  );
}

// ─── DashboardChart ───────────────────────────────────────────────────────────
export default function DashboardChart({ mouvements, budgetTotal, dateDebut, dateFin }: Props) {
  const { t } = useLanguage() as any;
  const { format } = useCurrency();
  const [viewMode, setViewMode] = useState<ViewMode>("evolution");

  // ── Génère tous les jours du cycle ──────────────────────────────────────────
  const chartData = useMemo(() => {
    const start = new Date(dateDebut);
    const end   = new Date(dateFin);
    const today = new Date();
    const limit = today < end ? today : end;

    const byDay = new Map<string, { depenses: number; ajouts: number }>();
    mouvements.forEach((m) => {
      const d = new Date(m.created_at).toISOString().split("T")[0];
      if (!byDay.has(d)) byDay.set(d, { depenses: 0, ajouts: 0 });
      const entry = byDay.get(d)!;
      if (m.type === "depense") entry.depenses += m.montant;
      else                      entry.ajouts   += m.montant;
    });

    const locale: string = t?.meta?.locale ?? "fr-FR";
    const days: {
      date: string; label: string;
      depensesJour: number; ajoursJour: number;
      depensesCum: number; solde: number;
    }[] = [];

    let cumDepenses = 0;
    let cumAjouts   = 0;
    const cur = new Date(start);

    days.push({
      date:         new Date(start).toISOString().split("T")[0],
      label:        new Date(start).toLocaleDateString(locale, { day: "2-digit", month: "short" }) + " (départ)",
      depensesJour: 0,
      ajoursJour:   0,
      depensesCum:  0,
      solde:        budgetTotal,
    });

    while (cur <= limit) {
      const key = cur.toISOString().split("T")[0];
      const d   = byDay.get(key) ?? { depenses: 0, ajouts: 0 };
      cumDepenses += d.depenses;
      cumAjouts   += d.ajouts;
      const total = budgetTotal + cumAjouts;
      const solde = Math.max(0, total - cumDepenses);
      days.push({
        date:         key,
        label:        cur.toLocaleDateString(locale, { day: "2-digit", month: "short" }),
        depensesJour: d.depenses,
        ajoursJour:   d.ajouts,
        depensesCum:  cumDepenses,
        solde,
      });
      cur.setDate(cur.getDate() + 1);
    }
    return days;
  }, [mouvements, budgetTotal, dateDebut, dateFin, t]);

  // ── Mini KPIs ────────────────────────────────────────────────────────────────
  const totalDepenses = mouvements
    .filter((m) => m.type === "depense")
    .reduce((s, m) => s + m.montant, 0);

  const avgParJour = chartData.length > 0
    ? Math.round(totalDepenses / chartData.length)
    : 0;

  const pire = chartData.reduce(
    (max, d) => d.depensesJour > max.depensesJour ? d : max,
    { label: "—", depensesJour: 0 }
  );

  const danger = chartData.length > 0 &&
    chartData[chartData.length - 1].depensesCum > budgetTotal * 0.8;

  const strokeColor = danger ? "#f87171" : "#22d3ee";

  const tickFormatter = (label: string, index: number) => {
    if (chartData.length <= 7)  return label;
    if (chartData.length <= 14) return index % 2 === 0 ? label : "";
    return index % Math.ceil(chartData.length / 7) === 0 ? label : "";
  };

  // ── Label jours de données ───────────────────────────────────────────────────
  const n = chartData.length;
  const dataLabel = (t?.dashboardChart?.dataLabel ?? "{n} jour{s} de données")
    .replace("{n}", String(n))
    .replace("{s}", n > 1 ? "s" : "");

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.28, duration: 0.4 }}
      className="rounded-3xl border border-white/[0.07] bg-white/[0.02] p-6 mb-4"
    >
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-px h-5 bg-cyan-400 rounded-full" />
          <div>
            <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-500">
              {t?.dashboardChart?.title ?? "Évolution du budget"}
            </h3>
            <p className="text-[9px] text-slate-700 font-mono mt-0.5">{dataLabel}</p>
          </div>
        </div>

        {/* Mode switcher */}
        <div className="flex gap-1.5 p-1 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
          <button
            onClick={() => setViewMode("evolution")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-black
              uppercase tracking-wider transition-all duration-200
              ${viewMode === "evolution"
                ? "bg-cyan-500/15 border border-cyan-500/25 text-cyan-300"
                : "text-slate-600 hover:text-slate-400"
              }`}
          >
            <Activity size={11} />
            {t?.dashboardChart?.curveBtn ?? "Courbe"}
          </button>
          <button
            onClick={() => setViewMode("daily")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-black
              uppercase tracking-wider transition-all duration-200
              ${viewMode === "daily"
                ? "bg-violet-500/15 border border-violet-500/25 text-violet-300"
                : "text-slate-600 hover:text-slate-400"
              }`}
          >
            <BarChart3 size={11} />
            {t?.dashboardChart?.barsBtn ?? "Barres"}
          </button>
        </div>
      </div>

      {/* ── Mini KPIs ── */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
          <p className="text-[9px] font-black uppercase tracking-widest text-slate-600 mb-1">
            {t?.dashboardChart?.avgPerDay ?? "Moy / jour"}
          </p>
          <p className="text-sm font-black font-mono text-slate-300">
            {format(avgParJour)}
          </p>
        </div>
        <div className={`p-3 rounded-2xl border
          ${pire.depensesJour > 0 ? "bg-red-500/[0.05] border-red-500/10" : "bg-white/[0.02] border-white/[0.05]"}`}>
          <p className="text-[9px] font-black uppercase tracking-widest text-slate-600 mb-1">
            {t?.dashboardChart?.peakExpense ?? "Pic de dépense"}
          </p>
          <p className="text-sm font-black font-mono text-red-400">
            {pire.depensesJour > 0 ? format(pire.depensesJour) : "—"}
          </p>
          {pire.depensesJour > 0 && (
            <p className="text-[9px] text-slate-600 font-mono">{pire.label}</p>
          )}
        </div>
        <div className={`p-3 rounded-2xl border
          ${danger ? "bg-red-500/[0.07] border-red-500/15" : "bg-emerald-500/[0.04] border-emerald-500/10"}`}>
          <p className="text-[9px] font-black uppercase tracking-widest text-slate-600 mb-1">
            {t?.dashboardChart?.trend ?? "Tendance"}
          </p>
          <div className="flex items-center gap-1.5">
            {danger
              ? <TrendingDown size={13} className="text-red-400" />
              : <TrendingUp   size={13} className="text-emerald-400" />
            }
            <p className={`text-sm font-black ${danger ? "text-red-400" : "text-emerald-400"}`}>
              {danger
                ? (t?.dashboardChart?.danger  ?? "Attention")
                : (t?.dashboardChart?.stable  ?? "Stable")}
            </p>
          </div>
        </div>
      </div>

      {/* ── Chart ── */}
      {chartData.length === 0 ? (
        <EmptyChart t={t} />
      ) : (
        <AnimatePresence mode="wait">

          {/* ── Vue Courbe ── */}
          {viewMode === "evolution" && (
            <motion.div
              key="evolution"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.25 }}
            >
              {/* Légende en haut */}
              <div className="flex flex-wrap items-center gap-3 mb-4 px-1">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl
                  bg-cyan-500/10 border border-cyan-500/20">
                  <div className="w-4 h-[2px] rounded-full bg-gradient-to-r from-cyan-400 to-orange-400" />
                  <span className="text-[10px] font-bold text-cyan-300">
                    {t?.dashboardChart?.legendSolde ?? "Solde restant"}
                  </span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl
                  bg-red-500/10 border border-red-500/20">
                  <div className="flex gap-0.5">
                    <div className="w-1 h-[2px] rounded-full bg-red-400" />
                    <div className="w-1 h-[2px] rounded-full bg-red-400" />
                    <div className="w-1 h-[2px] rounded-full bg-red-400" />
                  </div>
                  <span className="text-[10px] font-bold text-red-400">
                    {t?.dashboardChart?.legendDep ?? "Dépenses cumulées"}
                  </span>
                </div>
                {budgetTotal > 0 && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl
                    bg-white/[0.03] border border-white/[0.08]">
                    <div className="flex gap-0.5">
                      <div className="w-1 h-[2px] rounded-full bg-slate-500" />
                      <div className="w-1 h-[2px] rounded-full bg-slate-500" />
                      <div className="w-1 h-[2px] rounded-full bg-slate-500" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500">
                      {t?.dashboardChart?.legendBudget ?? "Budget"}
                    </span>
                  </div>
                )}
              </div>

              <ResponsiveContainer width="100%" height={220}>
                <ComposedChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradSolde" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor="#22d3ee" stopOpacity={0.25} />
                      <stop offset="50%"  stopColor="#fb923c" stopOpacity={0.12} />
                      <stop offset="100%" stopColor="#f87171" stopOpacity={0}    />
                    </linearGradient>
                    <linearGradient id="gradDepenses" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor="#f87171" stopOpacity={0.08} />
                      <stop offset="100%" stopColor="#f87171" stopOpacity={0}    />
                    </linearGradient>
                    <linearGradient id="strokeSolde" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor="#22d3ee" />
                      <stop offset="60%"  stopColor="#fb923c" />
                      <stop offset="100%" stopColor="#f87171" />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="label"
                    tick={{ fill: "#475569", fontSize: 10, fontFamily: "monospace" }}
                    axisLine={false} tickLine={false} tickFormatter={tickFormatter}
                  />
                  <YAxis
                    tick={{ fill: "#475569", fontSize: 9, fontFamily: "monospace" }}
                    axisLine={false} tickLine={false}
                    tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)}
                  />
                  <Tooltip
                    content={<CustomTooltip budgetTotal={budgetTotal} t={t} />}
                    cursor={{ stroke: "rgba(255,255,255,0.06)", strokeWidth: 1 }}
                  />
                  {budgetTotal > 0 && (
                    <ReferenceLine y={budgetTotal}
                      stroke="rgba(255,255,255,0.12)" strokeDasharray="6 4"
                      label={{
                        value: t?.dashboardChart?.legendBudget ?? "Budget",
                        fill: "#475569", fontSize: 9, fontFamily: "monospace",
                        position: "insideTopRight",
                      }}
                    />
                  )}
                  <Area type="monotone" dataKey="depensesCum"
                    name={t?.dashboardChart?.legendDep ?? "Dépenses cumulées"}
                    stroke="#f87171" strokeWidth={1.5} strokeDasharray="4 3"
                    fill="url(#gradDepenses)" dot={false}
                    activeDot={{ r: 4, fill: "#f87171", stroke: "#0f172a", strokeWidth: 2 }}
                  />
                  <Area type="monotone" dataKey="solde"
                    name={t?.dashboardChart?.legendSolde ?? "Solde restant"}
                    stroke="url(#strokeSolde)" strokeWidth={2.5}
                    fill="url(#gradSolde)" dot={false}
                    activeDot={{ r: 5, fill: strokeColor, stroke: "#0f172a", strokeWidth: 2 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </motion.div>
          )}

          {/* ── Vue Barres ── */}
          {viewMode === "daily" && (
            <motion.div
              key="daily"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.25 }}
            >
              {/* Légende en haut */}
              <div className="flex flex-wrap items-center gap-3 mb-4 px-1">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl
                  bg-red-500/10 border border-red-500/20">
                  <div className="w-3 h-3 rounded-sm bg-red-400/70" />
                  <span className="text-[10px] font-bold text-red-400">
                    {t?.dashboardChart?.depJour ?? "Dépenses du jour"}
                  </span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl
                  bg-emerald-500/10 border border-emerald-500/20">
                  <div className="w-3 h-3 rounded-sm bg-emerald-400/70" />
                  <span className="text-[10px] font-bold text-emerald-400">
                    {t?.dashboardChart?.ajoutJour ?? "Ajouts du jour"}
                  </span>
                </div>
              </div>

              <ResponsiveContainer width="100%" height={220}>
                <ComposedChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                  <defs>
                    <linearGradient id="barGradDep" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor="#f87171" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#f87171" stopOpacity={0.4} />
                    </linearGradient>
                    <linearGradient id="barGradAjout" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor="#34d399" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#34d399" stopOpacity={0.4} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="label"
                    tick={{ fill: "#475569", fontSize: 10, fontFamily: "monospace" }}
                    axisLine={false} tickLine={false} tickFormatter={tickFormatter}
                  />
                  <YAxis
                    tick={{ fill: "#475569", fontSize: 9, fontFamily: "monospace" }}
                    axisLine={false} tickLine={false}
                    tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)}
                  />
                  <Tooltip
                    content={<CustomTooltip budgetTotal={budgetTotal} t={t} />}
                    cursor={{ fill: "rgba(255,255,255,0.02)" }}
                  />
                  <Bar dataKey="depensesJour"
                    name={t?.dashboardChart?.depJour ?? "Dépenses du jour"}
                    fill="url(#barGradDep)" radius={[4, 4, 0, 0]} maxBarSize={32}
                  />
                  <Bar dataKey="ajoursJour"
                    name={t?.dashboardChart?.ajoutJour ?? "Ajouts du jour"}
                    fill="url(#barGradAjout)" radius={[4, 4, 0, 0]} maxBarSize={32}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.div>
  );
}