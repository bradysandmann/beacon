import { Fragment, useMemo, useState } from "react";
import type { Prospect } from "@/lib/supabase";
import { fitColor, intentLabel } from "@/lib/utils";

type Row = Pick<
  Prospect,
  | "id"
  | "company_name"
  | "phone"
  | "address"
  | "website"
  | "employee_count_est"
  | "fit_score"
  | "intent_signal"
  | "claude_summary"
> & { fit_reasons?: string[] | null };

type SortKey = "fit_score" | "company_name" | "employee_count_est" | "intent_signal";
type Dir = "asc" | "desc";

export function ProspectTable({ rows, compact = false }: { rows: Row[]; compact?: boolean }) {
  const [sortKey, setSortKey] = useState<SortKey>("fit_score");
  const [dir, setDir] = useState<Dir>("desc");
  const [expanded, setExpanded] = useState<string | null>(null);

  const sorted = useMemo(() => {
    const out = [...rows];
    out.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === "number" && typeof bv === "number") return dir === "desc" ? bv - av : av - bv;
      const as = String(av ?? "");
      const bs = String(bv ?? "");
      return dir === "desc" ? bs.localeCompare(as) : as.localeCompare(bs);
    });
    return out;
  }, [rows, sortKey, dir]);

  const click = (k: SortKey) => {
    if (k === sortKey) setDir(dir === "desc" ? "asc" : "desc");
    else {
      setSortKey(k);
      setDir(k === "company_name" ? "asc" : "desc");
    }
  };

  const indicator = (k: SortKey) => (sortKey === k ? (dir === "desc" ? " ↓" : " ↑") : "");

  return (
    <div className="panel rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="tbl">
          <thead>
            <tr>
              <th onClick={() => click("company_name")} style={{ minWidth: 220 }}>
                Company{indicator("company_name")}
              </th>
              {!compact && <th>Phone</th>}
              {!compact && <th>Address</th>}
              <th onClick={() => click("employee_count_est")} className="text-right">
                Emp{indicator("employee_count_est")}
              </th>
              <th onClick={() => click("fit_score")} className="text-right">
                Fit{indicator("fit_score")}
              </th>
              <th onClick={() => click("intent_signal")}>Intent{indicator("intent_signal")}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => {
              const intent = intentLabel(r.intent_signal);
              const isOpen = expanded === r.id;
              const fc = fitColor(r.fit_score);
              const reasons = r.fit_reasons && r.fit_reasons.length ? r.fit_reasons : null;
              return (
                <Fragment key={r.id}>
                  <tr
                    onClick={() => setExpanded(isOpen ? null : r.id)}
                    className="row-interactive cursor-pointer"
                    style={isOpen ? { background: "rgba(255,255,255,0.025)" } : undefined}
                  >
                    <td className="text-white">{r.company_name}</td>
                    {!compact && <td className="text-muted">{r.phone || "."}</td>}
                    {!compact && (
                      <td className="text-muted" style={{ maxWidth: 280, whiteSpace: "normal" }}>
                        {r.address || "."}
                      </td>
                    )}
                    <td className="text-right text-muted">{r.employee_count_est ?? "."}</td>
                    <td className="text-right">
                      <span className="score-chip">
                        <span className="score-dot" style={{ background: fc }} />
                        <span style={{ color: fc }}>{r.fit_score ?? "."}</span>
                      </span>
                    </td>
                    <td>
                      <span className="score-chip">
                        <span className="score-dot" style={{ background: intent.dot }} />
                        <span>{intent.label}</span>
                      </span>
                    </td>
                    <td className="text-right">
                      <span className="font-mono text-[0.7rem] text-muted">
                        {isOpen ? "[ - ]" : "[ + ]"}
                      </span>
                    </td>
                  </tr>
                  {isOpen && (
                    <tr key={r.id + "-x"} className="reveal-row">
                      <td colSpan={compact ? 5 : 7} style={{ background: "rgba(255,255,255,0.015)", padding: 0 }}>
                        <div className="reason-panel">
                          <div className="reason-grid">
                            <div className="reason-left">
                              <div className="reason-label">
                                Why this scored
                              </div>
                              <div className="reason-score" style={{ color: fc }}>
                                {r.fit_score ?? "."}
                                <span className="reason-score-suffix">/100</span>
                              </div>
                              <div className="reason-divider" />
                              <div className="reason-summary">
                                <span className="text-glow-gradient">/&gt;</span> {r.claude_summary || "No summary yet."}
                              </div>
                              {r.website ? (
                                <a
                                  href={r.website.startsWith("http") ? r.website : `https://${r.website}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="reason-website"
                                >
                                  {r.website}
                                </a>
                              ) : null}
                            </div>
                            <div className="reason-right">
                              <div className="reason-label">
                                Score factors
                              </div>
                              <ul className="reason-list">
                                {(reasons ?? deriveReasonsFromSummary(r)).map((rs, i) => (
                                  <li key={i} className="reason-item">
                                    <span className="reason-bullet" style={{ background: fc, boxShadow: `0 0 6px ${fc}` }} />
                                    <span>{rs}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
            {sorted.length === 0 && (
              <tr>
                <td colSpan={compact ? 5 : 7}>
                  <div className="py-10 text-center font-mono text-xs text-muted">
                    No prospects yet. Add a target above to populate this list.
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Fallback: when a row has no explicit fit_reasons array (live DB rows), derive
// a tight 3-bullet set from structured fields so the reasoning panel never reads empty.
function deriveReasonsFromSummary(r: Row): string[] {
  const out: string[] = [];
  const emp = r.employee_count_est;
  if (typeof emp === "number") {
    if (emp >= 5 && emp <= 30) out.push(`Employee count ${emp} inside the 5-30 ICP band`);
    else if (emp > 30) out.push(`Employee count ${emp}, above ICP ceiling`);
    else out.push(`Employee count ${emp}, below ICP floor`);
  }
  if (r.address && /tampa|hillsborough/i.test(r.address)) {
    out.push("Address inside Tampa / Hillsborough target geography");
  } else if (r.address) {
    out.push("Address outside core target geography");
  }
  if (r.website && r.phone) {
    out.push("Phone and website both present, complete public listing");
  } else if (!r.website && !r.phone) {
    out.push("Missing phone and website, listing incomplete");
  }
  if (r.intent_signal === "active") out.push("Recent activity signal");
  if (r.intent_signal === "dormant") out.push("No recent activity, dormant signal");
  if (r.intent_signal === "closed") out.push("Listing flagged closed");
  return out.slice(0, 5);
}
