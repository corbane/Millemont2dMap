/// <reference path="info-point.ts" />
/// <reference path="event.ts" />

module MMMFest
{        
    var tmp = document.createElementNS ("http://www.w3.org/2000/svg", "g")
    tmp.innerHTML
        = `<filter id="blur-filter" x="0" y="0">`
        + `<feGaussianBlur in="SourceGraphic" stdDeviation="8" />`
        + `</filter>`
        
    var blurFilterExists = false
    const blurFilterElement = tmp.children[0]

    export class Region2d 
    {
        readonly svg: SVGGElement
        readonly path: SVGGraphicsElement
        readonly image: SVGUseElement
        readonly infoPoint: InfoPoint

        protected background: SVGImageElement

        readonly HMouseOver = new MMMFest.Event.Handle <(region: this, evt: MouseEvent) => void> ()
        readonly HClick     = new MMMFest.Event.Handle <(region: this, evt: MouseEvent) => void> ()
        readonly HSelect    = new MMMFest.Event.Handle <(region: this) => void> ()
        readonly HUnselect  = new MMMFest.Event.Handle <(region: this) => void> ()
        readonly HEnable    = new MMMFest.Event.Handle <(region: this) => void> ()
        readonly HDisable   = new MMMFest.Event.Handle <(region: this) => void> ()

        constructor (protected map: Map2d, options: Region2d.IOptions)
        {
            var doc = map.container.ownerDocument

            // Initialize path & background

            this.path = typeof options.path == "string"
                      ? doc.querySelector (options.path)
                      : options.path

            this.background = typeof options.image == "string"
                       ? doc.querySelector (options.image)
                       : options.image

            this.path.classList.add ("path")

            if( !blurFilterExists )
            {
                map.container.appendChild (blurFilterElement)
                blurFilterExists = true
            }

            // Create clipping path

            var p: SVGElement
            switch (this.path.tagName)
            {
            case "polygon":
            case "polyline":
                p = doc.createElementNS ("http://www.w3.org/2000/svg", "polyline")
                p.setAttributeNS (null, "points", this.path.getAttributeNS (null, "points"))
                break;
        
            default:
                throw "Not implemented"
            }

            var clipPath = doc.createElementNS ("http://www.w3.org/2000/svg", "clipPath")
            clipPath.id = "clip-" + this.path.id
            clipPath.appendChild (p)
            
            // Create info point

            this.infoPoint = new InfoPoint ()
            var bbox = this.path.getBBox ()
            this.infoPoint.setPosition (bbox.x + bbox.width / 2, bbox.y + bbox.height / 2)
            this.infoPoint.setScale (10)

            if( options.popupInfo )
                this.infoPoint.setPopup (options.popupInfo)

            // Create clipping background
            
            this.image = doc.createElementNS ("http://www.w3.org/2000/svg", "use")
            this.image.classList.add ("image")
            this.image.setAttributeNS ("http://www.w3.org/1999/xlink", "href", '#' + this.background.id)
            this.image.setAttributeNS (null, "clip-path", `url(#${clipPath.id})`)

            // Create master svg element

            var g = doc.createElementNS ("http://www.w3.org/2000/svg", "g")
            g.classList.add ("region2d")
            g.appendChild (clipPath)
            g.appendChild (this.image)
            g.appendChild (this.path)
            g.appendChild (this.infoPoint.svg)
            this.svg = g

            map.container.appendChild (g)

            // Initialize event callbacks

            this.svg.addEventListener ("click", this.onClick.bind (this))
            this.svg.addEventListener ("mouseover", this.onMouseOver.bind (this))
        }

        protected onClick (evt: MouseEvent)
        {
            this.HClick.trigger (this, evt)

            if( this.isSelected () )
                this.unselect ()
            else
                this.select ()
        }

        protected onMouseOver (evt: MouseEvent)
        {
            console.log ("OVER")
            this.HMouseOver.trigger (this, evt)
        }

        isSelected (): boolean
        {
            return this.svg.classList.contains ("selected")
        }

        select ()
        {
            this.svg.classList.add ("selected")
            this.infoPoint.select ()
            this.HSelect.trigger (this)
        }

        unselect ()
        {
            this.svg.classList.remove ("selected")
            this.infoPoint.unselect ()
            this.HUnselect.trigger (this)
        }

        isEnabled (): boolean
        {
            return !this.svg.classList.contains ("disabled")
        }

        enable ()
        {
            this.svg.classList.remove ("disabled")
            this.HEnable.trigger (this)
        }

        disable ()
        {
            this.svg.classList.add ("disabled")
            this.HDisable.trigger (this)
        }
    }

    export module Region2d
    {
        export interface IOptions
        {
            path: SVGGraphicsElement|string
            image: SVGImageElement|string
            //onSelect? (sh: Region2d): void
            //onUnselect? ( sh: Region2d): void
            popupInfo?: HTMLElement
        }
    }
}