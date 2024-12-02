.PHONY: build run stop clean install dev test lint

# Docker commands
build:
	docker compose build

run:
	docker compose up

run-d:
	docker compose up -d

stop:
	docker compose down

# Node.js commands
install:
	npm install

dev:
	npm run dev

test:
	npm test

lint:
	npm run lint

# Cleanup commands
clean:
	docker compose down -v
	rm -rf node_modules
	rm -f package-lock.json
	rm -f yarn.lock

# Help command
help:
	@echo "Available commands:"
	@echo "  make build     - Build Docker containers"
	@echo "  make run      - Run containers in foreground"
	@echo "  make run-d    - Run containers in background"
	@echo "  make stop     - Stop running containers"
	@echo "  make install  - Install Node.js dependencies"
	@echo "  make dev      - Run development server"
	@echo "  make test     - Run tests"
	@echo "  make lint     - Run linter"
	@echo "  make clean    - Remove containers, volumes, and dependencies"
	@echo "  make help     - Show this help message"
