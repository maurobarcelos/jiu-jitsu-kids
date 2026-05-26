"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-client";
import AuthGate from "@/components/AuthGate";
import Game from "@/components/Game";

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const supabase = createClient();

  async function checkAuth() {
    const { data } = await supabase.auth.getUser();
    setUserEmail(data.user?.email ?? null);
    setLoading(false);
  }

  useEffect(() => {
    checkAuth();
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-6xl animate-bounce-slow">🐯</div>
      </div>
    );
  }

  if (!userEmail) {
    return <AuthGate onAuth={checkAuth} />;
  }

  return <Game userEmail={userEmail} onLogout={checkAuth} />;
}
