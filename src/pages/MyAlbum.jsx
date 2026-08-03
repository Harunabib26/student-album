import { useEffect, useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import PhotoUpload from '../components/PhotoUpload'
import PhotoGrid from '../components/PhotoGrid'
import PaymentCard from '../components/PaymentCard'

export default function MyAlbum() {
  const [student, setStudent] = useState(null)
  const [photos, setPhotos] = useState([])
  const [userEmail, setUserEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return navigate('/login')
    setUserEmail(user.email)

    const { data: studentData } = await supabase
      .from('students')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()

    if (!studentData) {
      navigate('/profile-setup')
      return
    }
    setStudent(studentData)

    const { data: photoData } = await supabase
      .from('photos')
      .select('*')
      .eq('student_id', studentData.id)
      .order('created_at', { ascending: false })

    setPhotos(photoData || [])
    setLoading(false)
  }, [navigate])

  useEffect(() => {
    load()
  }, [load])

  if (loading) return <p className="text-center mt-16">Loading your album…</p>

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="bg-cream border-2 border-ink p-8 mb-8 shadow-polaroid">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <p className="seal px-3 py-1 mb-3 w-fit">Reg No. {student.reg_number}</p>
            <h1 className="font-display text-3xl font-bold text-ink">{student.full_name}</h1>
            {student.nickname && (
              <p className="text-ink-light italic">"{student.nickname}"</p>
            )}
            {student.address && <p className="text-sm mt-2">📍 {student.address}</p>}
            {student.phone_number && (
              <p className="text-sm mt-1">📞 <a href={`tel:${student.phone_number}`} className="text-brass hover:underline">{student.phone_number}</a></p>
            )}
            {student.social_handle && (
              <p className="text-sm mt-1">
                📱 <span className="text-ink-light">Social:</span> <a href={`https://instagram.com/${student.social_handle.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-brass hover:underline">{student.social_handle}</a>
              </p>
            )}
          </div>
          <Link
            to="/profile-setup"
            className="text-sm border-2 border-ink px-4 py-2 hover:bg-ink hover:text-cream transition-colors"
          >
            Edit profile
          </Link>
        </div>
        {student.advice && (
          <blockquote className="mt-6 border-l-4 border-brass pl-4 font-display italic text-lg text-ink-light">
            "{student.advice}"
          </blockquote>
        )}
      </div>

      <h2 className="font-display text-2xl font-bold text-ink mb-4">My Album</h2>
      
      {photos.length >= 2 && !student.is_premium ? (
        <PaymentCard 
          studentId={student.id} 
          userEmail={userEmail} 
          onPaymentSuccess={load} 
        />
      ) : (
        <PhotoUpload studentId={student.id} onUploaded={load} />
      )}

      <PhotoGrid photos={photos} editable onDeleted={load} />
    </div>
  )
}
