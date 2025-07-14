import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./integrations/supabase/client";
import Login from "./pages/Login";
import Index from "./pages/Index";
import KYC from "./pages/KYC";
import EligibleApps from "./pages/EligibleApps";
import PlatformFee from "./pages/PlatformFee";
import PaymentSuccess from "./pages/PaymentSuccess";
import NotFound from "./pages/NotFound";
import LoanStatus from "./components/LoanStatus";

const queryClient = new QueryClient();

const App = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasExistingApplication, setHasExistingApplication] = useState(false);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        checkExistingApplication(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        checkExistingApplication(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkExistingApplication = async (userId: string) => {
    try {
      const { data } = await supabase
        .from('loan_applications')
        .select('id')
        .eq('user_id', userId)
        .limit(1);
      
      setHasExistingApplication(data && data.length > 0);
    } catch (error) {
      console.error('Error checking existing application:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {!session ? (
              <Route path="*" element={<Login />} />
            ) : (
              <>
                <Route path="/" element={hasExistingApplication ? <LoanStatus /> : <Index />} />
                <Route path="/new-application" element={<Index />} />
                <Route path="/loan-status" element={<LoanStatus />} />
                <Route path="/kyc" element={<KYC />} />
                <Route path="/eligible-apps" element={<EligibleApps />} />
                <Route path="/platform-fee" element={<PlatformFee />} />
                <Route path="/payment-success" element={<PaymentSuccess />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </>
            )}
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
