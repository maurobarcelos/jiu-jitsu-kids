"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-client";
import {
  CRITERIA,
  Scores,
  TrainingSession,
  calculateReward,
  getMedal,
  getMessage,
} from "@/types/training";
import StarRating from "./StarRating";
import Confetti from "./Confetti";
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
  const [resultMsg, setResultMsg] = useState("");
  const [confettiTrigger, setConfettiTrigger] = useState(0);

  const supabase = createClient();
  const total = Object.values(scores).reduce((a, b) => a + b, 0);
  const allFilled = Object.values(scores).every((v) => v > 0);

  // Carregar sessões
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

  function getMascotSpeech() {
    if (total === 0) return "Oi! Pronta pra treinar? 💪";
    if (total < 8) return "Continue! Quantas estrelas? ⭐";
    if (total < 15) return "Uau! Você é incrível! 🎉";
    return "PERFEITO! Você é uma LUTADORA! 🏆";
  }

  async function handleSubmit() {
    if (!allFilled || saving) return;
    setSaving(true);

    const reward = calculateReward(total);
    const today = new Date().toISOString().split("T")[0];

    const { error } = await supabase.from("training_sessions").insert({
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
    setResultMsg(getMessage(total));
    setShowResult(true);
    setConfettiTrigger((c) => c + 1);
    playSound("win");

    setScores(INITIAL_SCORES);
    await loadSessions();
    setSaving(false);

    setTimeout(() => setShowResult(false), 6000);
  }

  async function handleDelete(id: string) {
    if (!confirm("Apagar este treino?")) return;
    await supabase.from("training_sessions").delete().eq("id", id);
    await loadSessions();
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

  // Progresso semanal (a partir de domingo)
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  weekStart.setHours(0, 0, 0, 0);
  const weekCount = sessions.filter(
    (s) => new Date(s.created_at) >= weekStart
  ).length;
  const weekPct = Math.min(100, (weekCount / 4) * 100);

  async function handleLogout() {
    await supabase.auth.signOut();
    onLogout();
  }

  return (
    <div className="min-h-screen bg-cream pb-10">
      <Confetti trigger={confettiTrigger} />

      <div className="max-w-md mx-auto px-4 pt-4">
        {/* HEADER + MASCOTE */}
        <div className="bg-gradient-to-br from-sunshine to-tangerine border-[3px] border-ink rounded-3xl p-4 shadow-chunky mb-4 flex items-center gap-3">
          <div className="w-16 h-16 bg-white rounded-full border-[3px] border-ink flex items-center justify-center text-4xl animate-bounce-slow flex-shrink-0">
            🐯
          </div>
          <div className="flex-1 font-display font-bold text-ink text-base leading-tight">
            {getMascotSpeech()}
          </div>
          <button
            onClick={handleLogout}
            className="text-xs bg-white border-2 border-ink rounded-xl px-2 py-1 font-bold flex-shrink-0"
            title="Sair"
          >
            🚪
          </button>
        </div>

        {/* PROGRESSO SEMANAL */}
        <div className="card-chunky p-3 mb-4">
          <div className="flex justify-between items-center text-sm font-display font-bold mb-2">
            <span>🎯 Meta da semana</span>
            <span className="bg-cherry text-white px-3 py-1 rounded-xl border-2 border-ink">
              🔥 {streak}
            </span>
          </div>
          <div className="h-6 bg-gray-200 rounded-full border-2 border-ink overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-leaf to-leaf/80 transition-all duration-700 flex items-center justify-end pr-2 text-white text-xs font-bold rounded-full"
              style={{ width: `${weekPct}%`, minWidth: "30px" }}
            >
              {weekCount}/4
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <StatBubble icon="⭐" value={totalStars} label="Estrelas" />
          <StatBubble icon="📺" value={totalMin} label="Min TV" />
          <StatBubble icon="🏆" value={totalSess} label="Treinos" />
        </div>

        {/* RESULTADO */}
        {showResult && (
          <div className="bg-gradient-to-br from-leaf to-leaf/80 border-[3px] border-ink rounded-3xl p-6 shadow-chunky-green text-white text-center mb-4 animate-slide-up">
            <div className="text-sm font-display font-bold uppercase">
              Você ganhou
            </div>
            <div className="text-6xl font-display font-bold my-2 drop-shadow-[4px_4px_0_#2C8A02]">
              {resultMin}
            </div>
            <div className="text-base font-display font-bold uppercase">
              minutos de TV! 📺
            </div>
            <div className="mt-3 inline-block bg-white/25 rounded-xl px-3 py-1 text-sm font-bold">
              {resultMsg}
            </div>
          </div>
        )}

        {/* AVALIAÇÃO */}
        <div className="card-chunky p-4 mb-4">
          <div className="font-display font-bold text-lg text-center mb-4">
            ⚔️ Como foi o treino?
          </div>

          {CRITERIA.map((c) => (
            <div
              key={c.key}
              className="bg-sunshine/20 border-[3px] border-ink rounded-2xl p-3 mb-3"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-white rounded-full border-[3px] border-ink flex items-center justify-center text-2xl flex-shrink-0">
                  {c.emoji}
                </div>
                <div className="font-display font-bold text-sm flex-1 leading-tight">
                  {c.question}
                </div>
              </div>
              <StarRating
                value={scores[c.key]}
                onChange={(v) => setScores({ ...scores, [c.key]: v })}
              />
            </div>
          ))}

          <button
            onClick={handleSubmit}
            disabled={!allFilled || saving}
            className="w-full btn-chunky bg-leaf text-white shadow-chunky-green text-base uppercase tracking-wide disabled:bg-gray-300 disabled:shadow-chunky-sm disabled:text-gray-500"
          >
            {saving ? "Salvando..." : "🎁 Ver recompensa!"}
          </button>
        </div>

        {/* HISTÓRICO */}
        <div className="card-chunky p-4">
          <div className="font-display font-bold text-lg text-center mb-4">
            📅 Meus treinos
          </div>

          {loading ? (
            <div className="text-center py-6 text-ink/60">Carregando...</div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-6 text-ink/60 text-sm">
              Nenhum treino ainda! Vamos começar? 🥋
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

        <div className="text-center text-xs text-ink/40 mt-4 font-bold">
          {userEmail}
        </div>
      </div>
    </div>
  );
}

function StatBubble({
  icon,
  value,
  label,
}: {
  icon: string;
  value: number;
  label: string;
}) {
  return (
    <div className="card-chunky p-3 text-center shadow-chunky-sm">
      <div className="text-2xl mb-1">{icon}</div>
      <div className="font-display font-bold text-xl text-ink">{value}</div>
      <div className="text-[10px] font-bold uppercase text-ink/60">{label}</div>
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
    <div className="bg-cream border-[3px] border-ink rounded-2xl p-3 flex items-center gap-3">
      <div className="w-12 h-12 bg-white rounded-full border-[3px] border-ink flex items-center justify-center text-2xl flex-shrink-0">
        {getMedal(session.total_stars)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-display font-bold text-sm text-ink">{date}</div>
        <div className="text-xs text-ink/60">
          {session.total_stars}/20 ⭐
        </div>
      </div>
      <div className="bg-leaf text-white px-3 py-1.5 rounded-xl border-2 border-ink font-bold text-sm">
        📺 {session.reward_minutes}min
      </div>
      <button
        onClick={onDelete}
        className="w-8 h-8 bg-cherry text-white rounded-full border-2 border-ink font-bold flex-shrink-0"
        aria-label="Apagar"
      >
        ✕
      </button>
    </div>
  );
}
