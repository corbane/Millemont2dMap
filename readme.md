
Compiled with Typescript & Less

`tsc src/index.ts --sourceMap --outDir docs/ --outFile docs/index.js`

`lessc src/chateau-de-millemont_c.less docs/chateau-de-millemont_c.css`

Demo : https://corbane.github.io/Millemont2dMap/


## The SVG file

The svg file is formatted with:

- A background image that also defines the area of the SVG view.
  The `image` element must define the attributes `x`, `y`, `width` and `height`.
- And several `polygon` elements that define the contours of the regions inside the background image.

> All of these items must have a unique id

```svg
<svg
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    version="1.0"
    xml:space="preserve">
    <image id="id1" width="8669.85" height="5782.73" x="0" y="0" xlink:href="chateau-de-millemont_c.jpg"/>
    <polygon id="id2" points=" ... "/>
    <polygon id="id3" points=" ... "/>
    <polygon id="id4" points=" ... "/>
    ...
</svg>
```svg