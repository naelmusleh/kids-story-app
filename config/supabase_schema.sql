-- Users table (auth handled by Supabase Auth)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  plan_tier text default 'free',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Projects table
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  title text,
  input_language text,
  selected_languages text[],
  status text default 'draft',
  video_url text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Scenes per project
create table if not exists scenes (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  scene_number integer,
  description text,
  image_url text,
  narration_text text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);