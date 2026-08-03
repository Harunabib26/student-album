import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export default function ProfileSetup() {
  const [form, setForm] = useState({
    full_name: '',
    reg_number: '',
    address: '',
    nickname: '',
    advice: '',
    phone_number: '',
    social_handle: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Pre-fill if a profile already exists (editing)
    async function loadExisting() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return navigate('/login')
      const { data } = await supabase
        .from('students')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()
      if (data) setForm({ ...form, ...data })
    }
    loadExisting()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setError('You must be signed in.')
      setLoading(false)
      return
    }

    const { error } = await supabase.from('students').upsert(
      {
        user_id: user.id,
        full_name: form.full_name,
        reg_number: form.reg_number,
        address: form.address,
        nickname: form.nickname,
        advice: form.advice,
        phone_number: form.phone_number,
        social_handle: form.social_handle,
      },
      { onConflict: 'user_id' }
    )

    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      navigate('/my-album')
    }
  }

  return (
    <div className="max-w-lg mx-auto mt-12 px-6 mb-16">
      <div className="bg-cream border-2 border-ink p-8 shadow-polaroid">
        <p className="seal px-3 py-1 mb-4 w-fit">Your yearbook page</p>
        <h1 className="font-display text-3xl font-bold text-ink mb-2">Tell us about you</h1>
        <p className="text-sm text-ink-light mb-6">
          This info appears on your public album page.
        </p>

        {error && (
          <p className="bg-maroon/10 border border-maroon text-maroon text-sm px-3 py-2 mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full name</label>
            <input
              name="full_name"
              required
              value={form.full_name}
              onChange={handleChange}
              className="w-full border-2 border-ink/30 focus:border-brass outline-none px-3 py-2 bg-parchment"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Registration number</label>
            <input
              name="reg_number"
              required
              value={form.reg_number}
              onChange={handleChange}
              className="w-full border-2 border-ink/30 focus:border-brass outline-none px-3 py-2 bg-parchment"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Nickname</label>
            <input
              name="nickname"
              value={form.nickname}
              onChange={handleChange}
              className="w-full border-2 border-ink/30 focus:border-brass outline-none px-3 py-2 bg-parchment"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              className="w-full border-2 border-ink/30 focus:border-brass outline-none px-3 py-2 bg-parchment"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone Number</label>
            <input
              name="phone_number"
              type="tel"
              placeholder="e.g. +234 801 234 5678"
              value={form.phone_number}
              onChange={handleChange}
              className="w-full border-2 border-ink/30 focus:border-brass outline-none px-3 py-2 bg-parchment"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Social Media Handle (Instagram/Twitter)</label>
            <input
              name="social_handle"
              type="text"
              placeholder="e.g. @yourhandle"
              value={form.social_handle}
              onChange={handleChange}
              className="w-full border-2 border-ink/30 focus:border-brass outline-none px-3 py-2 bg-parchment"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Word of advice <span className="text-ink-light font-normal">(your motto, for the class to remember you by)</span>
            </label>
            <textarea
              name="advice"
              rows={3}
              value={form.advice}
              onChange={handleChange}
              placeholder="e.g. Consistency beats talent."
              className="w-full border-2 border-ink/30 focus:border-brass outline-none px-3 py-2 bg-parchment resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-ink text-cream py-2.5 font-medium hover:bg-brass hover:text-ink transition-colors disabled:opacity-50"
          >
            {loading ? 'Saving…' : 'Save profile'}
          </button>
        </form>
      </div>
    </div>
  )
}
