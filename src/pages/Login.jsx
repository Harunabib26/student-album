import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      navigate('/my-album')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-16 px-6">
      <div className="bg-cream border-2 border-ink p-8 shadow-polaroid">
        <p className="seal px-3 py-1 mb-4 w-fit">Welcome back</p>
        <h1 className="font-display text-3xl font-bold text-ink mb-6">Sign in</h1>

        {error && (
          <p className="bg-maroon/10 border border-maroon text-maroon text-sm px-3 py-2 mb-4">
            {error}
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
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="text-sm mt-6 text-center">
          New here?{' '}
          <Link to="/register" className="text-brass font-medium hover:underline">
            Register your profile
          </Link>
        </p>
      </div>
    </div>
  )
}
