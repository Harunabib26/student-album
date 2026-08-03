-- Run this in the Supabase SQL Editor (Project > SQL Editor > New query)

-- 1. Students table
create table if not exists students (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade unique not null,
  full_name text not null,
  reg_number text not null,
  address text,
  nickname text,
  advice text,
  phone_number text,
  social_handle text,
  is_premium boolean default false,
  created_at timestamp with time zone default now()
);

-- 2. Photos table
create table if not exists photos (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id) on delete cascade not null,
  photo_url text not null,
  caption text,
  created_at timestamp with time zone default now()
);

-- 3. Enable Row Level Security
alter table students enable row level security;
alter table photos enable row level security;

-- 4. Students policies
-- Anyone (including anonymous visitors) can view all student profiles — it's a public directory
create policy "Public read access to students"
  on students for select
  using (true);

-- A user can only insert/update/delete their own profile
create policy "Users can insert their own profile"
  on students for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own profile"
  on students for update
  using (auth.uid() = user_id);

create policy "Users can delete their own profile"
  on students for delete
  using (auth.uid() = user_id);

-- 5. Photos policies
-- Anyone can view all photos — public album
create policy "Public read access to photos"
  on photos for select
  using (true);

-- A user can only add photos to their own student record
create policy "Users can insert photos to their own album"
  on photos for insert
  with check (
    exists (
      select 1 from students
      where students.id = photos.student_id
      and students.user_id = auth.uid()
    )
  );

-- A user can only delete their own photos
create policy "Users can delete their own photos"
  on photos for delete
  using (
    exists (
      select 1 from students
      where students.id = photos.student_id
      and students.user_id = auth.uid()
    )
  );

-- 6. Storage bucket for photos
-- Go to Storage in the Supabase dashboard and create a bucket named "album-photos"
-- Set it to PUBLIC (so photo URLs work directly in <img> tags without extra auth).
-- Then run these storage policies:

create policy "Public read access to album photos"
  on storage.objects for select
  using (bucket_id = 'album-photos');

create policy "Authenticated users can upload album photos"
  on storage.objects for insert
  with check (bucket_id = 'album-photos' and auth.role() = 'authenticated');

create policy "Users can delete their own uploaded photos"
  on storage.objects for delete
  using (bucket_id = 'album-photos' and auth.role() = 'authenticated');
