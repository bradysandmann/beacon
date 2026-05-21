import { Link } from "react-router-dom";
import { Nav } from "@/components/Nav";
import { ProspectTable } from "@/components/ProspectTable";
import { SAMPLE_PROSPECTS, SAMPLE_QUERY } from "@/lib/seed";

export function Landing({ authed }: { authed: boolean }) {
  return (
    <div className="min-h-screen bg-ink-0 text-white relative overflow-hidden">
      <Nav authed={authed} />

      <main className="relative z-10">
        {/* HERO */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 grid-bg mask-radial" aria-hidden />
          <div className="aurora" aria-hidden />
          <div className="aurora-magenta" style={{ left: "30%", top: "30%" }} aria-hidden />

          <div className="mx-auto max-w-7xl px-5 sm:px-8 pt-20 pb-28 sm:pt-32 sm:pb-40 relative">
            <div className="eyebrow">
              <span className="pulse" />
              Sketch mode. Live Apify and Claude wire up when credits land.
            </div>

            <h1 className="mt-10 font-sans font-extrabold leading-[0.92] tracking-tightest text-glow-gradient text-[clamp(3.5rem,11vw,8.5rem)]">
              Find your next
              <br />
              100 customers.
            </h1>

            <p className="mt-10 max-w-2xl font-mono text-sm sm:text-[0.95rem] text-muted leading-relaxed">
              Beacon takes a single search query, pulls every matching local business, then scores each one for
              fit and intent against your ICP. You see a ranked, exportable list in one screen.
            </p>

            <div className="mt-12 flex flex-wrap gap-3">
              <Link to={authed ? "/app" : "/signin"} className="btn btn-primary">
                {authed ? "Open app" : "Sign in with email"}
              </Link>
              <Link to="/sample" className="btn">
                See the sample list
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-x-7 gap-y-3 font-mono text-[0.74rem] tracking-widest uppercase text-muted">
              <span>Scrape</span>
              <span className="opacity-30">/</span>
              <span>Score</span>
              <span className="opacity-30">/</span>
              <span>Sort</span>
              <span className="opacity-30">/</span>
              <span>Export</span>
            </div>
          </div>

          {/* faux terminal stamp bottom-right */}
          <div className="hidden lg:flex absolute right-8 bottom-8 panel rounded px-3 py-2 font-mono text-[0.7rem] text-muted gap-3 items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-glow-cyan" style={{ boxShadow: "0 0 8px #67E8F9" }} />
            <span>build / 1.0.0</span>
            <span className="opacity-30">|</span>
            <span>region / iad1</span>
          </div>
        </section>

        <div className="loader-bar" />

        {/* PROBLEM SECTION */}
        <section className="relative py-24 sm:py-32 border-b border-line">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 grid lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-4">
              <div className="font-mono text-[0.7rem] uppercase tracking-widest text-muted mb-6">
                01 / Problem
              </div>
              <h2 className="font-sans font-bold text-3xl sm:text-5xl tracking-tighter leading-tight">
                List buying is a tax
                <br />
                <span className="text-glow-gradient">on hope.</span>
              </h2>
            </div>
            <div className="lg:col-span-7 lg:col-start-6 space-y-7 font-sans text-[1.05rem] text-muted leading-relaxed">
              <p>
                The honest cycle for a small operator looking for outbound leads is buy a list, dial through the
                first 20, find that half are closed, dormant, or the wrong size, then quietly stop.
              </p>
              <p>
                The data is usually fine. The ranking is what is missing. Without a fit signal, a 1,000-row CSV
                is just noise. The first hour of outbound burns on prospects that were never going to convert.
              </p>
              <p className="text-white">
                Beacon ranks the list before you open it.
              </p>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="relative py-24 sm:py-32 border-b border-line">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="flex items-end justify-between mb-14">
              <div>
                <div className="font-mono text-[0.7rem] uppercase tracking-widest text-muted mb-6">
                  02 / Flow
                </div>
                <h2 className="font-sans font-bold text-3xl sm:text-5xl tracking-tighter">
                  Three stages.
                </h2>
              </div>
              <div className="hidden sm:block font-mono text-xs text-muted">
                query → rows → scored
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-px bg-line">
              {[
                {
                  k: "01",
                  t: "Scrape",
                  d: "Drop in a search like Plumbers Tampa FL. Beacon pulls the public listings (names, phones, addresses, websites, employee count, review velocity).",
                  c: "#A78BFA",
                },
                {
                  k: "02",
                  t: "Score",
                  d: "Claude reads each row against your ICP brief and assigns a fit score 0 to 100 plus an intent label of active, dormant, or closed.",
                  c: "#67E8F9",
                },
                {
                  k: "03",
                  t: "Export",
                  d: "Sort by any column. Expand a row to read the reasoning. Export the filtered set as CSV ready for your dialer or CRM.",
                  c: "#F472B6",
                },
              ].map((s) => (
                <div key={s.k} className="bg-black p-8 sm:p-10 relative">
                  <div className="absolute top-8 right-8 font-mono text-[0.7rem] text-muted">
                    {s.k}
                  </div>
                  <div className="w-9 h-9 rounded border border-line flex items-center justify-center mb-7" style={{ boxShadow: `0 0 32px -8px ${s.c}` }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.c, boxShadow: `0 0 10px ${s.c}` }} />
                  </div>
                  <h3 className="font-sans font-semibold text-2xl mb-3 tracking-tight">{s.t}</h3>
                  <p className="font-sans text-[0.96rem] text-muted leading-relaxed">{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SAMPLE TABLE PREVIEW */}
        <section className="relative py-24 sm:py-32 border-b border-line overflow-hidden">
          <div className="aurora-magenta" style={{ right: "-10%", top: "30%", opacity: 0.18 }} aria-hidden />
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
              <div>
                <div className="font-mono text-[0.7rem] uppercase tracking-widest text-muted mb-6">
                  03 / Live sample
                </div>
                <h2 className="font-sans font-bold text-3xl sm:text-5xl tracking-tighter">
                  Query <span className="text-glow-gradient">"{SAMPLE_QUERY}".</span>
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-muted">25 rows · fit-ranked · click any row to expand</span>
                <Link to="/sample" className="btn">
                  Open full sample
                </Link>
              </div>
            </div>

            <ProspectTable rows={SAMPLE_PROSPECTS.slice(0, 8)} />

            <div className="mt-4 font-mono text-[0.7rem] text-muted">
              Showing 8 of 25 · view the full set with sort and CSV export at <Link to="/sample" className="text-white hover:underline">/sample</Link>.
            </div>
          </div>
        </section>

        {/* HONEST NOTES */}
        <section className="relative py-24 sm:py-32 border-b border-line">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 grid lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-4">
              <div className="font-mono text-[0.7rem] uppercase tracking-widest text-muted mb-6">
                04 / Notes
              </div>
              <h2 className="font-sans font-bold text-3xl sm:text-5xl tracking-tighter leading-tight">
                What this is.
                <br />
                <span className="text-muted">What it isn't.</span>
              </h2>
            </div>
            <div className="lg:col-span-7 lg:col-start-6 grid sm:grid-cols-2 gap-px bg-line">
              {[
                {
                  t: "Real wiring",
                  d: "Magic-link auth, Supabase persistence, Anthropic SDK with browser-direct headers. The integrations are in place, not mocked.",
                },
                {
                  t: "Deterministic fallback",
                  d: "The current Anthropic key has zero credits. Until that changes, scoring runs on a deterministic rule set that produces the same fit signal a junior SDR would.",
                },
                {
                  t: "Scraping is stubbed",
                  d: "Apify and Bright Data both require paid plans. The sample list is hard-coded, fictional, and clearly labeled. Swapping in a real scraper is one file.",
                },
                {
                  t: "RLS is on",
                  d: "Postgres row-level security restricts every read and write to the signed-in user. The schema is in source for review.",
                },
              ].map((c) => (
                <div key={c.t} className="bg-black p-7">
                  <h3 className="font-sans font-semibold text-lg mb-2">{c.t}</h3>
                  <p className="font-sans text-[0.94rem] text-muted leading-relaxed">{c.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA FOOTER */}
        <section className="relative py-28 sm:py-36 overflow-hidden">
          <div className="absolute inset-0 grid-bg mask-radial opacity-50" aria-hidden />
          <div className="aurora" style={{ opacity: 0.35 }} aria-hidden />
          <div className="mx-auto max-w-5xl px-5 sm:px-8 text-center relative">
            <h2 className="font-sans font-extrabold text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.95] tracking-tightest text-glow-gradient">
              The list is the easy part.
            </h2>
            <p className="mt-8 max-w-xl mx-auto font-mono text-sm text-muted leading-relaxed">
              Beacon is the second column. The fit score next to the company name.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Link to={authed ? "/app" : "/signin"} className="btn btn-primary">
                {authed ? "Open app" : "Sign in with email"}
              </Link>
              <Link to="/sample" className="btn">
                Open the sample
              </Link>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-line py-10">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between font-mono text-[0.7rem] text-muted">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-white opacity-60" />
              <span>Beacon. A portfolio build by Brady Sandmann.</span>
            </div>
            <div className="flex items-center gap-5">
              <a href="https://github.com/bradysandmann/beacon" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                Source
              </a>
              <Link to="/sample" className="hover:text-white transition-colors">
                Sample
              </Link>
              <Link to="/signin" className="hover:text-white transition-colors">
                Sign in
              </Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
