import { useState } from "react";
import AppSidebar from "@/components/AppSidebar";
import MobileHeader from "@/components/MobileHeader";
import BottomNav from "@/components/BottomNav";
import Topbar from "@/components/Topbar";
import HomePage from "@/components/HomePage";
import ServicesPage from "@/components/ServicesPage";
import HotelsPage from "@/components/HotelsPage";
import TouristPage from "@/components/TouristPage";

const topbarTitles: Record<string, string> = {
  home: "খাগড়াছড়ি — সকল সেবা এক জায়গায়",
  hotels: "🏨 হোটেল ও আবাসন",
  tourist: "🗺️ পর্যটন স্থান",
};

const Index = () => {
  const [activePage, setActivePage] = useState("home");
  const [activeService, setActiveService] = useState<string | null>(null);

  const handleNavigate = (id: string, type: "page" | "service") => {
    if (type === "page") {
      setActivePage(id);
      setActiveService(null);
    } else {
      setActivePage(id);
      setActiveService(id);
    }
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setActivePage("home");
    setActiveService(null);
    window.scrollTo(0, 0);
  };

  const currentTitle = activeService
    ? "সেবা"
    : topbarTitles[activePage] || "খাগড়াছড়ি — সকল সেবা এক জায়গায়";

  return (
    <div className="flex min-h-screen">
      <AppSidebar activePage={activePage} onNavigate={handleNavigate} />

      <div className="lg:ml-[268px] flex-1 flex flex-col">
        <MobileHeader />
        <Topbar title={currentTitle} />

        <div className="p-[13px] pb-[76px] lg:p-6 lg:pb-6 flex-1">
          {activeService ? (
            <ServicesPage serviceId={activeService} onBack={handleBack} />
          ) : activePage === "home" ? (
            <HomePage onNavigate={handleNavigate} />
          ) : activePage === "hotels" ? (
            <HotelsPage onBack={handleBack} />
          ) : activePage === "tourist" ? (
            <TouristPage onBack={handleBack} />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Index;
