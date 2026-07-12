-- Seed clinic hours and services (run after migration)
INSERT INTO public.clinic_hours (day_of_week, open_time, close_time, is_closed) VALUES
  (0, '09:00', '18:00', true),
  (1, '09:00', '18:00', false),
  (2, '09:00', '18:00', false),
  (3, '09:00', '18:00', false),
  (4, '09:00', '18:00', false),
  (5, '09:00', '18:00', false),
  (6, '09:00', '18:00', false)
ON CONFLICT (day_of_week) DO NOTHING;

INSERT INTO public.services (slug, name_fr, name_en, name_ar, description_fr, description_en, description_ar, duration_min, sort_order) VALUES
  ('detartrage', 'Détartrage et polissage', 'Scaling and polishing', 'تنظيف الأسنان والتلميع', 'Nettoyage professionnel des dents, détartrage et polissage.', 'Professional teeth cleaning, scaling and polishing.', 'التنظيف المهني للأسنان والتنظيف من الجير والتلميع.', 30, 1),
  ('caries', 'Traitement de caries', 'Cavity treatment', 'علاج التسوس', 'Traitement des caries avec des matériaux modernes.', 'Cavity treatment with modern filling materials.', 'معالجة تسوس الأسنان بمواد حشو حديثة.', 45, 2),
  ('devitalisation', 'Dévitalisation', 'Root canal', 'علاج اللب', 'Traitement endodontique pour sauver les dents infectées.', 'Endodontic treatment to save infected teeth.', 'العلاج اللبي لإنقاذ الأسنان المصابة.', 60, 3),
  ('blanchiment', 'Blanchiment dentaire', 'Teeth whitening', 'تبييض الأسنان', 'Blanchiment professionnel pour un sourire radieux.', 'Professional whitening for a brighter smile.', 'تبييض احترافي للأسنان.', 60, 4),
  ('extraction', 'Extraction dentaire', 'Tooth extraction', 'خلع الأسنان', 'Extraction sûre et indolore.', 'Safe and painless extraction.', 'خلع آمن وغير مؤلم.', 45, 5)
ON CONFLICT (slug) DO NOTHING;
