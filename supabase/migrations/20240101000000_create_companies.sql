create table public.companies (
  id bigint generated always as identity primary key,
  name text not null,
  created_at timestamptz not null default now()
);

insert into public.companies (name) values ('acme');
