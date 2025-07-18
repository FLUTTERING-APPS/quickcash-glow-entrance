import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

const Login = () => {
  const [loading, setLoading] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    // Check for active session on load
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          navigate('/')
        }
      } catch (error) {
        console.error('Error checking session:', error)
      } finally {
        setCheckingSession(false)
      }
    }

    checkSession()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate('/')
      }
    })

    return () => subscription.unsubscribe()
  }, [navigate])

  const handleGoogleLogin = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'http://localhost:8080/auth/callback'
        }
      })
      
      if (error) {
        toast({
          title: "Login Error",
          description: error.message,
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Login Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[hsl(var(--electric-blue))] border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center">
      {/* Electric blue glow effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[hsl(var(--electric-blue))] rounded-full blur-3xl opacity-10 animate-pulse" />
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-[hsl(var(--electric-blue-glow))] rounded-full blur-3xl opacity-5" />
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-md px-8">
        {/* Logo/Title */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-white mb-4 glow-text">
            QuickCash
          </h1>
          <p className="text-xl text-white/80">
            Fast student loans. No credit required.
          </p>
        </div>

        {/* Google Login Button */}
        <div className="space-y-6">
          <Button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full h-16 text-lg font-bold bg-black border-2 border-[hsl(var(--electric-blue))] text-white hover:bg-[hsl(var(--electric-blue)_/_0.1)] transition-all duration-300 hover:scale-105 ripple-effect"
            style={{
              boxShadow: loading ? 'none' : '0 0 30px hsl(var(--electric-blue) / 0.5)',
            }}
          >
            <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {loading ? 'Connecting...' : 'Login with Google'}
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-white/60 text-sm">
            Secure authentication powered by Google
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login