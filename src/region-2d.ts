/// <reference path="info-point.ts" />

module MMMFest
{
    export class Region2d 
    {
        readonly infoPoint: InfoPoint

        constructor (
            protected svg: SVGSVGElement,
            readonly path: SVGPolygonElement, readonly image: SVGImageElement
        ) {
            image.style.transition = "all 0.25s"

            var bbox = path.getBBox ()
            this.infoPoint = new InfoPoint (svg.ownerDocument.querySelector ("svg"))
            this.infoPoint.setPosition (bbox.x + bbox.width / 2, bbox.y + bbox.height / 2)
            this.infoPoint.setScale (10)

            /*var bbox = path.getBBox (),
                c = this.ownerDoc.createElementNS ("http://www.w3.org/2000/svg", "circle")

            c.setAttributeNS (null, "cx", (bbox.x + bbox.width / 2).toString ())
            c.setAttributeNS (null, "cy", (bbox.y + bbox.height / 2).toString ())
            c.setAttributeNS (null, "r", "100")
            c.setAttributeNS (null, "fill", "#FFD500")
            c.setAttributeNS (null, "stroke-width", "15")
            c.style.fillOpacity = "0.5"
            c.style.transition = "all 0.5s"

            this.ownerDoc.querySelector ("svg").appendChild (c)
            this.centerPoint = c*/

            if( !this.svg.ownerDocument.querySelector ("#blur-filter") )
            {
                var tmp = this.svg.ownerDocument.createElementNS ("http://www.w3.org/2000/svg", "g")
                tmp.innerHTML = `<filter id="blur-filter" x="0" y="0">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="8" />
                </filter>`

                this.svg.ownerDocument.querySelector ("svg g").appendChild (tmp.children[0])
            }
        }

        onSelect? (sh: this): void
        onUnselect? ( sh: this): void

        private active: boolean = false

        select ()
        {
            this.active = true
            this.path.style.stroke = "white"
            this.path.style.filter = "url(#blur-filter)"
            this.infoPoint.select ()
        }

        unselect ()
        {
            this.active = false
            this.path.style.stroke = ""
            this.path.style.filter = ""
            this.infoPoint.unselect ()
        }

        hide ()
        {
            this.path.style.strokeWidth = this.active ? "" : "0"
            this.image.style.opacity    = this.active ? "1" : "0"
            //this.centerPoint.style.fillOpacity = this.active ? "1" : "0.5"
            //this.infoPoint.svg.style.fillOpacity = this.active ? "1" : "0.5"
        }

        show ()
        {
            this.path.style.strokeWidth = ""
            this.image.style.opacity = "1"
            //this.centerPoint.style.fillOpacity = "1"
            //this.infoPoint.svg.style.fillOpacity = "1"
        }
    }
}