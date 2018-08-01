
default: less ts

all: default doc

ts:
	tsc

less:
	lessc src/style/image-map.less build/image-map.css

doc: api
	lessc src/docs/style/index.less src/docs/style/index.css
	pug --out docs/ src/docs/index.pug
	cp build/* docs/

api:
	typedoc --out docs/api/ --theme default --mode file src/image-map.ts