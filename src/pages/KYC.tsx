import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const KYC = () => {
  const [pan, setPan] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const navigate = useNavigate();

  const formatPAN = (value: string) => {
    // Remove all non-alphanumeric characters and convert to uppercase
    const cleaned = value.replace(/[^A-Z0-9]/gi, '').toUpperCase();
    // Limit to 10 characters
    return cleaned.substring(0, 10);
  };

  const formatAadhaar = (value: string) => {
    // Remove all non-numeric characters
    const cleaned = value.replace(/\D/g, '');
    // Add dashes after every 4 digits
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1-');
    // Limit to 14 characters (12 digits + 2 dashes)
    return formatted.substring(0, 14);
  };

  const maskPAN = (value: string) => {
    if (value.length <= 3) return value;
    if (value.length <= 7) return '***' + value.substring(3);
    return '***' + value.substring(3, 7) + '****' + value.substring(7);
  };

  const maskAadhaar = (value: string) => {
    if (value.length <= 4) return value;
    const parts = value.split('-');
    if (parts.length === 1) return '****-' + value.substring(4);
    if (parts.length === 2) return '****-****-' + parts[1];
    return '****-****-' + parts[2];
  };

  const handlePANChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPAN(e.target.value);
    setPan(formatted);
  };

  const handleAadhaarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatAadhaar(e.target.value);
    setAadhaar(formatted);
  };

  const isPANValid = pan.length === 10;
  const isAadhaarValid = aadhaar.replace(/-/g, '').length === 12;

  useEffect(() => {
    if (isPANValid && isAadhaarValid) {
      setIsAnimatingOut(true);
      setTimeout(() => {
        navigate('/eligible-apps');
      }, 800);
    }
  }, [isPANValid, isAadhaarValid, navigate]);

  return (
    <div className={`min-h-screen login-container relative overflow-hidden transition-opacity duration-800 ${
      isAnimatingOut ? 'opacity-0' : 'opacity-100'
    }`}>
      {/* Top Message */}
      <div className="absolute top-16 left-1/2 transform -translate-x-1/2 text-center z-20">
        <h1 className="text-2xl md:text-3xl font-bold text-pure-white mb-2 glow-text">
          Low interest. No credit score required. Fast approval.
        </h1>
      </div>

      {/* Form Container */}
      <div className="flex items-center justify-center min-h-screen px-8">
        <div className="w-full max-w-md space-y-8 animate-slide-in-right">
          
          {/* PAN Input */}
          <div className="relative bg-pure-white rounded-2xl p-6 shadow-2xl transform transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-3">
              <label className="text-lg font-semibold text-gray-900">
                PAN Number
              </label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="w-5 h-5 text-gray-400 hover:text-electric-blue transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>10-character alphanumeric PAN (e.g., ABCDE1234F)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              value={pan.length > 3 ? maskPAN(pan) : pan}
              onChange={handlePANChange}
              placeholder="Enter your PAN"
              className={`text-lg border-0 bg-transparent focus:ring-2 transition-all duration-300 ${
                isPANValid ? 'focus:ring-electric-blue ring-electric-blue' : 'focus:ring-gray-300'
              }`}
              maxLength={10}
            />
            {isPANValid && (
              <div className="absolute -right-2 -top-2 w-6 h-6 bg-electric-blue rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-pure-white rounded-full animate-pulse"></div>
              </div>
            )}
          </div>

          {/* Aadhaar Input */}
          <div className="relative bg-pure-white rounded-2xl p-6 shadow-2xl transform transition-all duration-300 hover:scale-105 animation-delay-200">
            <div className="flex items-center justify-between mb-3">
              <label className="text-lg font-semibold text-gray-900">
                Aadhaar Number
              </label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="w-5 h-5 text-gray-400 hover:text-electric-blue transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>12-digit Aadhaar number (e.g., 1234-5678-9012)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              value={aadhaar.length > 4 ? maskAadhaar(aadhaar) : aadhaar}
              onChange={handleAadhaarChange}
              placeholder="Enter your Aadhaar"
              className={`text-lg border-0 bg-transparent focus:ring-2 transition-all duration-300 ${
                isAadhaarValid ? 'focus:ring-electric-blue ring-electric-blue' : 'focus:ring-gray-300'
              }`}
              maxLength={14}
            />
            {isAadhaarValid && (
              <div className="absolute -right-2 -top-2 w-6 h-6 bg-electric-blue rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-pure-white rounded-full animate-pulse"></div>
              </div>
            )}
          </div>

          {/* Loading indicator when both are valid */}
          {isPANValid && isAadhaarValid && (
            <div className="text-center">
              <div className="inline-block w-8 h-1 bg-electric-blue rounded-full animate-pulse mb-2"></div>
              <p className="text-pure-white/80 text-sm">Verifying details...</p>
            </div>
          )}

        </div>
      </div>

      {/* Bottom Security Note */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
        <p className="text-pure-white/60 text-sm">
          Your data is encrypted and never shared.
        </p>
      </div>
    </div>
  );
};

export default KYC;