import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!url || !anon) {
  // eslint-disable-next-line no-console
  console.warn("[beacon] Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY env vars");
}

export const supabase = createClient(url ?? "", anon ?? "", {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: "pkce",
  },
  db: { schema: "beacon" },
});

export type Target = {
  id: string;
  user_id: string;
  query: string;
  created_at: string;
};

export type Prospect = {
  id: string;
  target_id: string;
  company_name: string;
  phone: string | null;
  address: string | null;
  website: string | null;
  employee_count_est: number | null;
  fit_score: number | null;
  intent_signal: "active" | "dormant" | "closed" | string | null;
  claude_summary: string | null;
  raw_json: Record<string, unknown> | null;
  created_at: string;
};
