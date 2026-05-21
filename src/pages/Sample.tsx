import { Link } from "react-router-dom";
import { Nav } from "@/components/Nav";
import { ProspectTable } from "@/components/ProspectTable";
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
      }))
    );

  return (
    <div className="min-h-screen bg-ink-0 text-white">
      <Nav authed={false} />

      <main className="mx-auto max-w-7xl px-5 sm:px-8 py-12 sm:py-16 relative">
        <div className="aurora-magenta" style={{ left: "-20%", top: "10%", opacity: 0.18 }} aria-hidden />

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
            <Link to="/signin" className="btn">
              Run my own query
            </Link>
            <span className="font-mono text-[0.7rem] text-muted ml-1">
              {SAMPLE_PROSPECTS.length} rows · click any row to expand
            </span>
          </div>
        </div>

        <div className="mt-10">
          <ProspectTable rows={SAMPLE_PROSPECTS} />
        </div>

        <div className="mt-12 panel rounded p-6">
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
        </div>
      </main>
    </div>
  );
}
