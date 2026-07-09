import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function PhotoUpload({ studentId, onUploaded }) {
  const [uploading, setUploading] = useState(false)
  const [caption, setCaption] = useState('')
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')

  async function handleUpload(e) {
    e.preventDefault()
    if (!file) return
    setError('')
    setUploading(true)

    const ext = file.name.split('.').pop()
    const path = `${studentId}/${Date.now()}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('album-photos')
      .upload(path, file)

    if (uploadError) {
      setError(uploadError.message)
      setUploading(false)
      return
    }

    const { data: urlData } = supabase.storage
      .from('album-photos')
      .getPublicUrl(path)

    const { error: dbError } = await supabase.from('photos').insert({
      student_id: studentId,
      photo_url: urlData.publicUrl,
      caption,
    })

    setUploading(false)
    if (dbError) {
      setError(dbError.message)
    } else {
      setFile(null)
      setCaption('')
      onUploaded?.()
    }
  }

  return (
    <form onSubmit={handleUpload} className="bg-cream border-2 border-dashed border-ink/40 p-5 space-y-3">
      {error && <p className="text-maroon text-sm">{error}</p>}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
        className="text-sm"
      />
      <input
        type="text"
        placeholder="Caption (optional)"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        className="w-full border-2 border-ink/30 focus:border-brass outline-none px-3 py-2 bg-parchment text-sm"
      />
      <button
        type="submit"
        disabled={!file || uploading}
        className="bg-ink text-cream px-4 py-2 text-sm font-medium hover:bg-brass hover:text-ink transition-colors disabled:opacity-50"
      >
        {uploading ? 'Uploading…' : 'Add to album'}
      </button>
    </form>
  )
}
