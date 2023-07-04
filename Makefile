# docker volume create --name=postgres-data
dev:
	(cd frontend && npm install)
	(cd backend && npm install)
	docker compose up --build

clean:
	docker compose down
	docker system prune -af