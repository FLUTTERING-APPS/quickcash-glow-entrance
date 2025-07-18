import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/integrations/supabase/client'

const AuthCallback = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth callback error:', error)
          navigate('/login')
          return
        }

        if (data.session) {
          navigate('/')
        } else {
          navigate('/login')
        }
      } catch (error) {
        console.error('Unexpected auth callback error:', error)
        navigate('/login')
      }
    }

    handleAuthCallback()
  }, [navigate])

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[hsl(var(--electric-blue))] border-t-transparent mx-auto mb-4"></div>
        <p className="text-white">Completing login...</p>
      </div>
    </div>
  )
}

export default AuthCallback