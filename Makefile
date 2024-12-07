include .env
export

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

# Yarn commands
install:
	yarn install

dev:
	yarn dev

build-app:
	yarn build

preview:
	yarn preview

# Cleanup commands
clean:
	docker compose down -v
	rm -rf node_modules
	rm -f package-lock.json
	rm -f yarn.lock

# Help command
help:
	@echo "Available commands:"
	@echo "Docker commands:"
	@echo "  make build     - Build Docker containers"
	@echo "  make run      - Run containers in foreground"
	@echo "  make run-d    - Run containers in background"
	@echo "  make stop     - Stop running containers"
	@echo ""
	@echo "Yarn commands:"
	@echo "  make install  - Install dependencies with Yarn"
	@echo "  make dev      - Run development server"
	@echo "  make build-app - Build application"
	@echo "  make preview  - Run preview server"
	@echo ""
	@echo "Utility commands:"
	@echo "  make clean    - Remove containers, volumes, and dependencies"
	@echo "  make help     - Show this help message"
