-- Drop existing enum type if it exists
drop type if exists message_status cascade;

-- Create enum type for message status
create type message_status as enum ('new', 'in_progress', 'completed');

-- First, add a temporary column with the new type
alter table contact_messages 
  add column status_new message_status;

-- Update the temporary column with converted values
update contact_messages
set status_new = case 
  when status = 'new' then 'new'::message_status
  when status = 'in_progress' then 'in_progress'::message_status
  when status = 'completed' then 'completed'::message_status
  else 'new'::message_status
end;

-- Drop the old status column
alter table contact_messages 
  drop column status;

-- Rename the new status column
alter table contact_messages 
  rename column status_new to status;

-- Create table for managing page content
create table if not exists page_content (
  id uuid default gen_random_uuid() primary key,
  page_id text not null,
  section_id text not null,
  title text,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(page_id, section_id)
);

-- Add RLS policies for page_content
alter table page_content enable row level security;

-- Allow anyone to read page content
create policy "Anyone can read page content"
on page_content for select
to anon
using (true);

-- Only admins can edit page content
create policy "Only admins can edit page content"
on page_content for all
to authenticated
using (
  exists (
    select 1 from profiles
    where profiles.id = auth.uid()
    and profiles.is_admin = true
  )
);

-- Function to update the updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Trigger to automatically update updated_at
create trigger update_page_content_updated_at
  before update on page_content
  for each row
  execute function update_updated_at_column();

-- Insert initial content for membership benefits
insert into page_content (page_id, section_id, title, content)
values 
  ('membership', 'benefits', 'Medlemskaps Fordeler', 
   'Her er fordelene med å være medlem i Hovden Musikklubb...')
on conflict (page_id, section_id) 
do update set 
  title = EXCLUDED.title,
  content = EXCLUDED.content; 