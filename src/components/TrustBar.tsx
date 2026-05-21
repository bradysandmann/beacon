import { CountUp } from "./CountUp";
import { Reveal } from "./Reveal";

/**
 * Trust-signal stack below the hero: G2-style badge + three scroll-driven
 * counter stat blocks (prospects enriched, average fit score, time saved).
 * Stats are labeled "illustrative" since Beacon ships in sketch mode.
 */
export function TrustBar() {
  return (
    <section className="relative py-16 sm:py-20 border-b border-line">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10">
            <div className="font-mono text-[0.7rem] uppercase tracking-widest text-muted">
              Trust signals / illustrative
            </div>
            <div className="g2-badge" aria-label="Sample G2 rating, illustrative">
              <div className="g2-badge-ring" aria-hidden>
                <span className="g2-badge-score">4.8</span>
              </div>
              <div className="g2-badge-text">
                <span className="g2-badge-title">G2 quality leader</span>
                <span className="g2-badge-sub">B2B prospecting / sample badge</span>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="stat-grid">
            <div className="stat-cell">
              <div className="stat-label">Prospects enriched</div>
              <div className="stat-value">
                <CountUp to={148293} suffix="+" />
              </div>
              <div className="stat-note">across the sample corpus</div>
            </div>

            <div className="stat-cell">
              <div className="stat-label">Average fit score</div>
              <div className="stat-value" style={{ color: "#67E8F9" }}>
                <CountUp to={62} suffix="/100" />
              </div>
              <div className="stat-note">deterministic scorer baseline</div>
            </div>

            <div className="stat-cell">
              <div className="stat-label">Time saved per list</div>
              <div className="stat-value" style={{ color: "#A78BFA" }}>
                <CountUp to={3.2} decimals={1} suffix="h" />
              </div>
              <div className="stat-note">vs manual sort and dial</div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="sketch-tag">
            <span className="sketch-tag-dot" />
            Counters and badge are illustrative for sketch mode. Real numbers
            replace these once live credits land.
          </div>
        </Reveal>
      </div>
    </section>
  );
}
