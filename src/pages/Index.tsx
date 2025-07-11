import { Button } from "@/components/ui/button";

const Index = () => {
  const handleGoogleLogin = () => {
    // TODO: Implement Google OAuth
    console.log("Google login clicked");
  };

  return (
    <div className="min-h-screen login-container flex flex-col items-center justify-center relative">
      {/* Animated Light Streaks */}
      <div className="light-streak"></div>
      <div className="light-streak"></div>
      <div className="light-streak"></div>
      <div className="light-streak"></div>
      
      {/* Main Content */}
      <div className="flex flex-col items-center justify-center space-y-12 z-10 px-8">
        {/* App Logo */}
        <div className="text-center slide-down">
          <h1 className="text-6xl md:text-7xl font-black text-pure-white logo-glow tracking-tight">
            QuickCash
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-electric-blue to-transparent mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Google Login Button */}
        <div className="slide-down-delayed">
          <Button
            onClick={handleGoogleLogin}
            className="ripple-effect bg-pure-white text-gray-900 hover:bg-gray-100 border-2 border-transparent hover:border-electric-blue/20 px-8 py-6 text-lg font-semibold rounded-2xl shadow-2xl transition-all duration-300 ease-out transform hover:scale-105 hover:shadow-electric-blue/20 min-w-[280px] group"
          >
            <svg 
              className="w-6 h-6 mr-3 transition-transform duration-300 group-hover:scale-110" 
              viewBox="0 0 24 24"
            >
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>
        </div>

        {/* Subtle Footer Text */}
        <div className="text-center space-y-2 opacity-60 slide-down-delayed">
          <p className="text-sm text-pure-white/70">
            Fast, secure, and trusted by millions
          </p>
          <div className="flex items-center justify-center space-x-4 text-xs text-pure-white/50">
            <span>🔒 Bank-level security</span>
            <span>⚡ Instant approval</span>
            <span>📱 Mobile-first</span>
          </div>
        </div>
      </div>

      {/* Glossy Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-pure-white/[0.02] to-transparent pointer-events-none"></div>
    </div>
  );
};

export default Index;
