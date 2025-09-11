import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { BookingProvider } from "./hooks/BookingContext";
import PaymentFailed from "./components/Failed";
import PaymentSuccess from "./components/Success";
// import PaymentCallback from "./components/PaymentCallback";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
       <BookingProvider>
        <Routes>
        <Route path="/" element={<Index />} />
         {/* <Route path="/payment/callback" element={<PaymentCallback />} />  */}
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/failed" element={<PaymentFailed />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

       </BookingProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
