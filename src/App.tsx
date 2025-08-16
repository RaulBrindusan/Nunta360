<<<<<<< HEAD
=======

>>>>>>> c493688bf11b8df40335dff740eeed20607864ca
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
<<<<<<< HEAD
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Calendar from "./pages/Calendar";
import Guests from "./pages/Guests";
import Budget from "./pages/Budget";
import Settings from "./pages/Settings";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // You might want to replace this with a proper loading component
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};
=======
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";
>>>>>>> c493688bf11b8df40335dff740eeed20607864ca

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
<<<<<<< HEAD
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/dashboard/*"
                element={
                  <ProtectedRoute>
                    <Routes>
                      <Route index element={<Dashboard />} />
                      <Route path="timeline" element={<Calendar />} />
                      <Route path="guests" element={<Guests />} />
                      <Route path="budget" element={<Budget />} />
                      <Route path="settings" element={<Settings />} />
                    </Routes>
                  </ProtectedRoute>
                }
              />
=======
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
>>>>>>> c493688bf11b8df40335dff740eeed20607864ca
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
