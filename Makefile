
default: less ts

all: default doc api

ts:
	tsc

less:
	lessc  src/style/image-map.less  build/image-map.css

doc: demo
	lessc  src/docs/style/index.less  src/docs/style/index.css
	pug  --out docs/  src/docs/index.pug
	cp  build/*  docs/

demo:
	lessc  src/docs/demo/millemont/style.less  src/docs/demo/millemont/style.css
	pug  --out docs/demo/millemont/  src/docs/demo/millemont/index.pug
	cp  src/docs/demo/millemont/map.*  docs/demo/millemont/
	cp  src/docs/demo/millemont/thumb.*  docs/demo/millemont/
	
	pug  --out docs/demo/turbine/  src/docs/demo/turbine/index.pug
	cp  src/docs/demo/turbine/map.*  docs/demo/turbine/
	cp  src/docs/demo/turbine/thumb.*  docs/demo/turbine/

api:
	typedoc  --out docs/api/  --theme default  --mode file  --entryPoint ImageMap  src/image-map.ts