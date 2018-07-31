/// <reference path="map-2d.ts" />
/// <reference path="info-point.ts" />
/// <reference path="event.ts" />

module ImageMap
{        
    var tmp = document.createElementNS ("http://www.w3.org/2000/svg", "g")
    tmp.innerHTML
        = `<filter id="blur-filter" x="0" y="0">`
        + `<feGaussianBlur in="SourceGraphic" stdDeviation="9" />`
        + `</filter>`
        
    var blurFilterExists = false
    const blurFilterElement = tmp.children[0]

    export class Region2d 
    {
        readonly id: string

        readonly gElement: SVGGElement
        readonly pathElement: SVGGraphicsElement
        readonly imageElement: SVGImageElement

        readonly infoPoint: InfoPoint

        readonly HMouseOver = new ImageMap.Event.Handle <(region: this, evt: MouseEvent) => void> ()
        readonly HClick     = new ImageMap.Event.Handle <(region: this, evt: MouseEvent) => void> ()
        readonly HSelect    = new ImageMap.Event.Handle <(region: this) => void> ()
        readonly HUnselect  = new ImageMap.Event.Handle <(region: this) => void> ()
        readonly HEnable    = new ImageMap.Event.Handle <(region: this) => void> ()
        readonly HDisable   = new ImageMap.Event.Handle <(region: this) => void> ()

        constructor (protected map: Map2d, el: SVGGraphicsElement|string)
        {
            var doc = map.container.ownerDocument

            // Initialize path

            this.pathElement = typeof el == "string" ? doc.querySelector (el) : el
            this.pathElement.classList.add ("path")

            if( !blurFilterExists )
            {
                map.container.appendChild (blurFilterElement)
                blurFilterExists = true
            }

            // Create clipping path

            var clipPath = doc.createElementNS ("http://www.w3.org/2000/svg", "clipPath")
            clipPath.id = "clip-" + this.pathElement.id

            var p: SVGElement
            switch (this.pathElement.tagName)
            {
            case "polygon":
            case "polyline":
                p = doc.createElementNS ("http://www.w3.org/2000/svg", "polyline")
                p.setAttributeNS (null, "points", this.pathElement.getAttributeNS (null, "points"))
                clipPath.appendChild (p)
                break
        
            case "g":
                //@ts-ignore
                for( var e of this.pathElement.children )
                    clipPath.appendChild (e.cloneNode (true))
                break
                
            default:
                throw "Not implemented"
            }
            
            // Create info point

            this.infoPoint = new InfoPoint ()
            var bbox = this.pathElement.getBBox ()
            this.infoPoint.setPosition (bbox.x + bbox.width / 2, bbox.y + bbox.height / 2)
            this.infoPoint.setScale (10)

            // Create clipping background
            
            this.imageElement = this.map.background.cloneNode (true) as SVGImageElement
            this.imageElement.setAttribute ("class", "image")
            this.imageElement.setAttribute ("clip-path", `url(#${clipPath.id})`)

            // Create master group element

            var g = doc.createElementNS ("http://www.w3.org/2000/svg", "g")
            g.classList.add ("region2d")
            g.appendChild (clipPath)
            g.appendChild (this.imageElement)
            g.appendChild (this.pathElement)
            g.appendChild (this.infoPoint.svg)
            this.gElement = g

            this.id = this.pathElement.id

            map.container.appendChild (g)

            // Initialize event callbacks

            this.gElement.addEventListener ("click", this.onClick.bind (this))
            this.gElement.addEventListener ("mouseover", this.onMouseOver.bind (this))
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
            this.HMouseOver.trigger (this, evt)
        }

        //#region Selection
        
        isSelected (): boolean
        {
            return this.gElement.classList.contains ("selected")
        }

        select ()
        {
            this.gElement.classList.add ("selected")
            this.infoPoint.select ()
            this.HSelect.trigger (this)
        }

        unselect ()
        {
            this.gElement.classList.remove ("selected")
            this.infoPoint.unselect ()
            this.HUnselect.trigger (this)
        }

        //#end region

        //#region Activation

        isEnabled (): boolean
        {
            return !this.gElement.classList.contains ("disabled")
        }

        enable ()
        {
            this.gElement.classList.remove ("disabled")
            this.HEnable.trigger (this)
        }

        disable ()
        {
            this.gElement.classList.add ("disabled")
            this.HDisable.trigger (this)
        }

        //#end region
    }
}