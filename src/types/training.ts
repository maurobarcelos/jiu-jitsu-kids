export type Scores = {
  garra: number;
  esforco: number;
  foco: number;
  coragem: number;
};

export type TrainingSession = {
  id: string;
  user_id: string;
  date: string;
  garra: number;
  esforco: number;
  foco: number;
  coragem: number;
  total_stars: number;
  reward_minutes: number;
  notes: string | null;
  created_at: string;
};

export type Criterion = {
  key: keyof Scores;
  emoji: string;
  question: string;
};

export const CRITERIA: Criterion[] = [
  { key: "garra", emoji: "🔥", question: "Lutei com vontade e garra?" },
  { key: "esforco", emoji: "💪", question: "Me esforcei sem preguiça?" },
  { key: "foco", emoji: "🎯", question: "Prestei atenção no professor?" },
  { key: "coragem", emoji: "🦁", question: "Fui corajosa na luta?" },
];

// Fórmula: 4 critérios × 5 estrelas = 20 max
// 5 min mínimo, 60 min máximo, arredondado para múltiplos de 5
export function calculateReward(totalStars: number): number {
  const reward = 5 + (totalStars / 20) * 55;
  return Math.max(5, Math.min(60, Math.round(reward / 5) * 5));
}

export function getMedal(stars: number): string {
  if (stars >= 18) return "🏆";
  if (stars >= 14) return "🥇";
  if (stars >= 10) return "🥈";
  if (stars >= 6) return "🥉";
  return "🐯";
}

export function getMessage(stars: number): string {
  if (stars >= 18) return "Você é uma CAMPEÃ!";
  if (stars >= 14) return "Excelente trabalho!";
  if (stars >= 10) return "Muito bom! Continue assim!";
  if (stars >= 6) return "Você pode ainda mais!";
  return "Amanhã tem mais! Não desiste!";
}
