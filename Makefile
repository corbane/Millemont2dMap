
default: less ts

all: default doc

ts:
	tsc src/image-map.ts --sourceMap --outDir docs/ --outFile build/image-map.js --allowJs

less:
	lessc src/image-map.less build/image-map.css

doc:
	lessc src/docs/index.less src/docs/index.css
	pug --out docs/ src/docs/index.pug