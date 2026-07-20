import { useState } from 'react'
import imageCompression from 'browser-image-compression'
import { supabase } from '../lib/supabaseClient'

export default function PhotoUpload({ studentId, onUploaded }) {
  const [uploading, setUploading] = useState(false)
  const [compressing, setCompressing] = useState(false)
  const [caption, setCaption] = useState('')
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')
  const [originalSize, setOriginalSize] = useState(null)
  const [compressedSize, setCompressedSize] = useState(null)

  function handleFileChange(e) {
    const selected = e.target.files[0]
    if (selected) {
      setFile(selected)
      setOriginalSize((selected.size / 1024).toFixed(0)) // KB
      setCompressedSize(null)
    }
  }

  async function handleUpload(e) {
    e.preventDefault()
    if (!file) return
    setError('')

    // --- Compress ---
    setCompressing(true)
    let fileToUpload = file
    try {
      const options = {
        maxSizeMB: 0.5,       // target max 500 KB
        maxWidthOrHeight: 1200, // shrink large phone photos
        useWebWorker: true,
      }
      const compressed = await imageCompression(file, options)
      setCompressedSize((compressed.size / 1024).toFixed(0)) // KB
      fileToUpload = compressed
    } catch (err) {
      console.warn('Compression failed, uploading original:', err)
    }
    setCompressing(false)

    // --- Upload ---
    setUploading(true)
    const ext = file.name.split('.').pop()
    const path = `${studentId}/${Date.now()}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('album-photos')
      .upload(path, fileToUpload)

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
      setOriginalSize(null)
      setCompressedSize(null)
      onUploaded?.()
    }
  }

  const isBusy = compressing || uploading

  return (
    <form onSubmit={handleUpload} className="bg-cream border-2 border-dashed border-ink/40 p-5 space-y-3">
      {error && <p className="text-maroon text-sm">{error}</p>}

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="text-sm"
      />

      {/* Show compression info after a file is selected */}
      {originalSize && (
        <p className="text-xs text-ink-light">
          📷 Original size: <strong>{originalSize} KB</strong>
          {compressedSize && (
            <> → Compressed to: <strong className="text-brass">{compressedSize} KB</strong> ✅</>
          )}
        </p>
      )}

      <input
        type="text"
        placeholder="Caption (optional)"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        className="w-full border-2 border-ink/30 focus:border-brass outline-none px-3 py-2 bg-parchment text-sm"
      />
      <button
        type="submit"
        disabled={!file || isBusy}
        className="bg-ink text-cream px-4 py-2 text-sm font-medium hover:bg-brass hover:text-ink transition-colors disabled:opacity-50"
      >
        {compressing ? '🗜️ Compressing…' : uploading ? 'Uploading…' : 'Add to album'}
      </button>
    </form>
  )
}
