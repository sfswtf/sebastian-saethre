-- Create the social_media_posts table
create table public.social_media_posts (
    id uuid primary key default uuid_generate_v4(),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    platform text not null check (platform in ('instagram', 'youtube', 'tiktok', 'image')),
    url text not null,
    title text not null,
    display_order integer not null,
    active boolean default true not null
);

-- Enable RLS
alter table public.social_media_posts enable row level security;

-- Create policies
create policy "Anyone can view active social media posts"
    on public.social_media_posts
    for select
    using (active = true);

create policy "Only authenticated users can manage social media posts"
    on public.social_media_posts
    for all
    using (auth.role() = 'authenticated')
    with check (auth.role() = 'authenticated'); 