import { useMemo, useState } from "react";
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
>;

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
              return (
                <>
                  <tr
                    key={r.id}
                    onClick={() => setExpanded(isOpen ? null : r.id)}
                    className="cursor-pointer"
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
                        <span className="score-dot" style={{ background: fitColor(r.fit_score) }} />
                        <span style={{ color: fitColor(r.fit_score) }}>{r.fit_score ?? "."}</span>
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
                    <tr key={r.id + "-x"}>
                      <td colSpan={compact ? 5 : 7} style={{ background: "rgba(255,255,255,0.015)" }}>
                        <div className="px-1 py-2 font-mono text-[0.78rem] text-muted whitespace-normal leading-relaxed">
                          <span className="text-glow-gradient">/&gt;</span> {r.claude_summary || "No summary yet."}
                          {r.website ? (
                            <div className="mt-2 text-[0.72rem] text-glow-gradient">{r.website}</div>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
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
