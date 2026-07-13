import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      setSent(true)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-16 px-6">
      <div className="bg-cream border-2 border-ink p-8 shadow-polaroid">
        <p className="seal px-3 py-1 mb-4 w-fit">Account recovery</p>
        <h1 className="font-display text-3xl font-bold text-ink mb-2">
          Forgot your password?
        </h1>
        <p className="text-sm text-ink-light mb-6">
          Enter the email you registered with and we'll send you a reset link.
        </p>

        {error && (
          <p className="bg-maroon/10 border border-maroon text-maroon text-sm px-3 py-2 mb-4">
            {error}
          </p>
        )}

        {sent ? (
          <p className="bg-brass/10 border border-brass text-ink text-sm px-3 py-3">
            If that email is registered, a reset link has been sent. Check your
            inbox (and spam folder) and follow the link to set a new password.
          </p>
        ) : (
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
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-ink text-cream py-2.5 font-medium hover:bg-brass hover:text-ink transition-colors disabled:opacity-50"
            >
              {loading ? 'Sending…' : 'Send reset link'}
            </button>
          </form>
        )}

        <p className="text-sm mt-6 text-center">
          <Link to="/login" className="text-brass font-medium hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
