import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const CITIES = [
  "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune", "Ahmedabad",
  "Surat", "Jaipur", "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane", "Bhopal", "Others"
];

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentCard, setCurrentCard] = useState(0);
  const [loanAmount, setLoanAmount] = useState([500000]);
  const [employmentType, setEmploymentType] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [city, setCity] = useState("");
  const [filteredCities, setFilteredCities] = useState(CITIES);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [isOthersSelected, setIsOthersSelected] = useState(false);
  const sliderTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const totalCards = 5;

  const formatAmount = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)} Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)} L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}K`;
    return `₹${amount}`;
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'left' && currentCard < totalCards - 1) {
      setCurrentCard(currentCard + 1);
    } else if (direction === 'right' && currentCard > 0) {
      setCurrentCard(currentCard - 1);
    }
  };

  const autoAdvance = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      if (currentCard < totalCards - 1) {
        setCurrentCard(currentCard + 1);
      } else {
        // Submit loan application data
        submitLoanApplication();
      }
    }, 1500);
  };

  const submitLoanApplication = async () => {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) {
        navigate('/login');
        return;
      }

      // Validate required fields
      if (!loanAmount[0] || !employmentType || !monthlyIncome || !ageGroup || !city.trim()) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields.",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('loan_applications')
        .insert({
          user_id: user.id,
          loan_amount: loanAmount[0],
          employment_type: employmentType,
          monthly_income: monthlyIncome,
          age_group: ageGroup,
          city: city.trim()
        });

      if (error) {
        console.error('Error submitting application:', error);
        toast({
          title: "Error",
          description: "Failed to submit application. Please try again.",
          variant: "destructive"
        });
        return;
      }

      // Create KYC status entry
      await supabase
        .from('kyc_status')
        .upsert({
          user_id: user.id,
          status: 'pending'
        });

      toast({
        title: "Application Submitted!",
        description: "Your loan application has been submitted successfully.",
      });

      navigate('/kyc');
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleCitySearch = (value: string) => {
    setCity(value);
    const filtered = CITIES.filter(c => 
      c.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCities(filtered);
    setShowCityDropdown(value.length > 0);
    
    // Auto-advance if exact city match or user types enough
    if (filtered.length === 1 && value.length > 2) {
      setTimeout(() => {
        setShowCityDropdown(false);
        autoAdvance();
      }, 800);
    }
  };

  const handleCitySelect = (cityName: string) => {
    setCity(cityName);
    setShowCityDropdown(false);
    autoAdvance();
  };

  const handleOthersCity = () => {
    setCity("");
    setIsOthersSelected(true);
    setShowCityDropdown(false);
    // Clear any auto-advance timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (sliderTimeoutRef.current) {
      clearTimeout(sliderTimeoutRef.current);
    }
  };

  const handleManualCitySubmit = () => {
    if (city.trim()) {
      autoAdvance();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handleSwipe('right');
      if (e.key === 'ArrowRight') handleSwipe('left');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentCard]);

  const cards = [
    // Card 1: Loan Amount
    <div key="loan-amount" className="flex flex-col items-center justify-center space-y-8 text-center">
      <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
        How much loan do you need?
      </h2>
      <div className="w-full max-w-lg space-y-8">
        <div className="text-6xl md:text-7xl font-black text-primary glow-text">
          {formatAmount(loanAmount[0])}
        </div>
        <div className="px-6">
          <Slider
            value={loanAmount}
            onValueChange={(value) => {
              setLoanAmount(value);
              if (sliderTimeoutRef.current) clearTimeout(sliderTimeoutRef.current);
              sliderTimeoutRef.current = setTimeout(autoAdvance, 1000);
            }}
            max={10000000}
            min={1000}
            step={1000}
            className="w-full slider-electric"
          />
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>₹1K</span>
          <span>₹1 Cr</span>
        </div>
        <p className="text-muted-foreground text-sm mt-4">
          Low interest rates. No credit score required.
        </p>
      </div>
    </div>,

    // Card 2: Employment Type
    <div key="employment" className="flex flex-col items-center justify-center space-y-8 text-center">
      <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-8">
        What's your employment type?
      </h2>
      <div className="grid gap-6 w-full max-w-md">
        {["Salaried", "Self-employed", "Student"].map((type) => (
          <Button
            key={type}
            onClick={() => {
              setEmploymentType(type);
              autoAdvance();
            }}
            className={`py-6 text-xl font-semibold rounded-2xl transition-all duration-300 ${
              employmentType === type
                ? "bg-primary text-primary-foreground shadow-2xl shadow-primary/40 scale-105"
                : "bg-card text-card-foreground hover:bg-muted hover:scale-105"
            }`}
          >
            {type}
          </Button>
        ))}
      </div>
    </div>,

    // Card 3: Monthly Income
    <div key="income" className="flex flex-col items-center justify-center space-y-8 text-center">
      <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-8">
        Your monthly income
      </h2>
      <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
        {["₹5K - ₹20K", "₹20K - ₹40K", "₹40K - ₹60K", "₹60K - ₹80K", "₹80K - ₹1L", "₹1L+"].map((income) => (
          <Button
            key={income}
            onClick={() => {
              setMonthlyIncome(income);
              autoAdvance();
            }}
            className={`py-4 text-lg font-medium rounded-xl transition-all duration-300 ${
              monthlyIncome === income
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-105"
                : "bg-card text-card-foreground hover:bg-muted hover:scale-105"
            }`}
          >
            {income}
          </Button>
        ))}
      </div>
    </div>,

    // Card 4: Age Group
    <div key="age" className="flex flex-col items-center justify-center space-y-8 text-center">
      <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-8">
        What's your age group?
      </h2>
      <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
        {["18-21", "22-25", "26-30", "31-35", "36-45", "46-60", "60+"].map((age) => (
          <Button
            key={age}
            onClick={() => {
              setAgeGroup(age);
              autoAdvance();
            }}
            className={`py-4 text-lg font-medium rounded-xl transition-all duration-300 pulse-hover ${
              ageGroup === age
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-105"
                : "bg-card text-card-foreground hover:bg-muted"
            }`}
          >
            {age === "18-21" ? "18-21 (Student Loans)" : age}
          </Button>
        ))}
      </div>
    </div>,

    // Card 5: City Search
    <div key="city" className="flex flex-col items-center justify-center space-y-8 text-center">
      <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-8">
        Enter your city
      </h2>
      <div className="relative w-full max-w-md">
        <div className="relative bg-card rounded-2xl p-6 shadow-2xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              value={city}
              onChange={(e) => handleCitySearch(e.target.value)}
              placeholder="Type your city name..."
              className="pl-10 py-3 text-lg border-0 bg-transparent focus:ring-0 focus:outline-none text-card-foreground"
              onFocus={() => setShowCityDropdown(true)}
            />
          </div>
          
          {showCityDropdown && filteredCities.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-xl shadow-2xl max-h-48 overflow-y-auto z-50 border border-border">
              {filteredCities.slice(0, 6).map((cityName) => (
                <button
                  key={cityName}
                  onClick={() => cityName === "Others" ? handleOthersCity() : handleCitySelect(cityName)}
                  className="w-full text-left px-4 py-3 hover:bg-muted transition-colors duration-200 text-card-foreground"
                >
                  {cityName}
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Others manual input section */}
        {isOthersSelected && (
          <div className="mt-4 p-4 bg-muted/20 rounded-xl">
            <Input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter your city name..."
              className="mb-3 bg-card text-card-foreground"
              onKeyPress={(e) => e.key === 'Enter' && handleManualCitySubmit()}
            />
            <div className="flex gap-2">
              <Button
                onClick={handleManualCitySubmit}
                disabled={!city.trim()}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Continue
              </Button>
              <Button
                onClick={() => {
                  setIsOthersSelected(false);
                  setCity("");
                }}
                variant="outline"
                className="bg-muted/20 text-foreground border-border"
              >
                Back
              </Button>
            </div>
          </div>
        )}
        
        {/* Others button for manual input */}
        {!showCityDropdown && !city && !isOthersSelected && (
          <Button
            onClick={handleOthersCity}
            className="mt-4 bg-muted/10 hover:bg-muted/20 text-foreground border border-border rounded-xl py-3 px-6 transition-all duration-300"
          >
            Others (Enter manually)
          </Button>
        )}
      </div>
    </div>
  ];

  return (
    <div className="min-h-screen login-container relative overflow-hidden">
      {/* Progress Indicator */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex space-x-3">
          {Array.from({ length: totalCards }).map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentCard
                  ? "bg-primary shadow-lg shadow-primary/50"
                  : "bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      {currentCard > 0 && (
        <button
          onClick={() => handleSwipe('right')}
          className="absolute left-6 top-1/2 transform -translate-y-1/2 z-20 bg-muted/10 hover:bg-muted/20 text-foreground p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}
      
      {currentCard < totalCards - 1 && (
        <button
          onClick={() => handleSwipe('left')}
          className="absolute right-6 top-1/2 transform -translate-y-1/2 z-20 bg-muted/10 hover:bg-muted/20 text-foreground p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Cards Container */}
      <div className="flex transition-transform duration-500 ease-out h-screen"
           style={{ transform: `translateX(-${currentCard * 100}%)` }}>
        {cards.map((card, index) => (
          <div
            key={index}
            className="min-w-full flex items-center justify-center px-8 py-12"
          >
            <div className="w-full max-w-2xl mx-auto">
              {card}
            </div>
          </div>
        ))}
      </div>

      {/* Swipe Instructions */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center text-muted-foreground text-sm">
        <p>← Swipe or use arrow keys to navigate →</p>
      </div>
    </div>
  );
};

export default Index;