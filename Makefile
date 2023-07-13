dev:
	docker compose up --build

clean: # !!!!!! Removes the db !!!!!!
	docker compose down -v

clean_cache: # !!!!!! Removes the db !!!!!!
	docker compose down --rmi all --remove-orphans
	docker system prune -af

clean_volumes: # !!!!!! Removes the db !!!!!!
	docker compose down -v --rmi all --remove-orphans
	docker system prune -af --volumes

re: clean dev
