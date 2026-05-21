import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { Landing } from "@/pages/Landing";
import { AppShell } from "@/pages/AppShell";
import { Dashboard } from "@/pages/Dashboard";
import { TargetDetail } from "@/pages/TargetDetail";
import { SignIn } from "@/pages/SignIn";
import { Sample } from "@/pages/Sample";

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data }) => {
        setSession(data.session);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="font-mono text-xs text-muted">Loading.</div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Landing authed={!!session} />} />
      <Route path="/sample" element={<Sample />} />
      <Route path="/signin" element={session ? <Navigate to="/app" replace /> : <SignIn />} />
      <Route
        path="/app"
        element={session ? <AppShell session={session} /> : <Navigate to="/signin" replace />}
      >
        <Route index element={<Dashboard session={session!} />} />
        <Route path="targets/:id" element={<TargetDetail session={session!} />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
