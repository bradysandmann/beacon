import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { supabase, type Target, type Prospect } from "@/lib/supabase";
import { ProspectTable } from "@/components/ProspectTable";
import { downloadCSV, formatDate } from "@/lib/utils";
import { scoreWithClaude } from "@/lib/score";

export function TargetDetail({ session: _session }: { session: Session }) {
  const { id } = useParams<{ id: string }>();
  const [target, setTarget] = useState<Target | null>(null);
  const [rows, setRows] = useState<Prospect[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rescoring, setRescoring] = useState(false);
  const [rescoreLog, setRescoreLog] = useState<string>("");
  const [deleting, setDeleting] = useState(false);
  const [filter, setFilter] = useState<"all" | "active" | "dormant" | "closed">("all");

  async function load() {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const { data: t, error: tErr } = await supabase
        .from("targets")
        .select("*")
        .eq("id", id)
        .single();
      if (tErr) throw tErr;
      setTarget(t as Target);

      const { data: p, error: pErr } = await supabase
        .from("prospects")
        .select("*")
        .eq("target_id", id)
        .order("fit_score", { ascending: false });
      if (pErr) throw pErr;
      setRows((p ?? []) as Prospect[]);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Could not load target.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const filtered = useMemo(() => {
    if (filter === "all") return rows;
    return rows.filter((r) => r.intent_signal === filter);
  }, [rows, filter]);

  async function rescore() {
    if (!rows.length) return;
    setRescoring(true);
    setRescoreLog(`Scoring ${rows.length} rows.`);
    try {
      for (let i = 0; i < rows.length; i++) {
        const r = rows[i];
        const scored = await scoreWithClaude({
          company_name: r.company_name,
          phone: r.phone,
          address: r.address,
          website: r.website,
          employee_count_est: r.employee_count_est,
        });
        await supabase
          .from("prospects")
          .update({
            fit_score: scored.fit_score,
            intent_signal: scored.intent_signal,
            claude_summary: scored.claude_summary,
          })
          .eq("id", r.id);
        setRescoreLog(`Scored ${i + 1} / ${rows.length} · mode ${scored.mode}.`);
      }
      await load();
      setRescoreLog("Done.");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Rescore failed.";
      setRescoreLog(msg);
    } finally {
      setRescoring(false);
    }
  }

  async function remove() {
    if (!target) return;
    if (!confirm("Delete this target and its prospects?")) return;
    setDeleting(true);
    try {
      await supabase.from("targets").delete().eq("id", target.id);
      window.dispatchEvent(new CustomEvent("beacon:targets-changed"));
      window.location.href = "/app";
    } catch {
      setDeleting(false);
    }
  }

  function exportCSV() {
    if (!filtered.length) return;
    downloadCSV(
      `beacon-${(target?.query ?? "list").replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.csv`,
      filtered.map((r) => {
        // Pull stored fit_reasons either from the explicit column or from
        // raw_json (where the live scorer may stash them). Join with " | "
        // so the bullet set stays inside one CSV cell.
        const reasons = ((): string[] => {
          const direct = (r as Prospect & { fit_reasons?: string[] | null }).fit_reasons;
          if (Array.isArray(direct) && direct.length) return direct;
          const raw = r.raw_json as { fit_reasons?: unknown } | null;
          if (raw && Array.isArray(raw.fit_reasons)) return raw.fit_reasons as string[];
          return [];
        })();
        return {
          company_name: r.company_name,
          phone: r.phone,
          address: r.address,
          website: r.website,
          employee_count_est: r.employee_count_est,
          fit_score: r.fit_score,
          intent_signal: r.intent_signal,
          claude_summary: r.claude_summary,
          fit_reasons: reasons.join(" | "),
        };
      })
    );
  }

  if (loading) {
    return <div className="font-mono text-xs text-muted">Loading.</div>;
  }

  if (error || !target) {
    return (
      <div className="panel rounded p-6">
        <div className="font-mono text-[0.72rem] text-glow-magenta mb-2">Error</div>
        <div className="font-sans text-[0.96rem] text-white">{error ?? "Target not found."}</div>
        <div className="mt-5">
          <Link to="/app" className="btn">Back to dashboard</Link>
        </div>
      </div>
    );
  }

  const activeCount = rows.filter((r) => r.intent_signal === "active").length;
  const avgFit = rows.length ? Math.round(rows.reduce((a, b) => a + (b.fit_score ?? 0), 0) / rows.length) : 0;

  return (
    <div className="space-y-8 animate-fade-in">
      <section>
        <div className="font-mono text-[0.7rem] uppercase tracking-widest text-muted mb-3">
          Target / {formatDate(target.created_at)}
        </div>
        <h1 className="font-sans font-bold text-3xl sm:text-4xl tracking-tighter break-words">
          {target.query}
        </h1>

        <div className="mt-6 grid grid-cols-3 gap-px bg-line max-w-xl">
          <Stat k="Rows" v={String(rows.length)} />
          <Stat k="Active" v={String(activeCount)} accent="#67E8F9" />
          <Stat k="Avg fit" v={String(avgFit)} accent="#A78BFA" />
        </div>
      </section>

      <section className="flex flex-wrap items-center gap-3">
        <button onClick={rescore} disabled={rescoring} className="btn btn-primary">
          {rescoring ? "Scoring." : "Score with Claude"}
        </button>
        <button onClick={exportCSV} disabled={!filtered.length} className="btn">
          Export {filtered.length} rows as CSV
        </button>
        <button onClick={remove} disabled={deleting} className="btn">
          {deleting ? "Deleting." : "Delete target"}
        </button>
        <div className="flex items-center gap-1 ml-auto">
          {(["all", "active", "dormant", "closed"] as const).map((k) => (
            <button
              key={k}
              onClick={() => setFilter(k)}
              className={`px-3 py-1.5 font-mono text-[0.72rem] uppercase tracking-wider rounded border transition-colors ${
                filter === k ? "border-lineStrong text-white bg-white/[0.04]" : "border-transparent text-muted hover:text-white"
              }`}
            >
              {k}
            </button>
          ))}
        </div>
      </section>

      {rescoring && (
        <div className="panel rounded p-4">
          <div className="loader-bar mb-3" />
          <div className="font-mono text-[0.74rem] text-muted">{rescoreLog}</div>
        </div>
      )}
      {!rescoring && rescoreLog && (
        <div className="font-mono text-[0.72rem] text-muted">{rescoreLog}</div>
      )}

      <ProspectTable rows={filtered} />
    </div>
  );
}

function Stat({ k, v, accent }: { k: string; v: string; accent?: string }) {
  return (
    <div className="bg-black p-4">
      <div className="font-mono text-[0.65rem] uppercase tracking-widest text-muted mb-1">{k}</div>
      <div className="font-sans font-semibold text-2xl tracking-tighter" style={accent ? { color: accent } : {}}>{v}</div>
    </div>
  );
}
