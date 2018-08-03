
default: lib

all: default doc api

lib:
	tsc
	cp src/vendor/*  build/vendor/
	lessc  src/style/image-map.less  build/image-map.css

doc:
	make -C src/docs/
	cp  -r  src/docs/build/*  docs/

api:
	typedoc  --out docs/api/  --theme default  --mode file  --entryPoint ImageMap  src/image-map.ts