install: install-deps install-flow-typed create-env

create-env:
	cp -n .env.example .env || :

console:
	npm run gulp console

init:
	npm run gulp init

start:
	DEBUG="app:*" npm run nodemon -- --watch src --ext '.js,.jsx,.scss,.hbs' --exec npm run gulp -- server

install-deps:
	npm install

install-flow-typed:
	npm run flow-typed install

build:
	rm -rf dist
	npm run build

test: init
	NODE_ENV=test npm test

check-types:
	npm run flow

lint:
	npm run eslint -- src __tests__

publish:
	npm publish

compose:
	docker-compose up

compose-setup:
	docker-compose run web npm install

compose-bash:
	docker-compose run web bash

compose-build:
	docker-compose build

compose-test:
	docker-compose run web make test

.PHONY: test