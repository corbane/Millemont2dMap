
Compiled with Typescript & Less

`tsc src/index.ts --sourceMap --outDir docs/ --outFile docs/index.js`

`lessc src/chateau-de-millemont_c.less docs/chateau-de-millemont_c.css`

Demo : https://corbane.github.io/Millemont2dMap/

Api documentation : https://corbane.github.io/Millemont2dMap/api


## The SVG file

The svg file is formatted with:

- A background image that also defines the area of the SVG view.
  The `image` element must define the attributes `x`, `y`, `width` and `height`.
- And several elements with unique id defined that define the contours of the regions inside the background image.
