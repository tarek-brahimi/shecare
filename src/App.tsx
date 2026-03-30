import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "sonner";
import type { ReactNode } from "react";
import { DarkModeProvider } from "@/context/DarkModeContext";
import { AuthProvider } from "@/context/AuthContext";
import AppLayout from "@/ui/AppLayout";
import { GuestOnlyRoute, ProtectedRoute } from "@/ui/RouteGuards";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Community from "./pages/Community";
import Resources from "./pages/Resources";
import Health from "./pages/Health";
import AISupport from "./pages/AISupport";
import Consultation from "./pages/Consultation";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function protectedLayout(page: ReactNode) {
  return (
    <ProtectedRoute>
      <AppLayout>{page}</AppLayout>
    </ProtectedRoute>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <DarkModeProvider>
      <AuthProvider>
        <Sonner />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<GuestOnlyRoute><Login /></GuestOnlyRoute>} />
            <Route path="/register" element={<GuestOnlyRoute><Register /></GuestOnlyRoute>} />
            <Route path="/dashboard" element={protectedLayout(<Dashboard />)} />
            <Route path="/community" element={protectedLayout(<Community />)} />
            <Route path="/resources" element={protectedLayout(<Resources />)} />
            <Route path="/health" element={protectedLayout(<Health />)} />
            <Route path="/ai" element={protectedLayout(<AISupport />)} />
            <Route path="/consultation" element={protectedLayout(<Consultation />)} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </DarkModeProvider>
  </QueryClientProvider>
);

export default App;
