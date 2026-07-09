# Class Album — Student Directory App

A simple web app where students register, fill in their details (name, reg number,
address, nickname, word of advice), and build a personal photo album that's visible
in a public class directory.

**Stack:** React + Vite + Tailwind CSS + Supabase (Auth, Database, Storage)

---

## 1. Set up Supabase (free tier)

1. Go to [supabase.com](https://supabase.com) and create a free account + new project.
2. Wait for the project to finish provisioning (~2 min).
3. Go to **SQL Editor** → **New query**, paste the entire contents of `supabase.sql`
   from this project, and click **Run**. This creates the `students` and `photos`
   tables plus all security policies.
4. Go to **Storage** → **Create a new bucket** → name it exactly `album-photos` →
   toggle **Public bucket** ON → Create.
   (The storage policies in `supabase.sql` already assume this bucket name.)
5. Go to **Project Settings → API**. Copy:
   - **Project URL**
   - **anon public** key

## 2. Configure the app

1. Copy `.env.example` to `.env`:
   ```
   cp .env.example .env
   ```
2. Paste your Supabase URL and anon key into `.env`.

## 3. Run it locally

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

## 4. How it works

- **Register** → creates a Supabase Auth account
- **Profile setup** → fills in name, reg number, address, nickname, and a "word of
  advice" — saved to the `students` table
- **My Album** → upload photos (stored in Supabase Storage, linked in the `photos`
  table), view/remove them
- **Directory** → public grid of every registered student (searchable by name, reg
  number, or nickname) — click into anyone's page to view their bio + album
  (read-only for visitors)

## 5. Deploy for free

**Option A — Vercel**
1. Push this project to a GitHub repo.
2. Go to [vercel.com](https://vercel.com) → New Project → import the repo.
3. In the project's Environment Variables settings, add `VITE_SUPABASE_URL` and
   `VITE_SUPABASE_ANON_KEY` (same values as your `.env`).
4. Deploy. Vercel auto-detects Vite and builds it correctly.

**Option B — Netlify**
1. Push to GitHub.
2. Go to [netlify.com](https://netlify.com) → Add new site → Import from Git.
3. Build command: `npm run build` — Publish directory: `dist`
4. Add the same two environment variables under Site settings → Environment.
5. Deploy.

Either way, you'll have a live public URL within minutes, no cost.

## 6. Project structure

```
src/
  components/
    Navbar.jsx        - top navigation
    PhotoUpload.jsx    - upload form for adding a photo to an album
    PhotoGrid.jsx      - polaroid-style photo grid, used on both own + public pages
  pages/
    Login.jsx
    Register.jsx
    ProfileSetup.jsx   - bio form (name, reg number, address, nickname, advice)
    MyAlbum.jsx        - logged-in student's own album (editable)
    Directory.jsx      - public searchable grid of all students
    StudentProfile.jsx - public read-only view of one student's page
  lib/
    supabaseClient.js
    useAuth.js
  App.jsx              - routes
  main.jsx             - entry point, wraps app in BrowserRouter
supabase.sql            - run this once in Supabase's SQL editor
```

## 7. Notes for your report/demo

- **Auth:** handled entirely by Supabase Auth (email + password) — no custom
  password hashing/session code needed, but you can explain the underlying JWT
  session mechanism in your writeup.
- **Security:** Row Level Security (RLS) policies ensure a student can only edit
  their *own* profile/photos, even though anyone can *view* all profiles (since
  it's a public directory).
- **Storage:** photos live in Supabase Storage (S3-backed), not in the database —
  only the URL is stored in Postgres. This is the standard real-world pattern for
  handling file uploads.
