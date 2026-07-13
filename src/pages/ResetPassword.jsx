import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Supabase automatically exchanges the reset-link token for a temporary
    // session when the user lands on this page via the emailed link.
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setReady(true)
      }
    })

    // Also check in case the event already fired before this component mounted
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)

    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
      setTimeout(() => navigate('/my-album'), 2000)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-16 px-6">
      <div className="bg-cream border-2 border-ink p-8 shadow-polaroid">
        <p className="seal px-3 py-1 mb-4 w-fit">Set new password</p>
        <h1 className="font-display text-3xl font-bold text-ink mb-6">
          Reset your password
        </h1>

        {!ready && !success && (
          <p className="text-sm text-ink-light">
            Verifying your reset link… If nothing happens, make sure you opened
            this page from the link in your email, not a bookmark.
          </p>
        )}

        {error && (
          <p className="bg-maroon/10 border border-maroon text-maroon text-sm px-3 py-2 mb-4">
            {error}
          </p>
        )}

        {success ? (
          <p className="bg-brass/10 border border-brass text-ink text-sm px-3 py-3">
            Password updated. Redirecting you to your album…
          </p>
        ) : (
          ready && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">New password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-2 border-ink/30 focus:border-brass outline-none px-3 py-2 bg-parchment"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Confirm password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="w-full border-2 border-ink/30 focus:border-brass outline-none px-3 py-2 bg-parchment"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-ink text-cream py-2.5 font-medium hover:bg-brass hover:text-ink transition-colors disabled:opacity-50"
              >
                {loading ? 'Updating…' : 'Update password'}
              </button>
            </form>
          )
        )}
      </div>
    </div>
  )
}
