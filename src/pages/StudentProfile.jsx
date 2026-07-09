import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import PhotoGrid from '../components/PhotoGrid'

export default function StudentProfile() {
  const { id } = useParams()
  const [student, setStudent] = useState(null)
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: studentData } = await supabase
        .from('students')
        .select('*')
        .eq('id', id)
        .maybeSingle()

      if (!studentData) {
        setNotFound(true)
        setLoading(false)
        return
      }
      setStudent(studentData)

      const { data: photoData } = await supabase
        .from('photos')
        .select('*')
        .eq('student_id', id)
        .order('created_at', { ascending: false })

      setPhotos(photoData || [])
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) return <p className="text-center mt-16">Loading album…</p>
  if (notFound) {
    return (
      <div className="text-center mt-16">
        <p className="mb-4">This student's page doesn't exist.</p>
        <Link to="/directory" className="text-brass hover:underline">
          Back to directory
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="bg-cream border-2 border-ink p-8 mb-8 shadow-polaroid">
        <p className="seal px-3 py-1 mb-3 w-fit">Reg No. {student.reg_number}</p>
        <h1 className="font-display text-3xl font-bold text-ink">{student.full_name}</h1>
        {student.nickname && (
          <p className="text-ink-light italic">"{student.nickname}"</p>
        )}
        {student.address && <p className="text-sm mt-2">{student.address}</p>}
        {student.advice && (
          <blockquote className="mt-6 border-l-4 border-brass pl-4 font-display italic text-lg text-ink-light">
            "{student.advice}"
          </blockquote>
        )}
      </div>

      <h2 className="font-display text-2xl font-bold text-ink mb-4">Album</h2>
      <PhotoGrid photos={photos} />
    </div>
  )
}
