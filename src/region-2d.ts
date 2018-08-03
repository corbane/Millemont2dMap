/// <reference path="svg-map.ts" />
/// <reference path="info-point.ts" />
/// <reference path="event.ts" />

module ImageMap
{        
    /**
     * A region is defined in the SVG file.
     * 
     * The regions MUST have a unique id
     * 
     * By default te regions is defined inside a `g` element with id equal to `"regions"`.
     * ~~You can change this query selector with [[SvgMap.Options.regionsSelector]]~~
     * 
     * Example:
     * ```svg
     * <?xml version="1.0" encoding="UTF-8"?>
     * <!DOCTYPE svg ... >
     * <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.0">
     *     ... see SvgMap ...
     *     <g id="regions">
     *         <g id="id1">
     *             <path d=" ... ">
     *             <polygon points=" ... ">
     *         <g>
     *         <circle id="id2" .../>
     *     </g>
     * </svg>
     * ```
     */
    export class Region2d 
    {
        readonly id: string

        readonly HMouseOver = new ImageMap.Event.Handle <(region: this, evt: MouseEvent) => void> ()
        readonly HClick     = new ImageMap.Event.Handle <(region: this, evt: MouseEvent) => void> ()
        readonly HSelect    = new ImageMap.Event.Handle <(region: this, evt: MouseEvent) => void> ()
        readonly HUnselect  = new ImageMap.Event.Handle <(region: this, evt: MouseEvent) => void> ()
        readonly HEnable    = new ImageMap.Event.Handle <(region: this) => void> ()
        readonly HDisable   = new ImageMap.Event.Handle <(region: this) => void> ()

        private readonly doc: Document

        constructor (readonly map: SvgMap, el: SVGGraphicsElement|string)
        {
            this.doc = map.doc
            
            this.initGlobalElement ()
            this.map.root.appendChild (this.gElement)

            this.initContourPath (el)
            this.gElement.appendChild (this.pathElement)

            this.id = this.pathElement.id

            this.initClippedImage ()
            this.gElement.appendChild (this.clipPath)
            this.gElement.appendChild (this.imageElement)

            this.initInfoPoint ()

            this.initSelection ()

            this.updateDisplay ()
        }

        //#region Global element

        readonly gElement: SVGGElement

        private initGlobalElement ()
        {
            //@ts-ignore
            this.gElement = this.doc.createElementNS ("http://www.w3.org/2000/svg", "g")
            this.gElement.classList.add ("region2d")
            this.gElement.vElement = this
            this.gElement.addEventListener ("mouseover", this.onMouseOver.bind (this))
        }

        private onMouseOver (evt: MouseEvent)
        {
            this.HMouseOver.trigger (this, evt)
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

            this.clipPath = this.doc.createElementNS ("http://www.w3.org/2000/svg", "clipPath")
            this.clipPath.id = clipid

            var p: SVGElement
            switch (this.pathElement.tagName)
            {
            case "polygon":
            case "polyline":
                p = this.doc.createElementNS ("http://www.w3.org/2000/svg", "polyline")
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
            var s = this.doc.querySelector ("defs > symbol#info-point") as SVGGraphicsElement
            //@ts-ignore
            this.infoPoint = new InfoPoint (this.doc, s)
            this.infoPoint.attachTo (this.pathElement, "center", "center")
            if( s )
            {
                var scale = parseFloat (s.getAttribute ("data-scale"))
                if( scale )
                    this.infoPoint.setScale (scale)
            }
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

        private onClick (evt: MouseEvent)
        {
            this.HClick.trigger (this, evt)

            if( this.selected )
            {
                this.selected = false
                this.updateDisplay ()
                this.HUnselect.trigger (this, evt)
            }
            else
            {
                this.selected = true
                this.updateDisplay ()
                this.HSelect.trigger (this, evt)
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
            this.HEnable.trigger (this)
        }

        disable ()
        {
            this.gElement.classList.add ("disabled")
            this.HDisable.trigger (this)
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