
default: less ts

all: default doc api

ts:
	tsc
	cp src/vendor/*  build/vendor/

less:
	lessc  src/style/image-map.less  build/image-map.css

doc:
	lessc  src/docs/style/index.less  docs/style/index.css
	pug  --out docs/  src/docs/index.pug
	cp  src/docs/script/*.js  docs/script/
	cp  -r  build/*  docs/
	make demo

demo:
	lessc  src/docs/demo/millemont/style.less  src/docs/demo/millemont/style.css
	pug  --out docs/demo/millemont/  src/docs/demo/millemont/index.pug
	cp  src/docs/demo/millemont/map.*    docs/demo/millemont/
	cp  src/docs/demo/millemont/thumb.*  docs/demo/millemont/
	cp  src/docs/demo/millemont/*.css    docs/demo/millemont/
	cp  src/docs/demo/millemont/*.js     docs/demo/millemont/
	cp  src/docs/demo/millemont/region*.json   docs/demo/millemont/
	
	lessc  src/docs/demo/turbine/style.less  src/docs/demo/turbine/style.css
	pug  --out docs/demo/turbine/  src/docs/demo/turbine/index.pug
	cp  src/docs/demo/turbine/map.*    docs/demo/turbine/
	cp  src/docs/demo/turbine/thumb.*  docs/demo/turbine/
	cp  src/docs/demo/turbine/*.css    docs/demo/turbine/
	cp  src/docs/demo/turbine/*.js     docs/demo/turbine/

api:
	typedoc  --out docs/api/  --theme default  --mode file  --entryPoint ImageMap  src/image-map.ts