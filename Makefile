.PHONY: start ps watch down clean-oidc clean-keycloak clean

start:
	bash generate-credentials.sh
	docker-compose up -d

ps:
	docker ps --format "table {{.ID}}\t{{.Image}}\t{{.Ports}}\t{{.Names}}"

watch:
	watch 'docker ps --format "table {{.ID}}\t{{.Image}}\t{{.Ports}}\t{{.Names}}"'

down:
	docker-compose down

clean-oidc:
	docker kill f5_oidc_simulator
	docker rmi --force f5_oidc_simulator

clean-keycloak:
	docker kill keycloak
	docker rmi --force quay.io/keycloak/keycloak:24.0.2

clean: 
	docker kill $$(docker ps -q) 2> /dev/null || true
	docker system prune -a
	docker volume rm $(docker volume ls -qf dangling=true)
