interface TechBadgeProps {
    label: string;
    icon: React.ElementType;
  }
  
  export default function TechBadge({ label, icon: Icon }: TechBadgeProps) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/[0.07] bg-white/[0.03] text-slate-300 text-sm hover:border-cyan-500/25 hover:text-cyan-300 transition-all duration-200 cursor-default">
        <Icon size={14} className="text-slate-400" />
        {label}
      </div>
    );
  }