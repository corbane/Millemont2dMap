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
        readonly HClick = new MMMFest.Event.Handle <(region: this, evt: MouseEvent) => void> ()
        readonly HMouseOut = new MMMFest.Event.Handle <(region: this, evt: MouseEvent) => void> ()
        readonly HSelect = new MMMFest.Event.Handle <(region: this) => void> ()
        readonly HUnselect = new MMMFest.Event.Handle <(region: this) => void> ()

        constructor (protected parent: SVGSVGElement, options: Region2d.IOptions)
        {
            var doc = this.parent.ownerDocument

            // Initialize path & background

            this.path = typeof options.path == "string"
                      ? parent.ownerDocument.querySelector (options.path)
                      : options.path

            this.background = typeof options.image == "string"
                       ? parent.ownerDocument.querySelector (options.image)
                       : options.image

            this.path.classList.add ("mmmfest", "map2d-path")

            if( !blurFilterExists )
            {
                this.parent.appendChild (blurFilterElement)
                blurFilterExists = true
            }

            // Initialize svg viewbox

            this.parent.viewBox.baseVal.x = this.background.y.baseVal.value
            this.parent.viewBox.baseVal.y = this.background.x.baseVal.value
            this.parent.viewBox.baseVal.width = this.background.width.baseVal.value
            this.parent.viewBox.baseVal.height = this.background.height.baseVal.value

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
            this.image.classList.add ("mmmfest", "map2d-image")
            this.image.setAttributeNS ("http://www.w3.org/1999/xlink", "href", '#' + this.background.id)
            this.image.setAttributeNS (null, "clip-path", `url(#${clipPath.id})`)

            // Create master svg element

            var g = doc.createElementNS ("http://www.w3.org/2000/svg", "g")
            //g.style.clipPath = `url(#${clipPath.id})`
            g.appendChild (clipPath)
            g.appendChild (this.image)
            g.appendChild (this.path)
            g.appendChild (this.infoPoint.svg)
            this.svg = g

            this.parent.appendChild (g)

            // Initialize event callbacks

            /*if( options.onSelect )
                this.onSelect = options.onSelect

            if( options.onUnselect )
                this.onUnselect = options.onUnselect*/

            this.svg.onclick = this.onClick.bind (this)
            this.svg.onmouseover = this.onMouseOver.bind (this)
            this.svg.onmouseout = this.onMouseOut.bind (this)
        }

        protected onClick (evt: MouseEvent)
        {
            console.log ("Event onClick")
            this.HClick.trigger (this, evt)
        }

        protected onMouseOver (evt: MouseEvent)
        {
            console.log ("Event onMouseOver")
            this.svg.onmouseover = null
            this.HMouseOver.trigger (this, evt)
        }

        protected onMouseOut (evt: MouseEvent)
        {
            console.log ("Event onMouseOut")
            this.svg.onmouseover = this.onMouseOver.bind (this)
            this.HMouseOut.trigger (this, evt)
        }

        //onSelect? (sh: this): void
        //onUnselect? ( sh: this): void

        select ()
        {
            this.path.classList.add ("selected")
            this.image.classList.add ("selected")
            this.infoPoint.select ()
            this.HSelect.trigger (this)
        }

        unselect ()
        {
            this.path.classList.remove ("selected")
            this.image.classList.remove ("selected")
            this.infoPoint.unselect ()
            this.HUnselect.trigger (this)
        }

        activate ()
        {

        }

        desactivate ()
        {

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
            path: SVGGraphicsElement|string
            image: SVGImageElement|string
            //onSelect? (sh: Region2d): void
            //onUnselect? ( sh: Region2d): void
            popupInfo?: HTMLElement
        }
    }
}