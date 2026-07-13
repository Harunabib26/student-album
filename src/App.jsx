import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import ProfileSetup from './pages/ProfileSetup'
import MyAlbum from './pages/MyAlbum'
import Directory from './pages/Directory'
import StudentProfile from './pages/StudentProfile'
import { useAuth } from './lib/useAuth'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'


export default function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return <p className="text-center mt-16">Loading…</p>
  }

  return (
    <>
      <Navbar user={user} />
      <Routes>
        <Route path="/" element={<Navigate to="/directory" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/profile-setup" element={<ProfileSetup />} />
        <Route path="/my-album" element={<MyAlbum />} />
        <Route path="/directory" element={<Directory />} />
        <Route path="/student/:id" element={<StudentProfile />} />
      </Routes>
    </>
  )
}
