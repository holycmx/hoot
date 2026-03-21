import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const url = new URL(req.url);
  const params = Object.fromEntries(url.searchParams);

  const {
    geo_tier,
    geo_value,
    age_group = "all",
    period = "alltime",
    limit = "50",
    offset = "0",
  } = params;

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!
  );

  let query = supabase
    .from("users")
    .select("id, name, age_group, town, province, country, xp_total, xp_weekly, streak_days")
    .order(period === "weekly" ? "xp_weekly" : "xp_total", { ascending: false })
    .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

  if (geo_tier === "town" && geo_value) query = query.eq("town", geo_value);
  else if (geo_tier === "province" && geo_value) query = query.eq("province", geo_value);
  else if (geo_tier === "national") query = query.eq("country", geo_value || "South Korea");
  // global = no geo filter

  if (age_group !== "all") query = query.eq("age_group", age_group);

  const { data, error } = await query;

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const ranked = data.map((user, i) => ({
    rank: parseInt(offset) + i + 1,
    ...user,
    xp: period === "weekly" ? user.xp_weekly : user.xp_total,
  }));

  return new Response(JSON.stringify({ leaderboard: ranked }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});