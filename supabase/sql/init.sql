
-- Create type for user roles
create type user_type as enum ('passenger', 'driver', 'both');

-- Create profiles table
create table if not exists profiles (
    id uuid references auth.users on delete cascade primary key,
    username text unique,
    full_name text,
    user_type user_type default 'passenger',
    created_at timestamptz default now()
);

-- Create vehicles table
create table if not exists vehicles (
    id uuid primary key default gen_random_uuid(),
    owner_id uuid references auth.users on delete cascade,
    license_plate text unique,
    registration_date date,
    brand text,
    model text,
    color text,
    seats integer check (seats > 0),
    created_at timestamptz default now()
);

-- Create driver preferences table
create table if not exists driver_preferences (
    id uuid primary key default gen_random_uuid(),
    driver_id uuid references auth.users on delete cascade,
    smoking_allowed boolean default false,
    pets_allowed boolean default false,
    created_at timestamptz default now(),
    unique(driver_id)
);

-- Create custom preferences table
create table if not exists custom_preferences (
    id uuid primary key default gen_random_uuid(),
    driver_id uuid references auth.users on delete cascade,
    preference text not null,
    created_at timestamptz default now()
);

-- Enable Row Level Security
alter table profiles enable row level security;
alter table vehicles enable row level security;
alter table driver_preferences enable row level security;
alter table custom_preferences enable row level security;

-- Create policies
create policy "Users can view their own profile"
    on profiles for select
    using (auth.uid() = id);

create policy "Users can update their own profile"
    on profiles for update
    using (auth.uid() = id);

create policy "Users can view all vehicles"
    on vehicles for select
    using (true);

create policy "Users can manage their own vehicles"
    on vehicles for all
    using (auth.uid() = owner_id);

create policy "Users can view all driver preferences"
    on driver_preferences for select
    using (true);

create policy "Users can manage their own preferences"
    on driver_preferences for all
    using (auth.uid() = driver_id);

create policy "Users can view all custom preferences"
    on custom_preferences for select
    using (true);

create policy "Users can manage their own custom preferences"
    on custom_preferences for all
    using (auth.uid() = driver_id);

-- Create a trigger to create a profile when a user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, full_name)
  values (new.id, new.raw_user_meta_data->>'username', new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

-- Create the trigger
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
