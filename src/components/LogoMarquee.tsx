/**
 * Customer logo carousel directly below the hero CTA.
 * Illustrative for sketch mode - rendered as wordmark placeholders with a clear
 * "Sample customers (illustrative)" disclaimer.
 *
 * The track is duplicated inline so the keyframe `marquee` can translate -50%
 * for a seamless infinite scroll.
 */
const LOGOS = [
  "Northwind Sales",
  "Atlas Outbound",
  "Helix CRM",
  "Caldera Growth",
  "Stratus SDR Co.",
  "Bay Ridge Capital",
  "Tessera Labs",
  "Loop Studios",
  "Mercer & Co",
  "Aurora Pipeline",
];

export function LogoMarquee() {
  return (
    <section className="logo-marquee" aria-label="Sample customers (illustrative)">
      <div className="logo-marquee-track">
        {[...LOGOS, ...LOGOS].map((name, i) => (
          <div key={i} className="logo-marquee-item">
            <span className="logo-marquee-dot" aria-hidden />
            <span>{name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
