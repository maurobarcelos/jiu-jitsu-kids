-- =====================================================
-- JIU JITSU KIDS - Schema do Supabase
-- =====================================================
-- Cole isso no SQL Editor do Supabase e clique "Run"
-- =====================================================

-- Tabela de treinos
create table public.training_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  date date not null default current_date,
  garra int not null check (garra >= 0 and garra <= 5),
  esforco int not null check (esforco >= 0 and esforco <= 5),
  foco int not null check (foco >= 0 and foco <= 5),
  coragem int not null check (coragem >= 0 and coragem <= 5),
  total_stars int generated always as (garra + esforco + foco + coragem) stored,
  reward_minutes int not null check (reward_minutes >= 5 and reward_minutes <= 60),
  notes text,
  created_at timestamptz default now() not null
);

-- Indexes
create index idx_training_sessions_user_date 
  on public.training_sessions(user_id, date desc);

create index idx_training_sessions_created 
  on public.training_sessions(created_at desc);

-- RLS (Row Level Security) - cada usuário só vê seus próprios treinos
alter table public.training_sessions enable row level security;

create policy "Users can view their own sessions"
  on public.training_sessions for select
  using (auth.uid() = user_id);

create policy "Users can insert their own sessions"
  on public.training_sessions for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own sessions"
  on public.training_sessions for update
  using (auth.uid() = user_id);

create policy "Users can delete their own sessions"
  on public.training_sessions for delete
  using (auth.uid() = user_id);

-- =====================================================
-- PRONTO! Agora vá em Authentication > Providers e:
-- 1. Email: ATIVAR
-- 2. Confirm email: DESATIVAR (opcional, deixa mais simples)
-- =====================================================
