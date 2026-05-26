"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-client";

export default function AuthGate({ onAuth }: { onAuth: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error } = isSignup
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password });

      if (error) throw error;
      onAuth();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-5 bg-cream">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="text-7xl mb-2 animate-bounce-slow">🐯</div>
          <h1 className="font-display text-3xl font-bold text-ink">
            Tigrão Jiu Jitsu
          </h1>
          <p className="text-sm text-ink/70 mt-1">
            {isSignup ? "Crie sua conta" : "Faça login pra começar"}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="card-chunky p-5 space-y-4"
        >
          <div>
            <label className="block font-display font-bold text-sm mb-2">
              📧 Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-[3px] border-ink rounded-2xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-sunshine/50"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="block font-display font-bold text-sm mb-2">
              🔒 Senha
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-[3px] border-ink rounded-2xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-sunshine/50"
              placeholder="••••••"
            />
          </div>

          {error && (
            <div className="bg-cherry/10 border-[3px] border-cherry rounded-2xl p-3 text-sm font-bold text-cherry">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-chunky bg-leaf text-white shadow-chunky-green text-lg disabled:opacity-50"
          >
            {loading ? "Aguarde..." : isSignup ? "🎉 Criar conta" : "▶️ Entrar"}
          </button>

          <button
            type="button"
            onClick={() => setIsSignup(!isSignup)}
            className="w-full text-sm text-ink/70 underline font-bold"
          >
            {isSignup
              ? "Já tem conta? Faça login"
              : "Primeira vez? Crie sua conta"}
          </button>
        </form>
      </div>
    </div>
  );
}
