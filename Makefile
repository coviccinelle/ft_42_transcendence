dev:
	cd ./vite && npm install
	cd ./nest && npm install
	docker compose up --build

down:
	docker compose down

clean: # !!!!!! Removes the db !!!!!!
	docker compose down -v

clean_cache: # !!!!!! Removes the db !!!!!!
	docker compose down --rmi all --remove-orphans
	docker system prune -af

clean_volumes: # !!!!!! Removes the db !!!!!!
	docker compose down -v --rmi all --remove-orphans
	docker system prune -af --volumes

re: clean dev
