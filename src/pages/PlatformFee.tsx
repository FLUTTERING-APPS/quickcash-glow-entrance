import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Check } from "lucide-react";

const PlatformFee = () => {
  const navigate = useNavigate();
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      navigate('/payment-success');
    }, 2000);
  };

  return (
    <div className="min-h-screen login-container flex items-center justify-center px-6">
      <div className="w-full max-w-lg text-center space-y-8 animate-slide-in-right">
        {/* Title with gold underline glow */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-pure-white">
            Activate Premium Access
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 mx-auto rounded-full shadow-lg shadow-yellow-400/50"></div>
        </div>

        {/* Description */}
        <div className="space-y-4 text-pure-white/90">
          <p className="text-lg leading-relaxed">
            Unlock fast-track loan processing, priority app access, and secure KYC.
          </p>
          <p className="text-xl font-semibold text-pure-white">
            One-time platform fee: <span className="text-yellow-400">₹299</span> (non-refundable)
          </p>
        </div>

        {/* Checkbox for Terms */}
        <div className="bg-pure-white/5 rounded-2xl p-6 backdrop-blur-sm border border-pure-white/10">
          <div className="flex items-start space-x-4">
            <Checkbox
              id="terms"
              checked={agreedToTerms}
              onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
              className="mt-1 border-pure-white/30 data-[state=checked]:bg-electric-blue data-[state=checked]:border-electric-blue"
            />
            <label 
              htmlFor="terms" 
              className="text-pure-white/90 text-left cursor-pointer leading-relaxed"
            >
              I agree to the{" "}
              <span className="text-electric-blue hover:underline cursor-pointer">
                Terms & Conditions
              </span>{" "}
              and{" "}
              <span className="text-electric-blue hover:underline cursor-pointer">
                Privacy Policy
              </span>
              .
            </label>
          </div>
        </div>

        {/* Payment Button */}
        {agreedToTerms && (
          <div className="animate-fade-in">
            <Button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full py-6 text-xl font-bold rounded-2xl bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-gray-900 shadow-2xl shadow-yellow-400/30 transition-all duration-300 hover:scale-105 hover:shadow-yellow-400/50"
            >
              {isProcessing ? (
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                <>
                  <Check className="w-6 h-6 mr-3" />
                  Activate Now – ₹299
                </>
              )}
            </Button>
          </div>
        )}

        {/* Security Note */}
        <p className="text-pure-white/60 text-sm">
          🔒 Your payment is secured with 256-bit encryption
        </p>
      </div>
    </div>
  );
};

export default PlatformFee;