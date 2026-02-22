const Footer = () => {
  return (
    <footer className="bg-[hsl(150,38%,10%)] text-primary-foreground/70">
      {/* Desktop */}
      <div className="hidden lg:block">
        <div className="max-w-[1280px] mx-auto px-10 pt-[60px]">
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-[50px]">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-secondary to-accent rounded-xl flex items-center justify-center text-xl">🏔️</div>
                <div>
                  <h3 className="font-bangla text-xl text-primary-foreground">খাগড়াছড়ি</h3>
                  <span className="text-[11px] text-bamboo-light">আমাদের শহর, আমাদের গর্ব</span>
                </div>
              </div>
              <p className="text-[13px] leading-relaxed text-primary-foreground/55 max-w-[300px]">
                খাগড়াছড়ির বাসিন্দা ও পর্যটকদের জন্য বাংলাদেশের প্রথম পার্বত্য কমিউনিটি প্ল্যাটফর্ম।
              </p>
            </div>
            <div>
              <h4 className="text-[13px] font-bold text-bamboo-light tracking-wider uppercase mb-4">পর্যটন</h4>
              <ul className="space-y-2.5">
                {["আলুটিলা গুহা", "রিচ্ছং ঝরনা", "সাজেক ভ্যালি", "শান্তিপুর অরণ্য কুটির"].map((s) => (
                  <li key={s}><a href="#" className="text-[13px] text-primary-foreground/55 hover:text-primary-foreground transition-colors">{s}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[13px] font-bold text-bamboo-light tracking-wider uppercase mb-4">সেবা</h4>
              <ul className="space-y-2.5">
                {["ওষুধ ডেলিভারি", "মুদিখানা বাজার", "ব্যবসা ডিরেক্টরি", "জরুরি সেবা"].map((s) => (
                  <li key={s}><a href="#" className="text-[13px] text-primary-foreground/55 hover:text-primary-foreground transition-colors">{s}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[13px] font-bold text-bamboo-light tracking-wider uppercase mb-4">যোগাযোগ</h4>
              <ul className="space-y-2.5">
                {["হোটেল ও রিসোর্ট", "পরিবহন তথ্য", "জরুরি নম্বর", "সরকারি হেল্পলাইন"].map((s) => (
                  <li key={s}><a href="#" className="text-[13px] text-primary-foreground/55 hover:text-primary-foreground transition-colors">{s}</a></li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-[50px] border-t border-primary-foreground/[0.08] py-5 flex justify-between items-center text-xs text-primary-foreground/35">
            <span>© ২০২৬ খাগড়াছড়ি কমিউনিটি। সর্বস্বত্ব সংরক্ষিত।</span>
            <span>তৈরি করেছে 💚 খাগড়াছড়ির মানুষ</span>
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="lg:hidden px-4 py-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-8 h-8 bg-gradient-to-br from-secondary to-accent rounded-lg flex items-center justify-center text-base">🏔️</div>
          <span className="font-bangla text-lg text-primary-foreground">খাগড়াছড়ি</span>
        </div>
        <p className="text-[12px] text-primary-foreground/45 mb-4">আমাদের শহর, আমাদের গর্ব</p>
        <div className="text-[11px] text-primary-foreground/30">© ২০২৬ খাগড়াছড়ি কমিউনিটি</div>
      </div>

      <div className="cht-pattern" />
    </footer>
  );
};

export default Footer;
