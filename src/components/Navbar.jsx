import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export default function Navbar({ user }) {
  const navigate = useNavigate()

  async function handleSignOut() {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <nav className="border-b-2 border-ink bg-cream/90 backdrop-blur sticky top-0 z-20">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 font-display tracking-tight group">
          <img src="/logo.svg" alt="Class Album logo" className="w-8 h-8 group-hover:rotate-6 transition-transform" />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-ink leading-tight">Class Album</span>
              <span className="seal text-[10px] px-2 py-0.5 font-body font-semibold">
                Class of 2026
              </span>
            </div>
            <span className="text-[10px] font-body text-brass font-bold tracking-wider uppercase">
              Al-Qalam University Katsina &bull; Computer Science
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-6 font-body text-sm">
          <Link to="/directory" className="hover:text-brass transition-colors">
            Directory
          </Link>
          {user ? (
            <>
              <Link to="/my-album" className="hover:text-brass transition-colors">
                My Album
              </Link>
              <button
                onClick={handleSignOut}
                className="text-maroon hover:text-brass transition-colors"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-brass transition-colors">
                Sign in
              </Link>
              <Link
                to="/register"
                className="bg-ink text-cream px-4 py-1.5 rounded-sm hover:bg-brass hover:text-ink transition-colors"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
