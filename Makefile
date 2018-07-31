


default: less ts

ts:
	tsc src/image-map.ts --sourceMap --outDir docs/ --outFile docs/image-map.js --allowJs

less:
	lessc src/image-map.less docs/image-map.css

doc:
	pug --out docs/ src/docs/index.pug

all: default doc