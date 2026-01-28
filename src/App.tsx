import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ScrollToTop from "@/components/ScrollToTop";

// Public pages
import Index from "./pages/Index";
import CategoryPage from "./pages/CategoryPage";
import DestinationPage from "./pages/DestinationPage";
import HotelsPage from "./pages/HotelsPage";
import AttractionsPage from "./pages/AttractionsPage";
import FlightsPage from "./pages/FlightsPage";
import CountryPage from "./pages/CountryPage";
import CountriesOverviewPage from "./pages/CountriesOverviewPage";
import RestaurantsPage from "./pages/RestaurantsPage";
import NotFound from "./pages/NotFound";

// Admin pages
import LoginPage from "./pages/admin/LoginPage";
import ProtectedAdminRoute from "./components/admin/ProtectedAdminRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import DestinationsListPage from "./pages/admin/DestinationsListPage";
import NewDestinationPage from "./pages/admin/NewDestinationPage";
import EditDestinationPage from "./pages/admin/EditDestinationPage";
import DestinationContentPage from "./pages/admin/DestinationContentPage";
import RestaurantsManagePage from "./pages/admin/RestaurantsManagePage";
import ContentOverviewPage from "./pages/admin/ContentOverviewPage";
import SettingsPage from "./pages/admin/SettingsPage";
import AdminSetupPage from "./pages/admin/AdminSetupPage";
import CountryContentListPage from "./pages/admin/CountryContentListPage";
import CountryContentEditPage from "./pages/admin/CountryContentEditPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            
            {/* Country routes - must be before category routes */}
            <Route path="/landen" element={<CountriesOverviewPage />} />
            <Route path="/land/:countrySlug" element={<CountryPage />} />
            
            {/* Category & Destination routes */}
            <Route path="/:categorySlug" element={<CategoryPage />} />
            <Route path="/:categorySlug/:destinationSlug" element={<DestinationPage />} />
            <Route path="/:categorySlug/:destinationSlug/hotels" element={<HotelsPage />} />
            <Route path="/:categorySlug/:destinationSlug/bezienswaardigheden" element={<AttractionsPage />} />
            <Route path="/:categorySlug/:destinationSlug/restaurants" element={<RestaurantsPage />} />
            <Route path="/:categorySlug/:destinationSlug/vliegtickets" element={<FlightsPage />} />
            
            {/* Admin routes */}
            <Route path="/admin/login" element={<LoginPage />} />
            <Route path="/admin/setup" element={<AdminSetupPage />} />
            <Route path="/admin" element={<ProtectedAdminRoute />}>
              <Route index element={<AdminDashboard />} />
              <Route path="destinations" element={<DestinationsListPage />} />
              <Route path="destinations/new" element={<NewDestinationPage />} />
              <Route path="destinations/:id" element={<EditDestinationPage />} />
              <Route path="destinations/:id/content" element={<DestinationContentPage />} />
              <Route path="destinations/:id/restaurants" element={<RestaurantsManagePage />} />
              <Route path="content" element={<ContentOverviewPage />} />
              <Route path="landen" element={<CountryContentListPage />} />
              <Route path="landen/:countrySlug" element={<CountryContentEditPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
