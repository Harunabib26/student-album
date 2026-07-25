export default function Footer() {
  return (
    <footer className="border-t-2 border-ink mt-16 bg-cream/60">
      <div className="max-w-5xl mx-auto px-6 py-6 text-center">
        <p className="text-sm text-ink-light">
          Developed by{' '}
          <span className="font-medium text-ink">Haruna Ibrahim</span> · 1129
        </p>
        <p className="text-xs text-ink-light/70 mt-1">
          &copy; {new Date().getFullYear()} Class Album. All rights reserved.
        </p>
      </div>
    </footer>
  )
}