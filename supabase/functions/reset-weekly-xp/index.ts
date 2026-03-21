import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  const secret = req.headers.get("x-reset-secret");
  if (secret !== Deno.env.get("RESET_SECRET")) {
    return new Response("Unauthorized", { status: 401 });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { error } = await supabase
    .from("users")
    .update({ xp_weekly: 0 })
    .lt("weekly_reset_at", new Date().toISOString());

  return new Response(
    JSON.stringify({ success: !error, error: error?.message }),
    { headers: { "Content-Type": "application/json" } }
  );
});