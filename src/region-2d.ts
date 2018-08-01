/// <reference path="map-2d.ts" />
/// <reference path="info-point.ts" />
/// <reference path="event.ts" />

module ImageMap
{        
    /**
     * A region is defined in the SVG file.
     * 
     * The regions MUST have a unique id and MUST defined inside the root element (see [[Map2d]]).
     * 
     * Example:
     * ```svg
     * <?xml version="1.0" encoding="UTF-8"?>
     * <!DOCTYPE svg ... >
     * <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.0">
     *     <g id="id1">
     *         <path d=" ... ">
     *         <polygon points=" ... ">
     *     <g>
     *     <circle id="id2" .../>
     * </svg>
     * ```
     */
    export class Region2d 
    {
        readonly id: string

        readonly gElement: SVGGElement
        readonly pathElement: SVGGraphicsElement
        readonly imageElement: SVGImageElement

        readonly infoPoint: InfoPoint

        readonly hMouseOver = new ImageMap.Event.Handle <(region: this, evt: MouseEvent) => void> ()
        readonly hClick     = new ImageMap.Event.Handle <(region: this, evt: MouseEvent) => void> ()
        readonly hSelect    = new ImageMap.Event.Handle <(region: this) => void> ()
        readonly hUnselect  = new ImageMap.Event.Handle <(region: this) => void> ()
        readonly hEnable    = new ImageMap.Event.Handle <(region: this) => void> ()
        readonly hDisable   = new ImageMap.Event.Handle <(region: this) => void> ()

        constructor (protected map: Map2d, el: SVGGraphicsElement|string)
        {
            var doc = map.container.ownerDocument

            // Initialize path

            this.pathElement = typeof el == "string" ? doc.querySelector (el) : el
            this.pathElement.classList.add ("path")

            /*if( !doc.getElementById ("blur-filter") )
                map.container.appendChild (blurFilterElement.cloneNode (true))*/

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
            g.vElement = this
            this.gElement = g

            this.id = this.pathElement.id

            map.container.appendChild (g)

            // Initialize event callbacks

            this.gElement.addEventListener ("click", this.onClick.bind (this))
            this.gElement.addEventListener ("mouseover", this.onMouseOver.bind (this))
        }

        protected onClick (evt: MouseEvent)
        {
            this.hClick.trigger (this, evt)

            if( this.isSelected () )
                this.unselect ()
            else
                this.select ()
        }

        protected onMouseOver (evt: MouseEvent)
        {
            this.hMouseOver.trigger (this, evt)
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
            this.hSelect.trigger (this)
        }

        unselect ()
        {
            this.gElement.classList.remove ("selected")
            this.infoPoint.unselect ()
            this.hUnselect.trigger (this)
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
            this.hEnable.trigger (this)
        }

        disable ()
        {
            this.gElement.classList.add ("disabled")
            this.hDisable.trigger (this)
        }

        //#end region
    }
}