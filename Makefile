# docker volume create --name=postgres-data
dev:
	docker compose up --build

clean:
	docker compose down
	docker system prune -af
