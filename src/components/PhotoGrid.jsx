import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function PhotoGrid({ photos, editable, onDeleted }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null)

  async function handleDelete(photo) {
    await supabase.from('photos').delete().eq('id', photo.id)
    onDeleted?.()
  }

  if (!photos?.length) {
    return (
      <p className="text-ink-light text-sm italic py-8 text-center">
        No photos yet — this album page is still blank.
      </p>
    )
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 py-6">
        {photos.map((photo, i) => {
          const rot = (i % 2 === 0 ? -1 : 1) * (1.5 + (i % 3));
          return (
            <div
              key={photo.id}
              className="polaroid cursor-pointer"
            style={{
              '--rotation': `${rot}deg`,
              '--hover-rotation': `${rot * -0.5}deg`,
              '--delay': `${i * 60}ms`,
            }}
            onClick={() => setSelectedPhoto(photo)}
          >
          <img
            src={photo.photo_url}
            alt={photo.caption || 'Album photo'}
            className="w-full aspect-square object-cover"
          />
          {photo.caption && (
            <p className="text-xs text-center mt-2 font-body text-ink-light">
              {photo.caption}
            </p>
          )}
          {editable && (
            <button
              onClick={() => handleDelete(photo)}
              className="text-xs text-maroon mt-1 w-full hover:underline"
            >
              Remove
            </button>
          )}
        </div>
        )
        })}
      </div>

      {/* Full-screen Lightbox Modal */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div 
            className="relative max-w-4xl w-full max-h-screen flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="absolute -top-10 right-0 text-white text-xl font-bold hover:text-gray-300"
              onClick={() => setSelectedPhoto(null)}
            >
              &times; Close
            </button>
            <img 
              src={selectedPhoto.photo_url} 
              alt={selectedPhoto.caption || 'Full screen photo'}
              className="max-w-full max-h-[80vh] object-contain border-4 border-white shadow-2xl"
            />
            {selectedPhoto.caption && (
              <p className="text-white mt-4 text-lg bg-black/50 px-4 py-2 rounded">
                {selectedPhoto.caption}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  )
}
