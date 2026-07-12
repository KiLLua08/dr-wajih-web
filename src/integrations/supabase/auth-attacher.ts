import { createMiddleware } from "@tanstack/react-start";
import { supabase } from "./client";

export const attachSupabaseAuth = createMiddleware({ type: "function" }).server(async ({ next }) => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return next();
  } catch (error) {
    console.error("Auth error:", error);
    return next();
  }
});
