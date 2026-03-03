.PHONY: install dev build preview lint typecheck format test

install:
	npm install

start-app:
	npm run dev

start-supabase:
	npx supabase start

supabase-migrate-database: ## apply the migrations to the database
	npx supabase migration up

supabase-reset-database: ## reset (and clear!) the database
	npx supabase db reset

stop-supabase:
	npx supabase stop

start: start-supabase start-app

dev: start

build:
	npm run build

preview:
	npm run preview

prod-deploy: build supabase-deploy
	npm run ghpages:deploy

supabase-deploy:
	npx supabase db push
	npx supabase functions deploy
	
lint:
	npm run lint

typecheck:
	npm run typecheck

format:
	npm run format

test:
	npm run test
