import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { label: "হোম", href: "/" },
  { label: "পর্যটন", href: "/#tourism" },
  { label: "সেবাসমূহ", href: "/#services" },
  { label: "হোটেল", href: "/#hotels" },
  { label: "ডিরেক্টরি", href: "/directory" },
  { label: "যোগাযোগ", href: "/#transport" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="bg-primary sticky top-0 z-50 shadow-lg">
      {/* Desktop */}
      <div className="hidden lg:flex max-w-[1280px] mx-auto items-center justify-between px-10 h-[68px]">
        <Link to="/" className="flex items-center gap-3.5 hover:opacity-90 transition-opacity">
          <div className="w-12 h-12 bg-gradient-to-br from-secondary to-accent rounded-[14px] flex items-center justify-center text-2xl shadow-lg">
            🏔️
          </div>
          <div>
            <h1 className="font-bangla text-[22px] text-primary-foreground leading-tight">খাগড়াছড়ি</h1>
            <span className="text-xs text-bamboo-light tracking-wide">আমাদের শহর, আমাদের গর্ব</span>
          </div>
        </Link>

        <div className="flex items-center gap-1.5">
          {navLinks.map((link) =>
            link.href.startsWith("/") && !link.href.includes("#") ? (
              <Link
                key={link.href}
                to={link.href}
                className="text-primary-foreground/80 text-sm font-medium px-4 py-2 rounded-lg hover:bg-primary-foreground/10 hover:text-primary-foreground transition-all"
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.href}
                href={link.href}
                className="text-primary-foreground/80 text-sm font-medium px-4 py-2 rounded-lg hover:bg-primary-foreground/10 hover:text-primary-foreground transition-all"
              >
                {link.label}
              </a>
            )
          )}
        </div>

        <div className="flex gap-2.5 items-center">
          <a href="#emergency" className="px-5 py-2.5 rounded-[10px] text-[13px] font-semibold bg-gradient-to-br from-secondary to-accent text-primary shadow-lg hover:shadow-xl transition-all">
            📞 জরুরি সেবা
          </a>
        </div>
      </div>

      {/* Mobile */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
            <div className="w-[42px] h-[42px] bg-gradient-to-br from-secondary to-accent rounded-xl flex items-center justify-center text-[22px] shadow-lg">
              🏔️
            </div>
            <div>
              <h1 className="font-bangla text-lg text-primary-foreground leading-tight">খাগড়াছড়ি</h1>
              <span className="text-[11px] text-bamboo-light tracking-wide">আমাদের শহর, আমাদের গর্ব</span>
            </div>
          </Link>
          <div className="flex gap-3 items-center">
            <button className="w-9 h-9 bg-primary-foreground/10 rounded-[10px] flex items-center justify-center text-primary-foreground">🔔</button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="w-9 h-9 bg-primary-foreground/10 rounded-[10px] flex items-center justify-center text-primary-foreground"
            >
              {mobileOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
        {mobileOpen && (
          <div className="px-4 pb-3 flex flex-col gap-1">
            {navLinks.map((link) =>
              link.href.startsWith("/") && !link.href.includes("#") ? (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-primary-foreground/80 text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-primary-foreground/10"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-primary-foreground/80 text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-primary-foreground/10"
                >
                  {link.label}
                </a>
              )
            )}
          </div>
        )}
      </div>

      {/* CHT Pattern */}
      <div className="cht-pattern hidden lg:block" />
      <div className="cht-pattern-mobile lg:hidden" />
    </nav>
  );
};

export default Navbar;
