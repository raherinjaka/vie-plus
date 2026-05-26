"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useBoardStore } from "@/store/boardStore";
import { calcCardProgress } from "@/types/tache.types";
import type { CardWithRelations } from "@/types/tache.types";
import { useLanguage } from "@/context/LanguageContext";

type Props = {
  card: CardWithRelations;
  isDragging?: boolean;
};

export default function Card({ card, isDragging = false }: Props) {
  const { openModal } = useBoardStore();
  const { t } = useLanguage() as any;

  const { attributes, listeners, setNodeRef, transform, transition, isDragging: isSortableDragging } =
    useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const totalItems   = card.checklists.flatMap((c) => c.items).length;
  const checkedItems = card.checklists.flatMap((c) => c.items).filter((i) => i.checked).length;
  const progress     = calcCardProgress(card.checklists);
  const hasChecklist = totalItems > 0;
  const locale       = t?.meta?.locale ?? "fr-FR";

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => !isSortableDragging && openModal(card.id)}
      className={`
        group relative bg-[#1c1c27] border border-zinc-800/70 rounded-xl
        touch-none p-3 cursor-pointer select-none
        hover:border-violet-500/40 hover:bg-[#1f1f2e] hover:shadow-md
        hover:shadow-violet-900/20
        active:cursor-grabbing transition-all duration-150
        ${isSortableDragging || isDragging ? "opacity-40 scale-[0.98]" : ""}
      `}
    >
      {/* Étiquettes couleur */}
      {card.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {card.labels.map((label) => (
            <span
              key={label.id}
              className="h-1.5 w-10 rounded-full"
              style={{ backgroundColor: label.color }}
              title={label.name || label.color}
            />
          ))}
        </div>
      )}

      {/* Titre */}
      <p className="text-zinc-100 text-sm leading-snug font-semibold
           group-hover:text-white transition-colors">
        {card.title}
      </p>

      {/* Badges bas de carte */}
      <div className="flex items-center gap-2 mt-2 flex-wrap">

        {/* Date */}
        {card.due_date && (() => {
          const now     = new Date();
          const due     = new Date(card.due_date);
          const diffDays = Math.ceil(
            (due.getTime() - now.setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24)
          );
          const isToday   = diffDays === 0;
          const isSoon    = diffDays > 0 && diffDays <= 3;
          const isOverdue = diffDays < 0;
          return (
            <span className={`flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-md font-medium
              ${isOverdue ? "bg-red-900/50 text-red-400 border border-red-700/40"
              : isToday   ? "bg-amber-900/50 text-amber-400 border border-amber-700/40"
              : isSoon    ? "bg-orange-900/40 text-orange-400 border border-orange-700/30"
                          : "bg-zinc-800/80 text-zinc-500 border border-zinc-700/30"}`}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <polyline points="12,6 12,12 16,14" stroke="currentColor"
                          strokeWidth="2" strokeLinecap="round"/>
              </svg>
              {isOverdue ? "⚠ " : isToday ? `${t?.card?.today} ` : ""}
              {new Date(card.due_date).toLocaleDateString(locale, {
                day: "numeric", month: "short",
              })}
            </span>
          );
        })()}

        {/* Checklist */}
        {hasChecklist && (
          <span className={`flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-md
            ${progress === 100
              ? "bg-emerald-900/30 text-emerald-400"
              : "bg-zinc-800 text-zinc-500"
            }`}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
              <polyline points="9,11 12,14 22,4" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"
                stroke="currentColor" strokeWidth="2" />
            </svg>
            {checkedItems}/{totalItems}
          </span>
        )}

        {/* Description */}
        {card.description && (
          <span className="text-zinc-600">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                stroke="currentColor" strokeWidth="2" />
              <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" />
              <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" />
              <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" />
            </svg>
          </span>
        )}
      </div>

      {/* Mini progress bar */}
      {hasChecklist && progress > 0 && progress < 100 && (
        <div className="mt-2.5 h-0.5 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, background: "#7c3aed" }}
          />
        </div>
      )}
    </div>
  );
}