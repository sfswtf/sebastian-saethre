-- View all membership applications in a nicely formatted way
SELECT 
    name,
    email,
    phone,
    age_group,
    music_genres,
    motivation,
    status,
    created_at::date as application_date
FROM membership_applications
ORDER BY created_at DESC;  -- Shows newest applications first 