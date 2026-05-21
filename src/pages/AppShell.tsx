import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { Wordmark } from "@/components/Logo";
import { supabase, type Target } from "@/lib/supabase";

export function AppShell({ session }: { session: Session }) {
  const [targets, setTargets] = useState<Target[]>([]);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("targets")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setTargets(data as Target[]);
    setLoading(false);
  }

  useEffect(() => {
    void load();
    const onRefresh = () => void load();
    window.addEventListener("beacon:targets-changed", onRefresh);
    return () => window.removeEventListener("beacon:targets-changed", onRefresh);
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    nav("/", { replace: true });
  }

  return (
    <div className="min-h-screen bg-ink-0 text-white flex flex-col">
      <header className="border-b border-line">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-3.5 flex items-center justify-between gap-4">
          <Link to="/app" className="flex items-center gap-3">
            <Wordmark />
            <span className="hidden sm:inline-block font-mono text-[0.7rem] uppercase tracking-widest text-muted">
              app
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline font-mono text-[0.72rem] text-muted truncate max-w-[200px]">
              {session.user.email}
            </span>
            <button onClick={signOut} className="btn">
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 mx-auto max-w-7xl w-full px-5 sm:px-8 py-8 grid lg:grid-cols-[260px_1fr] gap-8">
        <aside className="lg:sticky lg:top-8 lg:self-start">
          <div className="font-mono text-[0.7rem] uppercase tracking-widest text-muted mb-3">
            Targets
          </div>
          {loading ? (
            <div className="font-mono text-xs text-muted">Loading.</div>
          ) : targets.length === 0 ? (
            <div className="panel rounded p-4 font-mono text-[0.78rem] text-muted leading-relaxed">
              No targets yet. Create one on the right to get started.
            </div>
          ) : (
            <nav className="space-y-1">
              {targets.map((t) => (
                <NavLink
                  key={t.id}
                  to={`/app/targets/${t.id}`}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded border ${
                      isActive
                        ? "border-lineStrong bg-white/[0.04] text-white"
                        : "border-transparent text-muted hover:text-white hover:border-line"
                    } font-mono text-[0.78rem] transition-colors truncate`
                  }
                >
                  {t.query}
                </NavLink>
              ))}
            </nav>
          )}
        </aside>

        <main className="min-w-0">
          <Outlet />
        </main>
      </div>

      <footer className="border-t border-line py-5 mt-12">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 font-mono text-[0.7rem] text-muted flex flex-wrap items-center gap-x-5 gap-y-2 justify-between">
          <span>Beacon. Sketch mode. Live wires when credits land.</span>
          <a href="https://github.com/bradysandmann/beacon" target="_blank" rel="noreferrer" className="hover:text-white">
            github.com/bradysandmann/beacon
          </a>
        </div>
      </footer>
    </div>
  );
}
