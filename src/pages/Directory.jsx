import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export default function Directory() {
  const [students, setStudents] = useState([])
  const [thumbs, setThumbs] = useState({})
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('students')
        .select('*')
        .order('full_name', { ascending: true })
      setStudents(data || [])

      // Grab one cover photo per student for the corkboard preview
      const { data: photoData } = await supabase
        .from('photos')
        .select('student_id, photo_url, created_at')
        .order('created_at', { ascending: true })

      const cover = {}
      photoData?.forEach((p) => {
        if (!cover[p.student_id]) cover[p.student_id] = p.photo_url
      })
      setThumbs(cover)
      setLoading(false)
    }
    load()
  }, [])

  const filtered = students.filter((s) => {
    const q = search.toLowerCase()
    return (
      s.full_name?.toLowerCase().includes(q) ||
      s.reg_number?.toLowerCase().includes(q) ||
      s.nickname?.toLowerCase().includes(q)
    )
  })

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {/* Official Department Banner */}
      <div className="bg-cream border-2 border-ink p-6 md:p-8 mb-8 shadow-polaroid relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="seal px-3 py-0.5 text-xs font-semibold">
                🎓 Class of 2026
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-brass">
                Department of Computer Science
              </span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-ink tracking-tight">
              Al-Qalam University Katsina
            </h1>
            <p className="text-sm text-ink-light mt-1 font-body">
              Official Student Directory &amp; Digital Yearbook
            </p>
          </div>
          <div className="text-left md:text-right border-t md:border-t-0 md:border-l-2 border-brass/40 pt-3 md:pt-0 md:pl-6">
            <p className="text-3xl font-display font-bold text-brass leading-none">
              {students.length}
            </p>
            <p className="text-[11px] text-ink-light uppercase tracking-wider font-semibold mt-1">
              Registered Students
            </p>
          </div>
        </div>
      </div>

      <input
        type="text"
        placeholder="Search by name, reg number, or nickname…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border-2 border-ink/30 focus:border-brass outline-none px-4 py-2.5 bg-cream mb-8"
      />

      {loading ? (
        <p>Loading…</p>
      ) : filtered.length === 0 ? (
        <p className="text-ink-light italic">No students match your search.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
          {filtered.map((s, i) => {
            const rot = (i % 2 === 0 ? -1 : 1) * (1.5 + (i % 3));
            return (
              <Link
                key={s.id}
                to={`/student/${s.id}`}
                className="polaroid block"
                style={{
                  '--rotation': `${rot}deg`,
                  '--hover-rotation': `${rot * -0.5}deg`,
                  '--delay': `${i * 60}ms`,
                }}
              >
              <div className="w-full aspect-square bg-parchment-dark overflow-hidden">
                {thumbs[s.id] ? (
                  <img src={thumbs[s.id]} alt={s.full_name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-ink-light text-sm">
                    No photo yet
                  </div>
                )}
              </div>
              <p className="text-sm text-center mt-2 font-medium">{s.full_name}</p>
              <p className="text-xs text-center text-ink-light">{s.reg_number}</p>
            </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
