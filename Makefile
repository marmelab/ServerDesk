.PHONY: install dev build preview lint typecheck format test

install:
	npm install

start-app:
	npm run dev

start-supabase:
	npx supabase start

stop-supabase:
	npx supabase stop

start: start-supabase start-app

dev: start

build:
	npm run build

preview:
	npm run preview

lint:
	npm run lint

typecheck:
	npm run typecheck

format:
	npm run format

test:
	npm run test
