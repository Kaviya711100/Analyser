
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SupabaseAuthProvider, useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { SupabaseDataProvider } from "@/contexts/SupabaseDataContext";
import LoginForm from "@/components/LoginForm";
import OwnerDashboard from "@/components/OwnerDashboard";
import StaffDashboard from "@/components/StaffDashboard";

const queryClient = new QueryClient();

const AppContent = () => {
  const { isAuthenticated, user } = useSupabaseAuth();

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  if (user?.role === 'owner') {
    return <OwnerDashboard />;
  } else {
    return <StaffDashboard />;
  }
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <SupabaseAuthProvider>
        <SupabaseDataProvider>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </SupabaseDataProvider>
      </SupabaseAuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
