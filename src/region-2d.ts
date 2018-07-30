/// <reference path="info-point.ts" />

module MMMFest
{
    export class Region2d 
    {
        readonly path: SVGPolygonElement
        readonly image: SVGImageElement
        readonly infoPoint: InfoPoint

        constructor (protected container: SVGSVGElement, options: Region2d.IOptions)
        {
            this.path = typeof options.path == "string" ? container.ownerDocument.querySelector (options.path) : options.path

            this.image = typeof options.image == "string" ? container.ownerDocument.querySelector (options.image) : options.image
            this.image.style.transition = "all 0.25s"

            if( options.onSelect )
                this.onSelect = options.onSelect

            if( options.onUnselect )
                this.onUnselect = options.onUnselect

            this.infoPoint = new InfoPoint (container)
            var bbox = this.path.getBBox ()
            this.infoPoint.setPosition (bbox.x + bbox.width / 2, bbox.y + bbox.height / 2)
            this.infoPoint.setScale (10)
            if( options.popupInfo )
                this.infoPoint.setPopup (options.popupInfo)

            if( !this.container.ownerDocument.querySelector ("#blur-filter") )
            {
                var tmp = this.container.ownerDocument.createElementNS ("http://www.w3.org/2000/svg", "g")
                tmp.innerHTML = `<filter id="blur-filter" x="0" y="0">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="8" />
                </filter>`

                this.container.ownerDocument.querySelector ("svg g").appendChild (tmp.children[0])
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

    export module Region2d
    {
        export interface IOptions
        {
            path: SVGPolygonElement|string
            image: SVGImageElement|string
            onSelect? (sh: this): void
            onUnselect? ( sh: this): void
            popupInfo?: HTMLElement
        }
    }
}