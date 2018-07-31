/// <reference path="info-point.ts" />

module MMMFest
{
    export class Region2d 
    {
        readonly path: SVGPolygonElement
        readonly image: SVGImageElement
        readonly infoPoint: InfoPoint

        constructor (protected parent: SVGSVGElement, options: Region2d.IOptions)
        {
            this.path = typeof options.path == "string"
                      ? parent.ownerDocument.querySelector (options.path)
                      : options.path

            this.image = typeof options.image == "string"
                       ? parent.ownerDocument.querySelector (options.image)
                       : options.image

            this.path.classList.add ("mmmfest", "map2d-path")
            this.image.classList.add ("mmmfest", "map2d-image")

            if( options.onSelect )
                this.onSelect = options.onSelect

            if( options.onUnselect )
                this.onUnselect = options.onUnselect

            this.infoPoint = new InfoPoint (parent)
            var bbox = this.path.getBBox ()
            this.infoPoint.setPosition (bbox.x + bbox.width / 2, bbox.y + bbox.height / 2)
            this.infoPoint.setScale (10)

            if( options.popupInfo )
                this.infoPoint.setPopup (options.popupInfo)

            if( !parent.querySelector ("#blur-filter") )
            {
                var tmp = this.parent.ownerDocument.createElementNS ("http://www.w3.org/2000/svg", "g")
                tmp.innerHTML = `<filter id="blur-filter" x="0" y="0">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="8" />
                </filter>`

                this.parent.ownerDocument.querySelector ("svg g").appendChild (tmp.children[0])
            }
        }

        onSelect? (sh: this): void
        onUnselect? ( sh: this): void

        select ()
        {
            this.path.classList.add ("active")
            this.image.classList.add ("active")
            this.infoPoint.select ()
        }

        unselect ()
        {
            this.path.classList.remove ("active")
            this.image.classList.remove ("active")
            this.infoPoint.unselect ()
        }

        hide ()
        {
            this.path.classList.add ("ghost")
            this.image.classList.add ("ghost")
        }

        show ()
        {
            this.path.classList.remove ("ghost")
            this.image.classList.remove ("ghost")
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