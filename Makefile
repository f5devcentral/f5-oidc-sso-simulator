.PHONY: start ps watch down clean-oidc clean-keycloak clean

start:
	bash ./tools/sh/gen-cert-and-key.sh
	docker-compose up -d

ps:
	docker ps --format "table {{.ID}}\t{{.Image}}\t{{.Ports}}\t{{.Names}}"

watch:
	watch 'docker ps --format "table {{.ID}}\t{{.Image}}\t{{.Ports}}\t{{.Names}}"'

down:
	docker-compose down

clean-oidc:
	bash ./tools/sh/clean-app.sh f5-oidc

clean-keycloak:
	bash ./tools/sh/clean-app.sh keycloak

clean: 
	bash ./tools/sh/clean-app.sh keycloak
	bash ./tools/sh/clean-app.sh f5-oidc
