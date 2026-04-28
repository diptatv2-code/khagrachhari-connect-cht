import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Directory from "./pages/Directory";
import TouristSpotDetail from "./pages/TouristSpotDetail";
import Marketplace from "./pages/Marketplace";
import Admin from "./pages/Admin";
import Doctors from "./pages/Doctors";
import ListingDetail from "./pages/ListingDetail";
import Food from "./pages/Food";
import Jobs from "./pages/Jobs";
import CommunityHub from "./pages/CommunityHub";
import Ride from "./pages/Ride";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/directory" element={<Directory />} />
          <Route path="/spot/:slug" element={<TouristSpotDetail />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/listing/:id" element={<ListingDetail />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/food" element={<Food />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/community" element={<CommunityHub />} />
          <Route path="/ride" element={<Ride />} />
          <Route path="/admin" element={<Admin />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
