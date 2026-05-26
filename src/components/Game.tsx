"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-client";
import {
  CRITERIA,
  Scores,
  TrainingSession,
  calculateReward,
  getMedal,
} from "@/types/training";
import StarRating from "./StarRating";
import ResultScreen from "./ResultScreen";
import { playSound } from "@/lib/sounds";

const INITIAL_SCORES: Scores = { garra: 0, esforco: 0, foco: 0, coragem: 0 };

export default function Game({
  userEmail,
  onLogout,
}: {
  userEmail: string;
  onLogout: () => void;
}) {
  const [scores, setScores] = useState<Scores>(INITIAL_SCORES);
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [resultMin, setResultMin] = useState(0);
  const [resultStars, setResultStars] = useState(0);

  const supabase = createClient();
  const total = Object.values(scores).reduce((a, b) => a + b, 0);
  const allFilled = Object.values(scores).every((v) => v > 0);
  const progressPct = (Object.values(scores).filter((v) => v > 0).length / 4) * 100;

  useEffect(() => {
    loadSessions();
  }, []);

  async function loadSessions() {
    setLoading(true);
    const { data, error } = await supabase
      .from("training_sessions")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) setSessions(data as TrainingSession[]);
    setLoading(false);
  }

  async function handleSubmit() {
    if (!allFilled || saving) return;
    setSaving(true);

    const reward = calculateReward(total);
    const today = new Date().toISOString().split("T")[0];

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      alert("Ops! Sessão expirada. Faça login novamente.");
      setSaving(false);
      return;
    }

    const { error } = await supabase.from("training_sessions").insert({
      user_id: userData.user.id,
      date: today,
      garra: scores.garra,
      esforco: scores.esforco,
      foco: scores.foco,
      coragem: scores.coragem,
      reward_minutes: reward,
    });

    if (error) {
      alert("Ops! Erro: " + error.message);
      setSaving(false);
      return;
    }

    setResultMin(reward);
    setResultStars(total);
    setShowResult(true);
    playSound("win");

    setScores(INITIAL_SCORES);
    await loadSessions();
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Apagar este treino?")) return;
    await supabase.from("training_sessions").delete().eq("id", id);
    await loadSessions();
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    onLogout();
  }

  // Stats
  const totalStars = sessions.reduce((a, s) => a + s.total_stars, 0);
  const totalMin = sessions.reduce((a, s) => a + s.reward_minutes, 0);
  const totalSess = sessions.length;

  // Streak
  let streak = 0;
  for (const s of sessions) {
    if (s.total_stars >= 10) streak++;
    else break;
  }

  // Semana
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  weekStart.setHours(0, 0, 0, 0);
  const weekCount = sessions.filter(
    (s) => new Date(s.created_at) >= weekStart
  ).length;

  return (
    <>
      {showResult && (
        <ResultScreen
          totalStars={resultStars}
          rewardMinutes={resultMin}
          onContinue={() => setShowResult(false)}
        />
      )}

      <div className="min-h-screen bg-white pb-12">
        <div className="max-w-md mx-auto px-5 pt-5">
          {/* HEADER */}
          <header className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="text-3xl animate-float">🐯</div>
              <div>
                <h1 className="font-display text-xl font-semibold text-ink leading-none">
                  Tigrão JJ
                </h1>
                <p className="text-xs text-muted mt-1">Vamos treinar!</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="text-muted hover:text-ink transition-colors p-2"
              title="Sair"
              aria-label="Sair"
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </header>

          {/* PROGRESSO SEMANAL - estilo Brilliant */}
          <div className="card-soft p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-xs font-display font-semibold text-muted uppercase tracking-wider">
                  Meta semanal
                </div>
                <div className="font-display text-2xl font-semibold text-ink mt-0.5 tabular-nums">
                  {weekCount}<span className="text-muted text-lg">/4</span>
                </div>
              </div>
              {streak > 0 && (
                <div className="flex items-center gap-1.5 bg-tangerine/10 text-tangerine px-3 py-1.5 rounded-full">
                  <span>🔥</span>
                  <span className="font-display font-semibold text-sm">{streak}</span>
                </div>
              )}
            </div>
            <div className="h-2 bg-border rounded-full overflow-hidden">
              <div
                className="h-full bg-leaf rounded-full transition-all duration-700"
                style={{ width: `${Math.min(100, (weekCount / 4) * 100)}%` }}
              />
            </div>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            <StatCard icon="⭐" value={totalStars} label="Estrelas" />
            <StatCard icon="📺" value={totalMin} label="Min TV" />
            <StatCard icon="🏆" value={totalSess} label="Treinos" />
          </div>

          {/* AVALIAÇÃO */}
          <div className="card-lift p-5 mb-4">
            <div className="mb-5">
              <h2 className="font-display text-xl font-semibold text-ink">
                Como foi o treino?
              </h2>
              <p className="text-sm text-muted mt-1">
                Avalie cada item com estrelas
              </p>

              {/* Mini progress */}
              <div className="mt-4 h-1 bg-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-leaf rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>

            <div className="space-y-4">
              {CRITERIA.map((c) => (
                <CriterionCard
                  key={c.key}
                  emoji={c.emoji}
                  question={c.question}
                  value={scores[c.key]}
                  onChange={(v) => setScores({ ...scores, [c.key]: v })}
                />
              ))}
            </div>

            <button
              onClick={handleSubmit}
              disabled={!allFilled || saving}
              className="w-full btn-accent mt-6 text-base"
            >
              {saving ? "Salvando..." : "Ver recompensa"}
            </button>
          </div>

          {/* HISTÓRICO */}
          <div className="mb-4">
            <h2 className="font-display text-lg font-semibold text-ink mb-3 px-1">
              Meus treinos
            </h2>

            {loading ? (
              <div className="text-center py-8 text-muted text-sm">
                Carregando...
              </div>
            ) : sessions.length === 0 ? (
              <div className="card-soft p-6 text-center">
                <div className="text-4xl mb-2">🥋</div>
                <p className="text-sm text-muted">
                  Nenhum treino ainda. Vamos começar!
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {sessions.slice(0, 20).map((s) => (
                  <HistoryItem
                    key={s.id}
                    session={s}
                    onDelete={() => handleDelete(s.id)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="text-center text-xs text-muted/60 mt-6 font-display">
            {userEmail}
          </div>
        </div>
      </div>
    </>
  );
}

function StatCard({
  icon,
  value,
  label,
}: {
  icon: string;
  value: number;
  label: string;
}) {
  return (
    <div className="card-soft p-3 text-center">
      <div className="text-xl mb-1">{icon}</div>
      <div className="font-display font-semibold text-xl text-ink tabular-nums">
        {value}
      </div>
      <div className="text-[10px] font-display font-semibold text-muted uppercase tracking-wider mt-0.5">
        {label}
      </div>
    </div>
  );
}

function CriterionCard({
  emoji,
  question,
  value,
  onChange,
}: {
  emoji: string;
  question: string;
  value: number;
  onChange: (v: number) => void;
}) {
  const done = value > 0;
  return (
    <div
      className={`rounded-2xl p-4 border transition-all ${
        done
          ? "bg-leafSoft border-leaf/30"
          : "bg-surface border-border"
      }`}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="text-2xl">{emoji}</div>
        <div className="font-display font-semibold text-sm text-ink flex-1">
          {question}
        </div>
        {done && (
          <div className="text-leaf">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>
      <StarRating value={value} onChange={onChange} />
    </div>
  );
}

function HistoryItem({
  session,
  onDelete,
}: {
  session: TrainingSession;
  onDelete: () => void;
}) {
  const date = new Date(session.created_at).toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  return (
    <div className="card-soft p-3 flex items-center gap-3">
      <div className="w-11 h-11 bg-surface rounded-full flex items-center justify-center text-2xl flex-shrink-0">
        {getMedal(session.total_stars)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-display font-semibold text-sm text-ink capitalize">
          {date}
        </div>
        <div className="text-xs text-muted">
          {session.total_stars}/20 estrelas
        </div>
      </div>
      <div className="font-display font-semibold text-sm text-leaf bg-leafSoft px-3 py-1.5 rounded-full">
        +{session.reward_minutes}min
      </div>
      <button
        onClick={onDelete}
        className="text-muted/40 hover:text-cherry transition-colors p-1 flex-shrink-0"
        aria-label="Apagar"
      >
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
}
