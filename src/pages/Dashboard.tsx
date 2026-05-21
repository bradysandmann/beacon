import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { supabase, type Prospect } from "@/lib/supabase";
import { SAMPLE_PROSPECTS, SAMPLE_QUERY } from "@/lib/seed";
import { scoreDeterministic } from "@/lib/score";

export function Dashboard({ session }: { session: Session }) {
  const [query, setQuery] = useState("Plumbers Tampa FL");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const nav = useNavigate();

  // Build a fresh prospect list for a query. If the query matches the canonical
  // sample, seed the 25 baked rows. Otherwise generate a deterministic 12-row
  // synthetic set so the workflow is end-to-end populated.
  function buildProspectsFor(q: string): Omit<Prospect, "id" | "target_id" | "created_at">[] {
    const lower = q.trim().toLowerCase();
    if (lower === SAMPLE_QUERY.toLowerCase()) {
      return SAMPLE_PROSPECTS.map((s) => ({
        company_name: s.company_name,
        phone: s.phone,
        address: s.address,
        website: s.website,
        employee_count_est: s.employee_count_est,
        fit_score: s.fit_score,
        intent_signal: s.intent_signal,
        claude_summary: s.claude_summary,
        raw_json: { source: "seed", query: q },
      }));
    }
    // Synthetic deterministic generator. Same query produces the same rows.
    const base = q.replace(/[^a-z0-9 ]/gi, "").trim();
    const tokens = base.split(/\s+/).filter(Boolean);
    const noun = tokens[0]?.toLowerCase() || "business";
    const loc = tokens.slice(1).join(" ").trim() || "Local";
    const blocks = [
      "Pro", "Group", "Co", "Services", "Solutions", "and Partners", "Collective",
      "Works", "Studio", "Specialists", "House", "Lab",
    ];
    const streets = [
      "100 Main St", "212 Market St", "318 Park Ave", "415 Oak Rd",
      "522 Pine St", "634 Cedar Blvd", "718 River Rd", "812 Lake Ave",
      "915 Birch Ln", "1024 Maple Dr", "1108 Elm St", "1216 Walnut St",
    ];
    const rows: Omit<Prospect, "id" | "target_id" | "created_at">[] = [];
    for (let i = 0; i < 12; i++) {
      const seedSum = [...(base + i)].reduce((a, c) => a + c.charCodeAt(0), 0);
      const employees = ((seedSum % 26) + 2);
      const company = `${capitalize(loc)} ${capitalize(noun)} ${blocks[i % blocks.length]}`;
      const phone = `(813) 555-0${(100 + ((seedSum * 7) % 900)).toString().padStart(3, "0")}`;
      const address = `${streets[i % streets.length]}, ${capitalize(loc) || "Tampa"}, FL`;
      const slug = company.toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 24);
      const website = `${slug}.example`;
      const scored = scoreDeterministic({
        company_name: company,
        phone,
        address,
        website,
        employee_count_est: employees,
      });
      rows.push({
        company_name: company,
        phone,
        address,
        website,
        employee_count_est: employees,
        fit_score: scored.fit_score,
        intent_signal: scored.intent_signal,
        claude_summary: scored.claude_summary,
        raw_json: { source: "synthetic", query: q, mode: scored.mode },
      });
    }
    return rows;
  }

  function capitalize(s: string) {
    return s.replace(/\b\w/g, (c) => c.toUpperCase());
  }

  async function createTarget(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setCreating(true);
    setError(null);
    try {
      const { data: target, error: tErr } = await supabase
        .from("targets")
        .insert({ user_id: session.user.id, query: query.trim() })
        .select()
        .single();
      if (tErr || !target) throw tErr ?? new Error("insert_failed");

      const prospects = buildProspectsFor(query.trim()).map((p) => ({ ...p, target_id: target.id }));
      const { error: pErr } = await supabase.from("prospects").insert(prospects);
      if (pErr) throw pErr;

      window.dispatchEvent(new CustomEvent("beacon:targets-changed"));
      nav(`/app/targets/${target.id}`);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Could not create target.";
      setError(msg);
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="space-y-10 animate-fade-in">
      <section>
        <div className="font-mono text-[0.7rem] uppercase tracking-widest text-muted mb-3">
          New target
        </div>
        <h1 className="font-sans font-bold text-3xl sm:text-4xl tracking-tighter">
          Add a query.
        </h1>
        <p className="mt-4 max-w-2xl font-sans text-[0.95rem] text-muted leading-relaxed">
          Beacon pulls every matching local business for the search, scores them against the ICP, and saves
          the run to your account. Try the default to see the pre-scored sample data, or type your own.
        </p>

        <form onSubmit={createTarget} className="mt-8 panel rounded-lg p-6 space-y-4">
          <label className="block">
            <span className="font-mono text-[0.7rem] uppercase tracking-widest text-muted">
              Search query
            </span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Plumbers Tampa FL"
              className="mt-2 w-full bg-black border border-line rounded px-3 py-3 font-mono text-sm text-white placeholder:text-muted focus:border-glow-violet focus:outline-none transition-colors"
            />
          </label>
          {error && (
            <div className="font-mono text-[0.72rem] text-glow-magenta">{error}</div>
          )}
          <div className="flex flex-wrap items-center gap-3">
            <button type="submit" disabled={creating} className="btn btn-primary">
              {creating ? "Running." : "Create target"}
            </button>
            <span className="font-mono text-[0.7rem] text-muted">
              The seed query produces 25 pre-scored rows. Any other query generates a 12-row synthetic set with deterministic scoring.
            </span>
          </div>
        </form>
      </section>

      <section>
        <div className="font-mono text-[0.7rem] uppercase tracking-widest text-muted mb-3">
          Notes
        </div>
        <div className="grid sm:grid-cols-2 gap-px bg-line">
          <Note
            title="Magic-link auth"
            body="You signed in via a one-time email link. Sessions persist for 7 days. Sign out from the header at any point."
          />
          <Note
            title="Row-level security"
            body="Every target and prospect is filtered to your user. Other accounts cannot see your runs even at the database level."
          />
          <Note
            title="Live Claude path"
            body="The scorer calls Claude with browser-direct headers when an API key is set. With the current zero-credit key, it falls back to a deterministic rule set."
          />
          <Note
            title="Apify wires up next"
            body="The sample is synthetic. Swapping in real Apify Google Maps scrape is one file once a paid key is available."
          />
        </div>
      </section>
    </div>
  );
}

function Note({ title, body }: { title: string; body: string }) {
  return (
    <div className="bg-black p-5">
      <h3 className="font-sans font-semibold text-base mb-1.5">{title}</h3>
      <p className="font-sans text-[0.9rem] text-muted leading-relaxed">{body}</p>
    </div>
  );
}
