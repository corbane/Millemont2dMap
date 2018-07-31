


default: less ts

ts:
	tsc src/index.ts --sourceMap --outDir docs/ --outFile docs/index.js --allowJs

less:
	lessc src/chateau-de-millemont_c.less docs/chateau-de-millemont_c.css