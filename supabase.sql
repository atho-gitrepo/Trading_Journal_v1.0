create table if not exists public.trader_edge_journals (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.trader_edge_journals enable row level security;

create policy "Users can read their own journal"
  on public.trader_edge_journals
  for select
  using (auth.uid() = user_id);

create policy "Users can insert their own journal"
  on public.trader_edge_journals
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own journal"
  on public.trader_edge_journals
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own journal"
  on public.trader_edge_journals
  for delete
  using (auth.uid() = user_id);
