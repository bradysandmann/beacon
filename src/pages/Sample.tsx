import { Link } from "react-router-dom";
import { Nav } from "@/components/Nav";
import { ProspectTable } from "@/components/ProspectTable";
import { Reveal } from "@/components/Reveal";
import { SAMPLE_PROSPECTS, SAMPLE_QUERY } from "@/lib/seed";
import { downloadCSV } from "@/lib/utils";

export function Sample() {
  const csv = () =>
    downloadCSV(
      "beacon-sample-plumbers-tampa.csv",
      SAMPLE_PROSPECTS.map((r) => ({
        company_name: r.company_name,
        phone: r.phone,
        address: r.address,
        website: r.website,
        employee_count_est: r.employee_count_est,
        fit_score: r.fit_score,
        intent_signal: r.intent_signal,
        claude_summary: r.claude_summary,
        // Full reasoning column - the anti-Lusha wedge. Every score factor
        // is exportable, joined with " | " so it stays inside one CSV cell.
        fit_reasons: (r.fit_reasons ?? []).join(" | "),
      })),
    );

  return (
    <div className="min-h-screen bg-ink-0 text-white">
      <Nav authed={false} />

      <main className="mx-auto max-w-7xl px-5 sm:px-8 py-12 sm:py-16 relative">
        <div className="aurora-magenta" style={{ left: "-20%", top: "10%", opacity: 0.18 }} aria-hidden />

        <Reveal>
          <div className="relative">
            <div className="font-mono text-[0.7rem] uppercase tracking-widest text-muted mb-4">
              Sample list / read-only
            </div>
            <h1 className="font-sans font-extrabold text-4xl sm:text-6xl tracking-tightest leading-[0.95] text-glow-gradient">
              "{SAMPLE_QUERY}"
            </h1>
            <p className="mt-6 max-w-2xl font-mono text-sm text-muted leading-relaxed">
              Twenty-five fictional but realistic prospects, scored and sorted. The same shape your authenticated
              run would produce, just with the scraping stubbed and the scoring deterministic until live credits land.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button onClick={csv} className="btn btn-primary">
                Export CSV
              </button>
              <button onClick={csv} className="csv-pill" aria-label="Free CSV export, no credit gates">
                <span className="csv-pill-icon" aria-hidden>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                </span>
                Free · no credit gates · includes fit-score reasoning
              </button>
              <Link to="/signin" className="btn">
                Run my own query
              </Link>
              <span className="font-mono text-[0.7rem] text-muted ml-1">
                {SAMPLE_PROSPECTS.length} rows · click any row to see why it scored
              </span>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.05} className="mt-10">
          <ProspectTable rows={SAMPLE_PROSPECTS} />
        </Reveal>

        <Reveal delay={0.1} className="mt-12 panel rounded p-6">
          <div className="font-mono text-[0.7rem] uppercase tracking-widest text-muted mb-3">
            Reading the score
          </div>
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3 font-sans text-[0.95rem] text-muted leading-relaxed">
            <div>
              <span style={{ color: "#67E8F9" }}>80 to 100</span> Strong fit. Open the call.
            </div>
            <div>
              <span style={{ color: "#A78BFA" }}>60 to 79</span> Decent fit. Worth a first-touch.
            </div>
            <div>
              <span style={{ color: "#F472B6" }}>40 to 59</span> Slow nurture. Off the priority list.
            </div>
            <div>
              <span style={{ color: "#52525B" }}>0 to 39</span> Defer or skip. Listing is partial or closed.
            </div>
          </div>
          <div className="mt-5 font-mono text-[0.7rem] text-muted">
            Expand any row to see the three-to-five bullet reason set that produced the score.
          </div>
        </Reveal>
      </main>
    </div>
  );
}
