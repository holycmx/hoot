import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const authHeader = req.headers.get("Authorization")!;
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", "")
    );
    if (authError || !user) throw new Error("Unauthorized");

    const body = await req.json();
    const { source, correct_answers, total_questions, speed_bonuses = 0, completed = false } = body;

    let xp = 0;
    if (source === "lesson") {
      xp += correct_answers * 10;
      if (completed) xp += 20;
    } else if (source === "quiz") {
      xp += correct_answers * 20;
      xp += speed_bonuses * 5;
    } else {
      throw new Error("Invalid source. Must be 'lesson' or 'quiz'.");
    }

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id, xp_total, xp_weekly, weekly_reset_at, streak_days, last_active_date")
      .eq("auth_uid", user.id)
      .single();

    if (userError || !userData) throw new Error("User not found");

    const now = new Date();
    const resetAt = new Date(userData.weekly_reset_at);
    const isNewWeek = now >= resetAt;

    const todayKST = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Seoul" }))
      .toISOString().split("T")[0];
    const lastActive = userData.last_active_date;
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    let newStreak = userData.streak_days;
    if (lastActive === todayKST) {
      // already active today
    } else if (lastActive === yesterdayStr) {
      newStreak += 1;
    } else {
      newStreak = 1;
    }

    const newWeeklyXP = isNewWeek ? xp : userData.xp_weekly + xp;
    const nextResetAt = isNewWeek ? getNextMondayMidnightKST() : userData.weekly_reset_at;

    const { error: updateError } = await supabase
      .from("users")
      .update({
        xp_total: userData.xp_total + xp,
        xp_weekly: newWeeklyXP,
        weekly_reset_at: nextResetAt,
        streak_days: newStreak,
        last_active_date: todayKST,
      })
      .eq("id", userData.id);

    if (updateError) throw updateError;

    await supabase.from("xp_events").insert({
      user_id: userData.id,
      xp_awarded: xp,
      source,
      details: { correct_answers, total_questions, speed_bonuses, completed },
    });

    return new Response(JSON.stringify({ xp_awarded: xp, new_total: userData.xp_total + xp }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function getNextMondayMidnightKST(): string {
  const now = new Date();
  const kst = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Seoul" }));
  const day = kst.getDay();
  const daysUntilMonday = day === 0 ? 1 : 8 - day;
  kst.setDate(kst.getDate() + daysUntilMonday);
  kst.setHours(0, 0, 0, 0);
  return kst.toISOString();
}