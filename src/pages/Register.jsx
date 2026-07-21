import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const [success, setSuccess] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    const { data, error } = await supabase.auth.signUp({ email, password })
    setLoading(false)
    
    if (error) {
      setError(error.message)
    } else if (data?.user && !data?.session) {
      setSuccess('Account created! Please check your email to confirm your registration before logging in.')
    } else {
      navigate('/profile-setup')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-16 px-6">
      <div className="bg-cream border-2 border-ink p-8 shadow-polaroid">
        <p className="seal px-3 py-1 mb-4 w-fit text-xs font-semibold">
          Al-Qalam University Katsina &bull; CS '26
        </p>
        <h1 className="font-display text-3xl font-bold text-ink mb-6">
          Register your page
        </h1>

        {error && (
          <p className="bg-maroon/10 border border-maroon text-maroon text-sm px-3 py-2 mb-4">
            {error}
          </p>
        )}

        {success && (
          <p className="bg-green-500/10 border border-green-500 text-green-700 text-sm px-3 py-2 mb-4">
            {success}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-2 border-ink/30 focus:border-brass outline-none px-3 py-2 bg-parchment"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-2 border-ink/30 focus:border-brass outline-none px-3 py-2 bg-parchment"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-ink text-cream py-2.5 font-medium hover:bg-brass hover:text-ink transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="text-sm mt-6 text-center">
          Already registered?{' '}
          <Link to="/login" className="text-brass font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
