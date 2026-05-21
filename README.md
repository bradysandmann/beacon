# Beacon

Lead-gen scraper plus Claude-scored ICP enrichment. Drop a search query like "Plumbers Tampa FL" and Beacon returns a ranked, exportable list of local businesses with a fit score and intent label on every row.

## Stack

Vite, React 18, TypeScript, Tailwind 3, Supabase (Postgres plus magic-link auth, row-level security on), Anthropic SDK with browser-direct headers, Vercel for deploy.

## 30-second install

```
git clone https://github.com/bradysandmann/beacon
cd beacon
npm install
cp .env.example .env.local   # then fill VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_ANTHROPIC_API_KEY
npm run dev
```

Visit `http://localhost:5173`, sign in with a magic link, and try the seed query "Plumbers Tampa FL" to populate the sample list.

## Database

Two tables in the `beacon` Postgres schema, both with RLS policies that restrict every read and write to the signed-in user:

- `beacon.targets` (id, user_id, query, created_at)
- `beacon.prospects` (id, target_id, company_name, phone, address, website, employee_count_est, fit_score, intent_signal, claude_summary, raw_json, created_at)

Schema and policy SQL is in the `Database` section of this README.

## Honest limitation

Beacon ships in sketch mode. The Apify Google Maps scraper and the live Claude scorer are both wired in source, but they require paid third-party keys that the current build does not have. Until those land:

- The "Plumbers Tampa FL" seed query returns 25 pre-baked fictional but realistic prospects so reviewers can see a populated table.
- Any other query generates a 12-row deterministic synthetic set using the same scoring rules.
- The "Score with Claude" button calls the Anthropic SDK with the correct headers; on a 401 or insufficient-quota error it falls back to a deterministic rule-based scorer so the UI never blocks.

Swapping in real scrape and live scoring is one file each (`src/lib/seed.ts` for the scraper hook, `src/lib/score.ts` for the Anthropic call).

## Pages

- `/` landing with the sample preview
- `/sample` read-only 25-row sample (no auth needed)
- `/signin` magic-link only
- `/app` target list plus new-target form
- `/app/targets/:id` per-target prospect table with sort, filter, rescore, CSV export

## Database SQL

```sql
create schema if not exists beacon;

create table if not exists beacon.targets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  query text not null,
  created_at timestamptz default now()
);

create table if not exists beacon.prospects (
  id uuid primary key default gen_random_uuid(),
  target_id uuid references beacon.targets(id) on delete cascade,
  raw_json jsonb,
  company_name text,
  phone text,
  address text,
  website text,
  employee_count_est int,
  fit_score int,
  intent_signal text,
  claude_summary text,
  created_at timestamptz default now()
);

alter table beacon.targets enable row level security;
create policy "users see own targets" on beacon.targets
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

alter table beacon.prospects enable row level security;
create policy "users see prospects of own targets" on beacon.prospects
  for all using (
    exists (select 1 from beacon.targets where beacon.targets.id = beacon.prospects.target_id and beacon.targets.user_id = auth.uid())
  ) with check (
    exists (select 1 from beacon.targets where beacon.targets.id = beacon.prospects.target_id and beacon.targets.user_id = auth.uid())
  );

grant usage on schema beacon to anon, authenticated;
grant select, insert, update, delete on beacon.targets to authenticated;
grant select, insert, update, delete on beacon.prospects to authenticated;
```

## License

MIT. Portfolio build.
