dev:
	docker volume create -o mountpoint=./backend --name=back-volume
	docker volume create -o mountpoint=./frontend --name=front-volume
	docker volume create -o mountpoint=./postgres_data --name=postgres-data
	docker compose up --build -d
