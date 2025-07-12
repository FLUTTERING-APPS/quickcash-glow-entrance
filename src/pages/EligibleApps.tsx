import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

const EligibleApps = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(3);

  const loanApps = [
    { name: "KreditBee", logo: "🐝", eligible: true },
    { name: "MoneyTap", logo: "💰", eligible: true },
    { name: "CASHe", logo: "💳", eligible: true },
    { name: "PaySense", logo: "💸", eligible: true },
    { name: "EarlySalary", logo: "⏰", eligible: true },
    { name: "Fibe", logo: "🔥", eligible: true },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          navigate('/platform-fee');
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen login-container flex items-center justify-center px-6">
      <div className="w-full max-w-4xl text-center space-y-8">
        {/* Title */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-pure-white glow-text">
            You are eligible to apply with these trusted apps
          </h1>
          <div className="w-32 h-1 bg-electric-blue mx-auto rounded-full shadow-lg shadow-electric-blue/50"></div>
        </div>

        {/* Apps Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
          {loanApps.map((app, index) => (
            <div
              key={app.name}
              className="bg-pure-white rounded-2xl p-6 shadow-2xl hover:scale-105 transition-all duration-300 hover:shadow-electric-blue/20 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* App Logo */}
              <div className="text-4xl mb-4">{app.logo}</div>
              
              {/* Eligible Badge */}
              <Badge className="bg-green-500 text-pure-white mb-3 px-3 py-1 rounded-full">
                <Check className="w-4 h-4 mr-1" />
                Eligible
              </Badge>
              
              {/* App Name */}
              <h3 className="text-xl font-bold text-gray-900">{app.name}</h3>
            </div>
          ))}
        </div>

        {/* Countdown */}
        <div className="space-y-4">
          <p className="text-pure-white/80 text-lg">
            Continuing in{" "}
            <span className="text-electric-blue text-2xl font-bold">{countdown}</span>
            ...
          </p>
          
          {/* Loading dots */}
          <div className="flex justify-center space-x-2">
            <div className="w-3 h-3 bg-electric-blue rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-electric-blue rounded-full animate-pulse delay-75"></div>
            <div className="w-3 h-3 bg-electric-blue rounded-full animate-pulse delay-150"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EligibleApps;