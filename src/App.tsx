
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import BlueprintPage from "./pages/BlueprintPage";
import SamplesPage from "./pages/SamplesPage";
import GeneratePage from "./pages/GeneratePage";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";
import "./App.css";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              
              {/* Redirect authenticated users based on role */}
              <Route path="/" element={
                <ProtectedRoute>
                  {/* This will be handled by the ProtectedRoute component which checks the user role */}
                  <Navigate to="/blueprint" replace />
                </ProtectedRoute>
              } />
              
              <Route path="/blueprint" element={
                <ProtectedRoute>
                  <BlueprintPage />
                </ProtectedRoute>
              } />
              
              <Route path="/samples" element={
                <ProtectedRoute>
                  <SamplesPage />
                </ProtectedRoute>
              } />
              
              <Route path="/generate" element={
                <ProtectedRoute>
                  <GeneratePage />
                </ProtectedRoute>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
