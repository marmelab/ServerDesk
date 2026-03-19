.PHONY: install dev build preview lint typecheck format test test-e2e

install:
	npm install

start-app:
	npm run dev

start-supabase:
	npx supabase start

name ?= auto_generated_migration
supabase-update-migration:
	npx supabase db diff --schema public --use-migra -f $(name)

supabase-migrate-database: ## apply the migrations to the database
	npx supabase migration up

supabase-reset-database: ## reset (and clear!) the database
	npx supabase db reset

supabase-gen-types:
	npx supabase gen types typescript --local > supabase/types.ts

stop-supabase:
	npx supabase stop

start: start-supabase start-app

dev: start

build:
	npm run build

preview:
	npm run preview

prod-start: build supabase-deploy

prod-deploy: prod-start
	npm run ghpages:deploy

supabase-deploy:
	npx supabase db push
	# npx supabase functions deploy

lint:
	npm run lint

typecheck:
	npm run typecheck

format:
	npm run format

test:
	npm run test

test-e2e: ## Run e2e tests with Playwright (starts Supabase, seeds DB, runs tests)
	@echo "Starting Supabase..."
	@npx supabase start || true
	@echo "Seeding database..."
	@npm run db:seed
	@echo "Running e2e tests..."
	@npm run test:e2e:ui

seed:
	npm run db:seed

prod-seed:
	npm run db:seed:prod
