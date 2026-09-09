-- Bootstrap: allow first user to become admin if no admin exists
-- Safe: only succeeds when user_roles has zero admins, or caller is already admin

CREATE OR REPLACE FUNCTION public.bootstrap_first_admin()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  caller uuid := auth.uid();
  admin_count int;
  caller_email text;
BEGIN
  IF caller IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT COUNT(*) INTO admin_count FROM public.user_roles WHERE role = 'admin';

  -- If an admin already exists, only existing admins can promote others — caller must be admin
  IF admin_count > 0 THEN
    IF NOT public.has_role(caller, 'admin') THEN
      RETURN jsonb_build_object('ok', false, 'reason', 'admin_already_exists', 'admin_count', admin_count);
    END IF;
  END IF;

  -- Promote caller if not already admin
  INSERT INTO public.user_roles (user_id, role)
  VALUES (caller, 'admin'::public.app_role)
  ON CONFLICT (user_id, role) DO NOTHING;

  SELECT email INTO caller_email FROM auth.users WHERE id = caller;

  RETURN jsonb_build_object('ok', true, 'email', caller_email, 'user_id', caller);
END;
$$;

GRANT EXECUTE ON FUNCTION public.bootstrap_first_admin() TO authenticated;
-- service_role already has all via bypass; authenticated needs execute

-- Also allow rayen08yako@gmail.com to be promoted via explicit email RPC for convenience
CREATE OR REPLACE FUNCTION public.promote_admin_by_email(target_email text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  caller uuid := auth.uid();
  target uuid;
  is_admin boolean;
BEGIN
  IF caller IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  -- only admins can promote by email (or if no admins yet, anyone can self-bootstrap above)
  IF NOT public.has_role(caller, 'admin') THEN
    -- allow self-promotion if targeting own email and no admins exist
    SELECT COUNT(*) INTO is_admin FROM public.user_roles WHERE role='admin';
    IF is_admin = 0 THEN
      -- fall through, but ensure target_email is caller's own email
      SELECT id INTO target FROM auth.users WHERE email = target_email;
      IF target != caller THEN
        RAISE EXCEPTION 'Only admins can promote others';
      END IF;
    ELSE
      RAISE EXCEPTION 'Only admins can promote others';
    END IF;
  END IF;

  SELECT id INTO target FROM auth.users WHERE email = target_email;
  IF target IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'user_not_found', 'email', target_email);
  END IF;

  INSERT INTO public.user_roles (user_id, role) VALUES (target, 'admin'::public.app_role)
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN jsonb_build_object('ok', true, 'email', target_email, 'user_id', target);
END;
$$;

GRANT EXECUTE ON FUNCTION public.promote_admin_by_email(text) TO authenticated;
