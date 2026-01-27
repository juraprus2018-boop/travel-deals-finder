import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CategoryPage from "./pages/CategoryPage";
import DestinationPage from "./pages/DestinationPage";
import HotelsPage from "./pages/HotelsPage";
import AttractionsPage from "./pages/AttractionsPage";
import FlightsPage from "./pages/FlightsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Category pages */}
          <Route path="/:categorySlug" element={<CategoryPage />} />
          
          {/* Destination pages */}
          <Route path="/:categorySlug/:destinationSlug" element={<DestinationPage />} />
          
          {/* Sub pages */}
          <Route path="/:categorySlug/:destinationSlug/hotels" element={<HotelsPage />} />
          <Route path="/:categorySlug/:destinationSlug/bezienswaardigheden" element={<AttractionsPage />} />
          <Route path="/:categorySlug/:destinationSlug/vliegtickets" element={<FlightsPage />} />
          
          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
