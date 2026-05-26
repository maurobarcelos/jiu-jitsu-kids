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
    <div className="min-h-screen flex items-center justify-center px-6 bg-white">
      <div className="w-full max-w-sm animate-fade-in">
        {/* Mascote */}
        <div className="text-center mb-10">
          <div className="text-7xl mb-4 animate-float inline-block">🐯</div>
          <h1 className="font-display text-4xl font-semibold text-ink tracking-tight">
            Tigrão Jiu Jitsu
          </h1>
          <p className="text-sm text-muted mt-2">
            {isSignup ? "Crie sua conta para começar" : "Faça login para continuar"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-display font-semibold text-muted uppercase tracking-wider mb-2">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface border border-border rounded-2xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-leaf/30 focus:border-leaf transition-all"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="block text-xs font-display font-semibold text-muted uppercase tracking-wider mb-2">
              Senha
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface border border-border rounded-2xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-leaf/30 focus:border-leaf transition-all"
              placeholder="••••••"
            />
          </div>

          {error && (
            <div className="bg-cherry/10 border border-cherry/30 rounded-2xl p-3 text-sm text-cherry">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary text-base disabled:opacity-50"
          >
            {loading ? "Aguarde..." : isSignup ? "Criar conta" : "Entrar"}
          </button>

          <button
            type="button"
            onClick={() => setIsSignup(!isSignup)}
            className="w-full text-sm text-muted hover:text-ink transition-colors py-2"
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
