import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, ExternalLink } from "lucide-react";

const PaymentSuccess = () => {
  const [countdown, setCountdown] = useState(3);
  const [showRedirect, setShowRedirect] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setShowRedirect(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleOpenApp = () => {
    // Simulate opening Play Store or WebView
    window.open('https://play.google.com/store/apps/details?id=com.kreditbee', '_blank');
  };

  return (
    <div className="min-h-screen login-container flex items-center justify-center px-6">
      <div className="w-full max-w-lg text-center space-y-8">
        {/* Animated Checkmark */}
        <div className="relative">
          <div className="w-32 h-32 mx-auto relative">
            <CheckCircle className="w-32 h-32 text-green-400 animate-pulse" />
            <div className="absolute inset-0 w-32 h-32 rounded-full bg-green-400/20 animate-ping"></div>
          </div>
        </div>

        {/* Success Title */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-pure-white">
            Premium Activated ✔️
          </h1>
          <div className="w-24 h-1 bg-green-400 mx-auto rounded-full shadow-lg shadow-green-400/50"></div>
        </div>

        {/* Success Message */}
        <div className="space-y-6 text-pure-white/90">
          <p className="text-lg leading-relaxed">
            You're now eligible for instant loan matching.
          </p>
          
          {!showRedirect ? (
            <p className="text-xl font-semibold">
              Redirecting you to your top loan app in{" "}
              <span className="text-electric-blue text-2xl">{countdown}</span>...
            </p>
          ) : (
            <p className="text-xl font-semibold text-green-400">
              Ready to proceed!
            </p>
          )}
        </div>

        {/* App Redirect Button */}
        {showRedirect && (
          <div className="animate-fade-in space-y-4">
            <Button
              onClick={handleOpenApp}
              className="w-full py-6 text-xl font-bold rounded-2xl bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-pure-white shadow-2xl shadow-green-500/30 transition-all duration-300 hover:scale-105 animate-bounce"
            >
              <ExternalLink className="w-6 h-6 mr-3" />
              Open KreditBee
            </Button>
            
            <p className="text-pure-white/60 text-sm">
              You'll be redirected to the KreditBee app to complete your loan application
            </p>
          </div>
        )}

        {/* Celebration Effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-ping delay-100"></div>
          <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-green-400 rounded-full animate-ping delay-300"></div>
          <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-blue-400 rounded-full animate-ping delay-500"></div>
          <div className="absolute bottom-1/4 right-1/3 w-3 h-3 bg-purple-400 rounded-full animate-ping delay-700"></div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;