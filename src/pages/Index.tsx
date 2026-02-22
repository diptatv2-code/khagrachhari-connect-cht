import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import EmergencyBar from "@/components/EmergencyBar";
import ServicesSection from "@/components/ServicesSection";
import TouristSpots from "@/components/TouristSpots";
import HotelsSection from "@/components/HotelsSection";
import TransportSection from "@/components/TransportSection";
import EmergencyContacts from "@/components/EmergencyContacts";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      <Hero />
      <EmergencyBar />
      <ServicesSection />
      <TouristSpots />
      <div className="cht-divider" />
      <HotelsSection />
      <TransportSection />
      <EmergencyContacts />
      <Footer />
    </div>
  );
};

export default Index;
