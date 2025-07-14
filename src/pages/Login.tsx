import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { Chrome, Mail, Lock, User, CreditCard } from 'lucide-react'

const Login = () => {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleGoogleLogin = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
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

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#ff9966] via-[#ff5e62] via-[#8a60ff] via-[#69c0ff] to-[#f5f7fa] opacity-90" />
      
      {/* Blurred glow effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#ff9966] rounded-full blur-3xl opacity-30 animate-pulse" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#8a60ff] rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-[#69c0ff] rounded-full blur-3xl opacity-25" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
        {/* Logo */}
        <div className="absolute top-8 left-8">
          <h1 className="text-2xl font-bold text-white">QuickCash</h1>
        </div>

        {/* Main Content */}
        <div className="text-center space-y-8 max-w-md">
          {/* Welcome Text */}
          <div className="space-y-4">
            <h2 className="text-5xl font-bold text-white text-glow">
              Welcome to QuickCash
            </h2>
            <p className="text-xl text-white/90">
              Fast student loans. No credit score required.
            </p>
          </div>

          {/* Google Login Button */}
          <div className="space-y-6">
            <Button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full h-14 text-lg font-semibold bg-white/95 text-gray-900 border-2 border-primary hover:bg-white hover:text-primary hover:border-primary transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/25"
            >
              <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {loading ? 'Signing in...' : 'Continue with Google'}
            </Button>
          </div>

          {/* Footer */}
          <p className="text-white/70 text-sm mt-8">
            Powered by Google OAuth
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login