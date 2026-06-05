"use client";
//ExportPDF.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, FileText, CheckCircle, Loader2 } from "lucide-react";
import type { BudgetConfig } from "./Budgetsetup";
import { useLanguage } from "@/context/LanguageContext";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Mouvement {
  id: string;
  nom: string;
  montant: number;
  type: "ajout" | "depense";
  categorie: string;
  created_at: string;
}

interface Stats {
  total: number;
  depenses: number;
  ajouts: number;
  restant: number;
  pct: number;
}

interface Props {
  config: BudgetConfig;
  mouvements: Mouvement[];
  stats: Stats;
  userName?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(dateStr: string, locale: string): string {
  return new Date(dateStr).toLocaleDateString(locale, {
    day: "2-digit", month: "long", year: "numeric",
  });
}

function formatDateTime(dateStr: string, locale: string): string {
  return new Date(dateStr).toLocaleDateString(locale, {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function isExpired(dateFin: string): boolean {
  return new Date(dateFin).getTime() < Date.now();
}

function daysRemaining(dateFin: string): number {
  return Math.ceil((new Date(dateFin).getTime() - Date.now()) / 86400000);
}

// ─── PDF Generator (inchangé) ─────────────────────────────────────────────────
async function generatePDF(
  config: BudgetConfig,
  mouvements: Mouvement[],
  stats: Stats,
  userName: string,
  t: any
) {
  const tx     = t?.exportPDF;
  const locale: string = t?.meta?.locale ?? "fr-FR";

  const { default: jsPDF }     = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W   = doc.internal.pageSize.getWidth();

  const expired   = isExpired(config.dateFin);
  const remaining = daysRemaining(config.dateFin);

  const WHITE      = [255, 255, 255] as [number, number, number];
  const OFF_WHITE  = [248, 249, 250] as [number, number, number];
  const LIGHT_GRAY = [241, 243, 245] as [number, number, number];
  const MID_GRAY   = [173, 181, 189] as [number, number, number];
  const DARK_GRAY  = [73,  80,  87]  as [number, number, number];
  const NEAR_BLACK = [33,  37,  41]  as [number, number, number];
  const ACCENT     = [37,  99,  235] as [number, number, number];
  const GREEN      = [34,  139, 102] as [number, number, number];
  const RED_SOFT   = [185, 28,  28]  as [number, number, number];
  const GOLD       = [146, 109, 49]  as [number, number, number];

  doc.setFillColor(...OFF_WHITE);
  doc.rect(0, 0, W, 46, "F");
  doc.setFillColor(...ACCENT);
  doc.rect(0, 0, W, 2, "F");
  doc.setDrawColor(...LIGHT_GRAY);
  doc.setLineWidth(0.4);
  doc.line(14, 46, W - 14, 46);
  doc.setTextColor(...ACCENT);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("VIE+", 14, 14);
  doc.setTextColor(...NEAR_BLACK);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text(tx?.title ?? "RELEVE DE BUDGET", 14, 28);
  doc.setTextColor(...MID_GRAY);
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.text(
    `${tx?.generatedAt ?? "Genere le"} ${formatDateTime(new Date().toISOString(), locale)}`,
    14, 36
  );
  if (userName) {
    doc.text(`${tx?.user ?? "Utilisateur"} : ${userName}`, 14, 42);
  }

  const badgeLabel = expired ? (tx?.badgeDone ?? "CYCLE TERMINE") : (tx?.badgeOngoing ?? "EN COURS");
  const badgeColor = expired ? GREEN : ACCENT;
  const badgeW     = 38;
  const badgeX     = W - 14 - badgeW;
  doc.setFillColor(...badgeColor);
  doc.roundedRect(badgeX, 14, badgeW, 9, 1.5, 1.5, "F");
  doc.setTextColor(...WHITE);
  doc.setFontSize(6.5);
  doc.setFont("helvetica", "bold");
  const labelW = doc.getTextWidth(badgeLabel);
  doc.text(badgeLabel, badgeX + (badgeW - labelW) / 2, 19.5);

  let y = 56;

  doc.setTextColor(...MID_GRAY);
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.text((tx?.cycleInfo ?? "INFORMATIONS DU CYCLE").toUpperCase(), 14, y);
  doc.setDrawColor(...LIGHT_GRAY);
  doc.setLineWidth(0.3);
  doc.line(14, y + 2, W - 14, y + 2);

  y += 8;

  const colA    = 14;
  const colB    = W / 2 + 4;
  const infoRowH = 11;

  const cycleInfos = [
    [tx?.cycleStart ?? "Debut du cycle", formatDate(config.dateDebut, locale)],
    [tx?.cycleEnd   ?? "Fin du cycle",   formatDate(config.dateFin,   locale)],
    [tx?.period     ?? "Periode",        `${config.periodeDuree} ${config.periodeType}`],
    [tx?.status     ?? "Statut",         expired
      ? (tx?.expired ?? "Termine")
      : `${remaining} ${tx?.remaining ?? "jour(s) restant(s)"}`
    ],
  ];

  cycleInfos.forEach(([label, value], i) => {
    const x    = i % 2 === 0 ? colA : colB;
    const rowY = y + Math.floor(i / 2) * infoRowH;
    doc.setTextColor(...MID_GRAY);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text(label, x, rowY);
    doc.setTextColor(...NEAR_BLACK);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text(value, x, rowY + 5);
  });

  y += 28;

  doc.setTextColor(...MID_GRAY);
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.text((tx?.summary ?? "RESUME FINANCIER").toUpperCase(), 14, y);
  doc.setDrawColor(...LIGHT_GRAY);
  doc.line(14, y + 2, W - 14, y + 2);

  y += 8;

  const cardW = (W - 28 - 9) / 4;
  const cards = [
    { label: tx?.budgetFixed ?? "Budget fixe",  value: `${config.montant.toLocaleString()} Ar`,  accent: NEAR_BLACK },
    { label: tx?.added       ?? "Ajoute",        value: `+${stats.ajouts.toLocaleString()} Ar`,   accent: GREEN      },
    { label: tx?.spent       ?? "Depense",       value: `-${stats.depenses.toLocaleString()} Ar`, accent: RED_SOFT   },
    { label: tx?.balance     ?? "Solde restant", value: `${stats.restant.toLocaleString()} Ar`,   accent: ACCENT     },
  ];

  cards.forEach((card, i) => {
    const cx = 14 + i * (cardW + 3);
    doc.setFillColor(...LIGHT_GRAY);
    doc.roundedRect(cx, y, cardW, 20, 1.5, 1.5, "F");
    doc.setFillColor(...card.accent);
    doc.roundedRect(cx, y, cardW, 1.8, 0.5, 0.5, "F");
    doc.setTextColor(...DARK_GRAY);
    doc.setFontSize(6.5);
    doc.setFont("helvetica", "normal");
    doc.text(card.label.toUpperCase(), cx + 4, y + 8);
    doc.setTextColor(...card.accent);
    doc.setFontSize(9.5);
    doc.setFont("helvetica", "bold");
    doc.text(card.value, cx + 4, y + 15);
  });

  y += 26;
  doc.setFillColor(...LIGHT_GRAY);
  doc.roundedRect(14, y, W - 28, 7, 1, 1, "F");
  const barColor = stats.pct < 20 ? RED_SOFT : stats.pct < 50 ? GOLD : ACCENT;
  const barW2    = (W - 28 - 2) * Math.max(0, Math.min(stats.pct / 100, 1));
  doc.setFillColor(...barColor);
  doc.roundedRect(15, y + 1, Math.max(barW2, 2), 5, 0.8, 0.8, "F");
  const pctLabel = `${Math.round(stats.pct)}% ${tx?.pctRemaining ?? "du budget restant"}`;
  doc.setTextColor(...DARK_GRAY);
  doc.setFontSize(6.5);
  doc.setFont("helvetica", "normal");
  doc.text(pctLabel, W - 14 - doc.getTextWidth(pctLabel), y + 5);

  y += 14;

  doc.setTextColor(...MID_GRAY);
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.text((tx?.history ?? "HISTORIQUE DES OPERATIONS").toUpperCase(), 14, y);
  const opLabel = `${mouvements.length} ${tx?.operations ?? "operation(s)"}`;
  doc.text(opLabel, W - 14 - doc.getTextWidth(opLabel), y);
  doc.setDrawColor(...LIGHT_GRAY);
  doc.line(14, y + 2, W - 14, y + 2);

  y += 5;

  const sorted = [...mouvements].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  autoTable(doc, {
    startY: y,
    margin: { left: 14, right: 14 },
    head: [[
      tx?.colDate   ?? "Date & Heure",
      tx?.colName   ?? "Operation",
      tx?.colCat    ?? "Categorie",
      tx?.colType   ?? "Type",
      tx?.colAmount ?? "Montant",
    ]],
    body: sorted.map((m) => [
      formatDateTime(m.created_at, locale),
      m.nom,
      m.categorie.charAt(0).toUpperCase() + m.categorie.slice(1),
      m.type === "depense" ? (tx?.typeExpense ?? "Depense") : (tx?.typeIncome ?? "Ajout"),
      `${m.type === "depense" ? "-" : "+"}${m.montant.toLocaleString()} Ar`,
    ]),
    styles: {
      font:        "helvetica",
      fontSize:    8,
      cellPadding: { top: 4, bottom: 4, left: 5, right: 5 },
      textColor:   NEAR_BLACK,
      fillColor:   WHITE,
      lineColor:   LIGHT_GRAY,
      lineWidth:   0.2,
    },
    headStyles: {
      fontSize:  7,
      fontStyle: "bold",
      textColor: DARK_GRAY,
      fillColor: OFF_WHITE,
      lineColor: LIGHT_GRAY,
      lineWidth: { bottom: 0.6 },
    },
    alternateRowStyles: { fillColor: OFF_WHITE },
    columnStyles: {
      0: { cellWidth: 36 },
      1: { cellWidth: "auto" },
      2: { cellWidth: 26 },
      3: { cellWidth: 22 },
      4: { cellWidth: 30, halign: "right", fontStyle: "bold" },
    },
    didParseCell: (data) => {
      if (data.section !== "body") return;
      const row = sorted[data.row.index];
      if (!row) return;
      if (data.column.index === 3 || data.column.index === 4) {
        data.cell.styles.textColor = row.type === "depense" ? RED_SOFT : GREEN;
      }
    },
  });

  const pageCount = (doc.internal as any).getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    const pageH = doc.internal.pageSize.getHeight();
    doc.setDrawColor(...LIGHT_GRAY);
    doc.setLineWidth(0.3);
    doc.line(14, pageH - 12, W - 14, pageH - 12);
    doc.setTextColor(...MID_GRAY);
    doc.setFontSize(6.5);
    doc.setFont("helvetica", "normal");
    doc.text(tx?.footer ?? "VIE+ — Document genere automatiquement", 14, pageH - 6);
    const pageStr = `${i} / ${pageCount}`;
    doc.text(pageStr, W - 14 - doc.getTextWidth(pageStr), pageH - 6);
  }

  doc.save(`vieplus-releve-${new Date().toISOString().split("T")[0]}.pdf`);
}

// ─── Composant bouton — Restyled ──────────────────────────────────────────────
export default function ExportPDF({ config, mouvements, stats, userName = "" }: Props) {
  const { t } = useLanguage() as any;
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const expired = isExpired(config.dateFin);

  const handleExport = async () => {
    if (status === "loading") return;
    setStatus("loading");
    try {
      await generatePDF(config, mouvements, stats, userName, t);
      setStatus("done");
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err) {
      console.error("PDF error:", err);
      setStatus("idle");
    }
  };

  const btnText =
    status === "loading" ? (t?.exportPDF?.btnLoading  ?? "Génération...")
    : status === "done"  ? (t?.exportPDF?.btnDone     ?? "Téléchargé !")
    : expired            ? (t?.exportPDF?.btnDownload ?? "Télécharger le relevé")
    :                      (t?.exportPDF?.btnExport   ?? "Exporter le relevé");

  const stateStyles = {
    idle: expired
      ? "bg-sky-500/10 hover:bg-sky-500/[0.16] border-sky-500/25 hover:border-sky-400/40 text-sky-300 hover:text-sky-200"
      : "bg-white/[0.04] hover:bg-white/[0.08] border-white/10 hover:border-white/20 text-slate-400 hover:text-slate-200",
    loading: "bg-white/[0.03] border-white/[0.06] text-slate-500 cursor-not-allowed",
    done: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
  }[status];

  const iconColor = {
    idle: expired ? "text-sky-400" : "text-slate-500",
    loading: "text-slate-600",
    done: "text-emerald-400",
  }[status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25, duration: 0.35, ease: "easeOut" }}
    >
      <button
        onClick={handleExport}
        disabled={status === "loading"}
        className={`
          group relative flex items-center gap-2 px-4 py-2 rounded-xl
          text-sm font-medium border
          transition-all duration-200 ease-out
          active:scale-[0.97]
          ${stateStyles}
        `}
      >
        {/* Icône animée */}
        <span className={`flex-shrink-0 transition-colors duration-200 ${iconColor}`}>
          <AnimatePresence mode="wait">
            {status === "loading" && (
              <motion.span
                key="load"
                initial={{ opacity: 0, rotate: -30 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 30 }}
                transition={{ duration: 0.2 }}
                className="block"
              >
                <Loader2 size={14} className="animate-spin" />
              </motion.span>
            )}
            {status === "done" && (
              <motion.span
                key="done"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="block"
              >
                <CheckCircle size={14} />
              </motion.span>
            )}
            {status === "idle" && (
              <motion.span
                key="idle"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                className="block"
              >
                {expired ? <Download size={14} /> : <FileText size={14} />}
              </motion.span>
            )}
          </AnimatePresence>
        </span>

        {/* Texte */}
        <span className="leading-none">{btnText}</span>

        {/* Badge "Final" — uniquement quand expiré + idle */}
        <AnimatePresence>
          {expired && status === "idle" && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8, x: -4 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="
                ml-0.5 px-1.5 py-0.5 rounded-md
                text-[9px] font-bold tracking-wide uppercase
                bg-sky-500/15 text-sky-300 border border-sky-500/25
              "
            >
              {t?.exportPDF?.badgeFinal ?? "Final"}
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </motion.div>
  );
}