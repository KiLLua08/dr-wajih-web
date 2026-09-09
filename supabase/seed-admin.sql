-- One-time admin bootstrap for rayen08yako@gmail.com
-- 1) Sign up at /auth with this email + any password
-- 2) Run this in Supabase SQL Editor (or via supabase db execute)
--    Replace the email if you need a different admin.

-- Promote existing user to admin (idempotent)
insert into public.user_roles (user_id, role)
select id, 'admin'::public.app_role
from auth.users
where email = 'rayen08yako@gmail.com'
on conflict (user_id, role) do nothing;

-- Verify
select u.email, ur.role, ur.created_at
from auth.users u
join public.user_roles ur on ur.user_id = u.id
where u.email = 'rayen08yako@gmail.com';
