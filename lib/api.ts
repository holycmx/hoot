import { supabase } from "./supabase";

export async function submitXP(params: {
  source: "lesson" | "quiz";
  correct_answers: number;
  total_questions: number;
  speed_bonuses?: number;
  completed?: boolean;
}) {
  const session = await supabase.auth.getSession();
  const token = session.data.session?.access_token;

  const res = await fetch(
    `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/submit-xp`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(params),
    }
  );
  return res.json();
}

export async function fetchLeaderboard(params: {
  geo_tier: "town" | "province" | "national" | "global";
  geo_value?: string;
  age_group?: "5-8" | "9-13" | "14-18" | "all";
  period?: "weekly" | "alltime";
  limit?: number;
  offset?: number;
}) {
  const query = new URLSearchParams({
    geo_tier: params.geo_tier,
    ...(params.geo_value && { geo_value: params.geo_value }),
    age_group: params.age_group ?? "all",
    period: params.period ?? "alltime",
    limit: String(params.limit ?? 50),
    offset: String(params.offset ?? 0),
  });

  const res = await fetch(
    `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/get-leaderboard?${query}`,
    {
      headers: {
        apikey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
      },
    }
  );
  return res.json();
}
