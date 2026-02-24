interface Props {
  title: string;
}

const Topbar = ({ title }: Props) => {
  return (
    <div className="hidden lg:flex bg-card border-b border-border px-7 h-[58px] items-center justify-between sticky top-0 z-[100] shadow-sm">
      <div className="font-serif-bn text-lg font-bold text-primary">{title}</div>
      <div className="flex gap-[9px]">
        <span className="bg-muted text-[hsl(var(--green-mid))] text-[11px] font-semibold px-3 py-1 rounded-full">🔔 নোটিশ</span>
        <span className="bg-muted text-[hsl(var(--green-mid))] text-[11px] font-semibold px-3 py-1 rounded-full">amarkgc.com</span>
      </div>
    </div>
  );
};

export default Topbar;
