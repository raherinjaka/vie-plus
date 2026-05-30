"use client";

import { useBoard } from "@/hooks/useBoard";
import { useBoardStore } from "@/store/boardStore";
import BoardHeader from "./BoardHeader";
import BoardEmptyState from "./BoardEmptyState";
import BoardSkeleton from "./BoardSkeleton";
import ColumnList from "../column/ColumnList";
import TaskModal from "../modal/TaskModal";
import { useLanguage } from "@/context/LanguageContext";

export default function BoardShell() {
  const { board, isLoading, hasBoard, error } = useBoard();
  const { modal, closeModal } = useBoardStore();
  const { t } = useLanguage() as any;

  if (isLoading) return <BoardSkeleton />;

  if (error) {
    return (
      <div className="flex flex-col h-screen overflow-hidden">
        <div className="text-center space-y-3">
          <p className="text-red-400 font-medium">
            {t?.board?.shell?.errorTitle}
          </p>
          <p className="text-zinc-500 text-sm">{(error as Error).message}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 
                       text-sm rounded-lg transition-colors"
          >
            {t?.board?.shell?.retry}
          </button>
        </div>
      </div>
    );
  }

  if (!hasBoard || !board) return <BoardEmptyState />;

  return (
    <div className="flex flex-col h-screen bg-sky-600 dark:bg-slate-900 overflow-hidden transition-colors duration-300">
      <BoardHeader board={board} />
      <main className="flex-1 overflow-hidden">
        <ColumnList columns={board.columns} boardId={board.id} />
      </main>
      {modal.isOpen && modal.cardId && (
        <TaskModal cardId={modal.cardId} onClose={closeModal} />
      )}
    </div>
  );
}