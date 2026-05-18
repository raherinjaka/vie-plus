export default function SectionLabel({ children }: { children: React.ReactNode }) {
    return (
      <div className="flex items-center gap-2 mb-3 justify-center">
        <span className="h-px w-6 bg-cyan-500/60 rounded-full" />
        <span className="text-cyan-400 text-xs font-semibold uppercase tracking-widest">
          {children}
        </span>
        <span className="h-px w-6 bg-cyan-500/60 rounded-full" />
      </div>
    );
  }