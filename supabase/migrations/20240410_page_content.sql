-- Create the page_content table
create table public.page_content (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    page_id text not null,
    section_id text not null,
    title text,
    content text not null,
    unique(page_id, section_id)
);

-- Enable RLS
alter table public.page_content enable row level security;

-- Create policies
create policy "Allow public read access to page_content"
    on public.page_content
    for select
    to authenticated, anon
    using (true);

create policy "Allow admins to update page_content"
    on public.page_content
    for all
    to authenticated
    using (
        exists (
            select 1 from public.profiles
            where profiles.id = auth.uid()
            and profiles.is_admin = true
        )
    );

-- Create trigger for updated_at
create trigger handle_updated_at before update on public.page_content
    for each row execute procedure moddatetime (updated_at);

-- Insert initial content for About page
insert into public.page_content (page_id, section_id, title, content)
values (
    'about',
    'main',
    'Om Oss',
    'Hovden Musikklubb er en ideell organisasjon som ble stiftet i 2023. Vi er dedikert til å skape et levende musikkmiljø i Hovden og omegn.\n\nVår visjon er å bringe kvalitetsmusikk til fjells, og skape unike musikkopplevelser for både fastboende og besøkende.\n\nVi arrangerer konserter og musikalske events gjennom hele året, med fokus på variert musikk av høy kvalitet.\n\nBli medlem i dag og bli en del av vårt musikalske fellesskap!'
);

-- Insert initial content for Membership page
insert into public.page_content (page_id, section_id, title, content)
values (
    'membership',
    'main',
    'Medlemskap',
    'Som medlem i Hovden Musikklubb får du eksklusive fordeler og blir en viktig del av vårt musikalske fellesskap.\n\nMedlemsfordeler:\n- Rabatterte billetter til alle våre arrangementer\n- Førsterett på billetter til utvalgte konserter\n- Invitasjoner til medlemsarrangementer\n- Mulighet til å påvirke klubbens program og utvikling\n\nMedlemskapet koster kun kr 200,- per år.\n\nMeld deg inn i dag og bli en del av Hovdens mest spennende musikkmiljø!'
); 