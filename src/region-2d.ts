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

        readonly hMouseOver = new ImageMap.Event.Handle <(region: this, evt: MouseEvent) => void> ()
        readonly hClick     = new ImageMap.Event.Handle <(region: this, evt: MouseEvent) => void> ()
        readonly hSelect    = new ImageMap.Event.Handle <(region: this, evt: MouseEvent) => void> ()
        readonly hUnselect  = new ImageMap.Event.Handle <(region: this, evt: MouseEvent) => void> ()
        readonly hEnable    = new ImageMap.Event.Handle <(region: this) => void> ()
        readonly hDisable   = new ImageMap.Event.Handle <(region: this) => void> ()

        constructor (readonly map: Map2d, el: SVGGraphicsElement|string)
        {
            this.initGlobalElement ()
            this.initContourPath (el)
            this.initClippedImage ()
            this.initInfoPoint ()

            this.gElement.appendChild (this.clipPath)
            this.gElement.appendChild (this.imageElement)
            this.gElement.appendChild (this.pathElement)
            this.gElement.appendChild (this.infoPoint.svg)

            this.map.container.appendChild (this.gElement)
            
            this.id = this.pathElement.id

            this.initSelection ()

            this.updateDisplay ()
        }

        //#region Global element

        readonly gElement: SVGGElement

        private initGlobalElement ()
        {
            //@ts-ignore
            this.gElement = this.map.container.ownerDocument.createElementNS ("http://www.w3.org/2000/svg", "g")
            this.gElement.classList.add ("region2d")
            this.gElement.vElement = this
            this.gElement.addEventListener ("mouseover", this.onMouseOver.bind (this))
        }

        protected onMouseOver (evt: MouseEvent)
        {
            this.hMouseOver.trigger (this, evt)
        }

        //#endregion

        //#region Contour path

        readonly pathElement: SVGGraphicsElement

        private initContourPath (el: SVGGraphicsElement|string)
        {
            //@ts-ignore
            this.pathElement = typeof el == "string" ? map.container.ownerDocument.querySelector (el) : el
            this.pathElement.classList.add ("path")
        }

        //#endregion

        //#region Clipped image

        readonly imageElement: SVGImageElement

        private clipPath: SVGClipPathElement

        private initClippedImage ()
        {
            var clipid = "clip-" + this.pathElement.id //!!!!!!!!!!

            //@ts-ignore
            this.imageElement = this.map.background.cloneNode (true) as SVGImageElement
            this.imageElement.setAttribute ("class", "image")
            this.imageElement.setAttribute ("clip-path", `url(#${clipid})`)

            var doc = this.map.container.ownerDocument

            this.clipPath = doc.createElementNS ("http://www.w3.org/2000/svg", "clipPath")
            this.clipPath.id = clipid

            var p: SVGElement
            switch (this.pathElement.tagName)
            {
            case "polygon":
            case "polyline":
                p = doc.createElementNS ("http://www.w3.org/2000/svg", "polyline")
                p.setAttributeNS (null, "points", this.pathElement.getAttributeNS (null, "points"))
                this.clipPath.appendChild (p)
                break
        
            case "g":
                //@ts-ignore
                for( var e of this.pathElement.children )
                this.clipPath.appendChild (e.cloneNode (true))
                break
                
            default:
                throw "Not implemented"
            }
        }

        //#endregion

        //#region Info

        readonly infoPoint: InfoPoint

        private initInfoPoint ()
        {
            //@ts-ignore
            this.infoPoint = new InfoPoint ()
            var bbox = this.pathElement.getBBox ()
            this.infoPoint.setPosition (bbox.x + bbox.width / 2, bbox.y + bbox.height / 2)
            this.infoPoint.setScale (10)
        }

        //#endregion

        //#region Selection
        
        protected selected = false

        private initSelection ()
        {
            this.gElement.addEventListener ("click", this.onClick.bind (this))
        }

        isSelected (): boolean
        {
            return this.selected
        }

        select ()
        {
            if( !this.selected )
                this.onClick ({ctrlKey: false, shiftKey: false} as MouseEvent)
        }

        unselect ()
        {
            if( this.selected )
                this.onClick ({ctrlKey: false, shiftKey: false} as MouseEvent)
        }

        protected onClick (evt: MouseEvent)
        {
            this.hClick.trigger (this, evt)

            if( this.selected )
            {
                this.selected = false
                this.updateDisplay ()
                this.hUnselect.trigger (this, evt)
            }
            else
            {
                this.selected = true
                this.updateDisplay ()
                this.hSelect.trigger (this, evt)
            }
        }

        //#endregion

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

        //#endregion

        //#region display

        updateDisplay ()
        {
            if( this.selected )
            {
                this.gElement.classList.add ("selected")
                this.infoPoint.select ()
            }
            else
            {
                this.gElement.classList.remove ("selected")
                this.infoPoint.unselect ()
            }

            if( this.isEnabled )
                this.gElement.classList.remove ("disabled")
            else
                this.gElement.classList.add ("disabled")
        }

        //#endregion
    }
}