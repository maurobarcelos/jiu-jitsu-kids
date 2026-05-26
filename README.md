# 🐯 Tigrão Jiu Jitsu

Sistema de recompensas gamificado para acompanhar treinos de jiu jitsu. Mobile-first, com cara de Duolingo, feito pensando em crianças de 5 anos.

## ✨ Features

- 🎮 Visual lúdico tipo Duolingo (cores vibrantes, mascote, sons)
- ⭐ Avaliação por estrelas em 4 critérios (garra, esforço, foco, coragem)
- 📊 Stats de evolução (estrelas totais, minutos de TV, treinos)
- 🔥 Streak (sequência de treinos bons)
- 🎯 Meta semanal (4 treinos)
- 🎊 Confete + sons ao concluir treino
- 🏆 Medalhas por desempenho
- 📱 PWA (instalável no celular)
- 🔐 Login com email/senha (Supabase Auth)
- ☁️ Dados sincronizados na nuvem

## 🚀 Setup (passo a passo)

### 1. Supabase (5 min)

1. Acesse [supabase.com](https://supabase.com) e crie um novo projeto
   - Nome: `jiu-jitsu-kids`
   - Senha do DB: anote (não precisa pra essa app)
   - Região: South America (São Paulo)

2. Espere ~2 min o projeto ficar pronto

3. Vá em **SQL Editor** > **New query**, cole o conteúdo de `supabase-schema.sql` e clique **Run**

4. Vá em **Authentication** > **Providers** > **Email**:
   - Confirme que está ativado
   - **Desative** "Confirm email" (pra simplificar)

5. Vá em **Project Settings** > **API** e copie:
   - `Project URL` → será o `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → será o `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2. Rodar localmente

```bash
# Instala dependências
npm install

# Cria .env.local com suas credenciais
cp .env.example .env.local
# Edite .env.local e cole os valores do Supabase

# Roda
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

### 3. Deploy no Vercel

1. Suba pro GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/jiu-jitsu-kids.git
git push -u origin main
```

2. Acesse [vercel.com](https://vercel.com) > **Add New** > **Project**
3. Importe o repo `jiu-jitsu-kids`
4. **Antes de Deploy**, adicione as Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL` = (sua URL)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (sua key)
5. Deploy!

### 4. Instalar no celular como app

1. Abra a URL do Vercel no Safari (iOS) ou Chrome (Android)
2. **iOS:** botão de compartilhar > "Adicionar à Tela de Início"
3. **Android:** menu (3 pontinhos) > "Adicionar à tela inicial"

Pronto, vira app de verdade na tela do celular dela! 📱

## 🎯 Como funciona o cálculo de recompensa

- 4 critérios × 5 estrelas = 20 estrelas no máximo
- Fórmula: `5 + (estrelas/20) × 55`
- Arredondado para múltiplos de 5
- Mínimo: 5 min | Máximo: 60 min

| Estrelas | Minutos de TV |
|----------|---------------|
| 20/20 ⭐⭐⭐⭐⭐ | 60 min 🏆 |
| 16/20 | 50 min 🥇 |
| 12/20 | 40 min 🥈 |
| 8/20 | 25 min 🥉 |
| 4/20 | 15 min 🐯 |

## 🛠 Stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Supabase (Auth + Database)
- PWA-ready

## 📝 Estrutura

```
jiu-jitsu-kids/
├── src/
│   ├── app/
│   │   ├── layout.tsx     # Layout root + fontes + viewport mobile
│   │   ├── page.tsx       # Página principal (auth + game)
│   │   └── globals.css    # Estilos globais
│   ├── components/
│   │   ├── AuthGate.tsx   # Tela de login/cadastro
│   │   ├── Game.tsx       # Componente principal
│   │   ├── StarRating.tsx # Estrelas clicáveis
│   │   └── Confetti.tsx   # Confete na vitória
│   ├── lib/
│   │   ├── supabase-client.ts  # Client do Supabase
│   │   └── sounds.ts           # Sons via Web Audio API
│   └── types/
│       └── training.ts    # Tipos + lógica de recompensa
├── public/
│   └── manifest.json      # PWA manifest
└── supabase-schema.sql    # SQL pra rodar no Supabase
```
