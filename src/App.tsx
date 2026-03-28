import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DarkModeProvider } from "@/context/DarkModeContext";
import AppLayout from "@/ui/AppLayout";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Community from "./pages/Community";
import Resources from "./pages/Resources";
import Health from "./pages/Health";
import AISupport from "./pages/AISupport";
import Consultation from "./pages/Consultation";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <DarkModeProvider>
      <TooltipProvider>
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
            <Route path="/community" element={<AppLayout><Community /></AppLayout>} />
            <Route path="/resources" element={<AppLayout><Resources /></AppLayout>} />
            <Route path="/health" element={<AppLayout><Health /></AppLayout>} />
            <Route path="/ai" element={<AppLayout><AISupport /></AppLayout>} />
            <Route path="/consultation" element={<AppLayout><Consultation /></AppLayout>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </DarkModeProvider>
  </QueryClientProvider>
);

export default App;
