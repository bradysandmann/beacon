import { Link } from "react-router-dom";
import { Wordmark } from "./Logo";

export function Nav({ authed }: { authed: boolean }) {
  return (
    <nav className="relative z-20 border-b border-line">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <Wordmark />
          <span className="hidden sm:inline-block text-[0.7rem] font-mono text-muted tracking-widest uppercase">
            v1.0 / sketch
          </span>
        </Link>
        <div className="flex items-center gap-1.5 sm:gap-3">
          <Link
            to="/sample"
            className="px-3 py-1.5 font-mono text-[0.74rem] uppercase tracking-wider text-muted hover:text-white transition-colors"
          >
            Sample
          </Link>
          <a
            href="https://github.com/bradysandmann/beacon"
            target="_blank"
            rel="noreferrer"
            className="hidden md:inline-flex px-3 py-1.5 font-mono text-[0.74rem] uppercase tracking-wider text-muted hover:text-white transition-colors"
          >
            Repo
          </a>
          {authed ? (
            <Link to="/app" className="btn btn-primary">
              Open app
            </Link>
          ) : (
            <Link to="/signin" className="btn btn-primary">
              Sign in
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
