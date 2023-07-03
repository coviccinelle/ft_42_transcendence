# docker volume create --name=postgres-data
dev:
	(cd frontend && npm install)
	(cd backend && npm install)
	docker compose up --build -d
