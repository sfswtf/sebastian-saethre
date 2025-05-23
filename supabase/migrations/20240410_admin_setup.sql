-- Create a function to handle setting initial admin status
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, is_admin)
  values (new.id, new.email, false);
  return new;
end;
$$ language plpgsql security definer;

-- Ensure trigger exists for new users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Update profiles table to ensure email field exists
alter table public.profiles
add column if not exists email text;

-- Create allowed_admins table to manage who can be an admin
create table if not exists public.allowed_admins (
  email text primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up RLS for allowed_admins
alter table public.allowed_admins enable row level security;

-- Only admins can manage the allowed_admins table
create policy "Admins can manage allowed_admins"
on public.allowed_admins
for all
to authenticated
using (exists (
  select 1 from public.profiles
  where profiles.id = auth.uid()
  and profiles.is_admin = true
));

-- Function to automatically set admin status if email is in allowed_admins
create or replace function public.check_and_set_admin_status()
returns trigger as $$
begin
  if exists (select 1 from public.allowed_admins where email = new.email) then
    new.is_admin := true;
  end if;
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to check and set admin status on profile updates
drop trigger if exists check_admin_status on public.profiles;
create trigger check_admin_status
  before insert or update of email on public.profiles
  for each row execute procedure public.check_and_set_admin_status();

-- Insert initial admin email (replace with your admin email)
insert into public.allowed_admins (email)
values ('your-admin-email@example.com')
on conflict (email) do nothing; 