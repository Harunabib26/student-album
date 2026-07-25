import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import Footer from './components/Footer'
import ProfileSetup from './pages/ProfileSetup'
import MyAlbum from './pages/MyAlbum'
import Directory from './pages/Directory'
import StudentProfile from './pages/StudentProfile'
import { useAuth } from './lib/useAuth'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'


function ProtectedRoute({ user, children }) {
  if (!user) {
    return <Navigate to="/login" replace />
  }
  return children
}

export default function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return <p className="text-center mt-16">Loading…</p>
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar user={user} />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Navigate to={user ? "/directory" : "/login"} replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/profile-setup"
            element={
              <ProtectedRoute user={user}>
                <ProfileSetup />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-album"
            element={
              <ProtectedRoute user={user}>
                <MyAlbum />
              </ProtectedRoute>
            }
          />
          <Route
            path="/directory"
            element={
              <ProtectedRoute user={user}>
                <Directory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/:id"
            element={
              <ProtectedRoute user={user}>
                <StudentProfile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <footer className="border-t-2 border-ink bg-cream py-6 text-center text-xs font-semibold uppercase tracking-wider text-ink-light">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[10px]">Al-Qalam University Katsina &bull; CS '26</p>
          <p>Developed by Haruna Ibrahim 1129</p>
        </div>
      </footer>
    </div>
  )
}
