const MobileHeader = () => {
  return (
    <>
      <header className="lg:hidden flex bg-primary px-[14px] h-[54px] items-center justify-between sticky top-0 z-[100] shadow-lg">
        <div className="flex items-center gap-2">
          <div className="w-[33px] h-[33px] bg-secondary rounded-lg flex items-center justify-center text-[17px]">⛰️</div>
          <div>
            <div className="font-serif-bn text-[14px] font-bold text-primary-foreground">খাগড়াছড়ি</div>
            <div className="text-[9px] text-accent">আমাদের শহর, আমাদের গর্ব</div>
          </div>
        </div>
        <div className="flex gap-[5px]">
          <button className="w-8 h-8 bg-primary-foreground/10 rounded-[7px] flex items-center justify-center text-primary-foreground text-[14px]">🔔</button>
          <button className="w-8 h-8 bg-primary-foreground/10 rounded-[7px] flex items-center justify-center text-primary-foreground text-[14px]">☰</button>
        </div>
      </header>
      <div className="lg:hidden bg-primary px-[14px] pb-[11px]">
        <div className="flex items-center gap-[7px] bg-primary-foreground/12 border border-primary-foreground/18 rounded-[9px] px-[11px]">
          <span className="text-primary-foreground/45 text-[13px]">🔍</span>
          <input
            type="text"
            placeholder="ব্যবসা, সেবা, ডাক্তার খুঁজুন..."
            className="flex-1 bg-transparent border-none outline-none text-primary-foreground font-sans text-[13px] py-[9px] placeholder:text-primary-foreground/42"
          />
        </div>
      </div>
    </>
  );
};

export default MobileHeader;
