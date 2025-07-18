import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { validateAadhaar, validatePAN, formatAadhaar, formatPAN } from "@/utils/validation";

interface KYCFormProps {
  onSubmit: (aadhaar: string, pan: string) => void;
  onBack: () => void;
  loading?: boolean;
}

const KYCForm = ({ onSubmit, onBack, loading = false }: KYCFormProps) => {
  const [aadhaar, setAadhaar] = useState("");
  const [pan, setPan] = useState("");
  const [aadhaarError, setAadhaarError] = useState("");
  const [panError, setPanError] = useState("");

  const handleAadhaarChange = (value: string) => {
    const formatted = formatAadhaar(value);
    setAadhaar(formatted);
    
    if (aadhaarError) {
      setAadhaarError("");
    }
  };

  const handlePanChange = (value: string) => {
    const formatted = formatPAN(value);
    setPan(formatted);
    
    if (panError) {
      setPanError("");
    }
  };

  const handleSubmit = () => {
    const aadhaarValidation = validateAadhaar(aadhaar);
    const panValidation = validatePAN(pan);

    setAadhaarError(aadhaarValidation.error || "");
    setPanError(panValidation.error || "");

    if (aadhaarValidation.isValid && panValidation.isValid) {
      onSubmit(aadhaar.replace(/\s/g, ''), pan.replace(/\s/g, ''));
    }
  };

  const isValid = aadhaar.length >= 14 && pan.length >= 12 && !aadhaarError && !panError;

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-card/30 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Complete KYC</h2>
        <p className="text-white/70">We need to verify your identity</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="aadhaar" className="text-white font-medium">
            Aadhaar Number
          </Label>
          <Input
            id="aadhaar"
            value={aadhaar}
            onChange={(e) => handleAadhaarChange(e.target.value)}
            placeholder="1234 5678 9012"
            className={`bg-black/50 border-white/20 text-white placeholder:text-white/50 h-14 text-lg ${
              aadhaarError ? 'border-red-500' : ''
            }`}
          />
          {aadhaarError && (
            <p className="text-red-400 text-sm">{aadhaarError}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="pan" className="text-white font-medium">
            PAN Number
          </Label>
          <Input
            id="pan"
            value={pan}
            onChange={(e) => handlePanChange(e.target.value)}
            placeholder="ABCDE 1234 F"
            className={`bg-black/50 border-white/20 text-white placeholder:text-white/50 h-14 text-lg ${
              panError ? 'border-red-500' : ''
            }`}
          />
          {panError && (
            <p className="text-red-400 text-sm">{panError}</p>
          )}
        </div>
      </div>

      <div className="flex gap-4 mt-8">
        <Button
          onClick={onBack}
          variant="outline"
          className="flex-1 h-14 bg-transparent border-white/20 text-white hover:bg-white/10"
          disabled={loading}
        >
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!isValid || loading}
          className={`flex-1 h-14 font-bold transition-all duration-300 ${
            isValid && !loading
              ? 'bg-electric-blue text-black hover:bg-electric-blue-glow hover:scale-105 shadow-[0_0_30px_hsl(var(--electric-blue)_/_0.5)]'
              : 'bg-gray-600 text-gray-400'
          }`}
        >
          {loading ? 'Submitting...' : 'Complete KYC'}
        </Button>
      </div>
    </div>
  );
};

export default KYCForm;