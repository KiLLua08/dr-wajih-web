-- Enable extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- Patients table
create table if not exists public.patients (
  id uuid default gen_random_uuid() primary key,
  full_name varchar(255) not null,
  email varchar(255) not null,
  phone varchar(30) not null,
  date_of_birth date,
  gender varchar(10),
  address varchar(255),
  created_at timestamp default now(),
  updated_at timestamp default now(),
  unique(email, phone)
);

-- Services table
create table if not exists public.services (
  id uuid default gen_random_uuid() primary key,
  name_fr varchar(255) not null,
  name_ar varchar(255) not null,
  description_fr text,
  description_ar text,
  duration_min integer not null default 30,
  price_tnd decimal(10, 2),
  is_active boolean default true,
  sort_order integer default 0,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- Appointments table
create table if not exists public.appointments (
  id uuid default gen_random_uuid() primary key,
  patient_id uuid not null references public.patients on delete cascade,
  service_id uuid not null references public.services on delete restrict,
  appointment_date date not null,
  appointment_time time not null,
  status varchar(50) default 'pending', -- pending, confirmed, completed, cancelled, no-show
  language varchar(10) default 'fr',
  patient_notes text,
  admin_notes text,
  created_at timestamp default now(),
  updated_at timestamp default now(),
  unique(appointment_date, appointment_time)
);

-- Clinic hours table
create table if not exists public.clinic_hours (
  id uuid default gen_random_uuid() primary key,
  day_of_week integer not null, -- 0=Sunday, 6=Saturday
  open_time time not null,
  close_time time not null,
  is_closed boolean default false,
  created_at timestamp default now(),
  updated_at timestamp default now(),
  unique(day_of_week)
);

-- Blocked slots table
create table if not exists public.blocked_slots (
  id uuid default gen_random_uuid() primary key,
  blocked_date date not null,
  blocked_time time,
  reason varchar(255),
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- Testimonials table
create table if not exists public.testimonials (
  id uuid default gen_random_uuid() primary key,
  patient_name varchar(255) not null,
  content_fr text not null,
  content_ar text not null,
  rating integer default 5 check (rating >= 1 and rating <= 5),
  is_published boolean default false,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- Admin users table
create table if not exists public.admin_users (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null unique,
  email varchar(255) not null unique,
  role varchar(50) default 'admin', -- admin, staff
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- Enable RLS
alter table public.patients enable row level security;
alter table public.services enable row level security;
alter table public.appointments enable row level security;
alter table public.clinic_hours enable row level security;
alter table public.blocked_slots enable row level security;
alter table public.testimonials enable row level security;
alter table public.admin_users enable row level security;

-- RLS Policies for public access to services and testimonials
create policy "Services are viewable by everyone" on public.services
  for select using (is_active = true);

create policy "Published testimonials are viewable by everyone" on public.testimonials
  for select using (is_published = true);

create policy "Clinic hours are viewable by everyone" on public.clinic_hours
  for select using (true);

-- RLS Policies for appointments
create policy "Appointments can be inserted by anyone" on public.appointments
  for insert with check (true);

create policy "Appointments can be selected by admin" on public.appointments
  for select using (exists(select 1 from public.admin_users where user_id = auth.uid()));

-- RLS Policies for admin access
create policy "Admin users can manage everything" on public.admin_users
  for select using (auth.uid() = user_id or exists(select 1 from public.admin_users where user_id = auth.uid()));

create policy "Only admins can insert admin users" on public.admin_users
  for insert with check (exists(select 1 from public.admin_users where user_id = auth.uid()));

-- Insert default clinic hours (9 AM - 6 PM, closed on Sundays)
insert into public.clinic_hours (day_of_week, open_time, close_time, is_closed) values
  (0, '09:00', '18:00', true),   -- Sunday: Closed
  (1, '09:00', '18:00', false),  -- Monday
  (2, '09:00', '18:00', false),  -- Tuesday
  (3, '09:00', '18:00', false),  -- Wednesday
  (4, '09:00', '18:00', false),  -- Thursday
  (5, '09:00', '18:00', false),  -- Friday
  (6, '09:00', '18:00', false)   -- Saturday
on conflict (day_of_week) do nothing;

-- Insert default services
insert into public.services (name_fr, name_ar, description_fr, description_ar, duration_min, sort_order) values
  ('Détartrage et polissage', 'تنظيف الأسنان والتلميع', 'Nettoyage professionnel des dents, détartrage et polissage pour une meilleure hygiène buccale.', 'التنظيف المهني للأسنان والتنظيف من الجير والتلميع لصحة الفم الأفضل.', 30, 1),
  ('Traitement de caries', 'علاج التسوس', 'Traitement des caries dentaires avec des matériaux de remplissage modernes et durables.', 'معالجة تسوس الأسنان بمواد حشو حديثة ومتينة.', 45, 2),
  ('Dévitalisation (traitement de canal)', 'علاج اللب (معالجة القناة)', 'Traitement endodontique pour sauver les dents infectées ou endommagées.', 'العلاج اللبي لإنقاذ الأسنان المصابة أو التالفة.', 60, 3),
  ('Détartrage parodontal', 'التنظيف تحت اللثة', 'Traitement des maladies des gencives et détartrage en profondeur.', 'معالجة أمراض اللثة والتنظيف العميق للجير.', 45, 4),
  ('Blanchiment dentaire', 'تبييض الأسنان', 'Blanchiment professionnel des dents pour un sourire plus radieux.', 'تبييض احترافي للأسنان للحصول على ابتسامة أكثر إشراقاً.', 60, 5),
  ('Pose de couronnes', 'تركيب التيجان', 'Fabrication et pose de couronnes dentaires pour restaurer les dents endommagées.', 'تصنيع وتركيب التيجان السنية لاستعادة الأسنان التالفة.', 90, 6),
  ('Extraction dentaire', 'خلع الأسنان', 'Extraction sûre et indolore de dents problématiques ou de sagesse.', 'خلع آمن وغير مؤلم للأسنان المشكوك فيها أو أسنان الحكمة.', 45, 7),
  ('Pose d\'implant', 'تركيب الزرعات', 'Implantation dentaire pour remplacer les dents manquantes.', 'زراعة الأسنان لاستبدال الأسنان المفقودة.', 120, 8),
  ('Détection et prévention du cancer buccal', 'الكشف والوقاية من سرطان الفم', 'Examen de dépistage complet pour la détection précoce des problèmes bucco-dentaires.', 'فحص شامل للكشف المبكر عن مشاكل الفم والأسنان.', 30, 9)
on conflict do nothing;

-- Create indexes for performance
create index if not exists idx_appointments_date on public.appointments(appointment_date);
create index if not exists idx_appointments_patient on public.appointments(patient_id);
create index if not exists idx_appointments_status on public.appointments(status);
create index if not exists idx_blocked_slots_date on public.blocked_slots(blocked_date);
