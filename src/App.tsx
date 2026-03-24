import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import GameSelect from "./pages/GameSelect";
import CustomBusiness from "./pages/CustomBusiness";
import GamePlay from "./pages/GamePlay";
import Evaluation from "./pages/Evaluation";
import RescuePlan from "./pages/RescuePlan";
import Results from "./pages/Results";
import Profile from "./pages/Profile";
import HostSession from "./pages/HostSession";
import JoinSession from "./pages/JoinSession";
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
          <Route path="/select" element={<GameSelect />} />
          <Route path="/custom-business" element={<CustomBusiness />} />
          <Route path="/play" element={<GamePlay />} />
          <Route path="/evaluate" element={<Evaluation />} />
          <Route path="/rescue" element={<RescuePlan />} />
          <Route path="/results" element={<Results />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/host" element={<HostSession />} />
          <Route path="/join" element={<JoinSession />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
