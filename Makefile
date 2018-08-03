

export docs_out_dir = $(shell realpath docs/)

lib:
	mkdir -p build/vendor/

	tsc
	lessc  src/style/image-map.less  build/image-map.css

	cp src/vendor/*  build/vendor/

	mkdir -p $(docs_out_dir)/
	cp -r build/* $(docs_out_dir)/

all: lib doc api

doc:
	make -C src/docs/

api:
	typedoc  --out docs/api/  --theme default  --mode file  --entryPoint ImageMap  src/image-map.ts