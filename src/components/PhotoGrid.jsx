import { supabase } from '../lib/supabaseClient'

export default function PhotoGrid({ photos, editable, onDeleted }) {
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
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 py-6">
      {photos.map((photo, i) => {
        const rot = (i % 2 === 0 ? -1 : 1) * (1.5 + (i % 3));
        return (
          <div
            key={photo.id}
            className="polaroid"
            style={{
              '--rotation': `${rot}deg`,
              '--hover-rotation': `${rot * -0.5}deg`,
              '--delay': `${i * 60}ms`,
            }}
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
  )
}
