import { useState } from "react";
import { Link } from "react-router-dom";
import { Wordmark } from "@/components/Logo";
import { supabase } from "@/lib/supabase";

export function SignIn() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) {
      setStatus("error");
      setError("Enter a valid email address.");
      return;
    }
    setStatus("sending");
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: window.location.origin + "/app" },
      });
      if (error) throw error;
      setStatus("sent");
    } catch (e: unknown) {
      setStatus("error");
      const msg = e instanceof Error ? e.message : "Could not send the link.";
      setError(msg);
    }
  }

  return (
    <div className="min-h-screen bg-ink-0 text-white flex flex-col">
      <header className="border-b border-line">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-4 flex items-center justify-between">
          <Link to="/" aria-label="Back to home">
            <Wordmark />
          </Link>
          <Link to="/sample" className="font-mono text-[0.74rem] uppercase tracking-wider text-muted hover:text-white">
            See sample
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-5 py-16 relative overflow-hidden">
        <div className="aurora" aria-hidden />
        <div className="aurora-magenta" style={{ left: "60%", top: "30%", opacity: 0.2 }} aria-hidden />

        <div className="w-full max-w-md relative panel panel-glow rounded-lg p-8 sm:p-10">
          <div className="font-mono text-[0.7rem] uppercase tracking-widest text-muted mb-5">
            Sign in
          </div>
          <h1 className="font-sans font-bold text-3xl sm:text-4xl tracking-tighter leading-tight">
            Magic link only.
            <br />
            <span className="text-muted">No password to forget.</span>
          </h1>

          {status !== "sent" ? (
            <form onSubmit={submit} className="mt-10 space-y-4">
              <label className="block">
                <span className="font-mono text-[0.7rem] uppercase tracking-widest text-muted">
                  Email
                </span>
                <input
                  type="email"
                  autoFocus
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="mt-2 w-full bg-black border border-line rounded px-3 py-3 font-mono text-sm text-white placeholder:text-muted focus:border-glow-violet focus:outline-none transition-colors"
                />
              </label>
              {status === "error" && (
                <div className="font-mono text-[0.72rem] text-glow-magenta">{error}</div>
              )}
              <button type="submit" disabled={status === "sending"} className="btn btn-primary w-full justify-center">
                {status === "sending" ? "Sending." : "Send the link"}
              </button>
              <p className="font-mono text-[0.7rem] text-muted leading-relaxed">
                We email a one-time sign-in link. It expires in 10 minutes.
              </p>
            </form>
          ) : (
            <div className="mt-10 space-y-4">
              <div className="panel rounded p-5">
                <div className="font-mono text-[0.7rem] uppercase tracking-widest text-glow-cyan mb-2">
                  Link sent.
                </div>
                <div className="font-sans text-[0.96rem] text-white leading-relaxed">
                  Check {email} for a sign-in link. You can close this tab.
                </div>
              </div>
              <button
                onClick={() => {
                  setStatus("idle");
                  setEmail("");
                }}
                className="btn w-full justify-center"
              >
                Use a different email
              </button>
            </div>
          )}

          <div className="hairline mt-10" />
          <div className="mt-6 font-mono text-[0.7rem] text-muted leading-relaxed">
            Don't want to sign up? <Link to="/sample" className="text-white hover:underline">Read the sample list</Link>.
          </div>
        </div>
      </main>
    </div>
  );
}
