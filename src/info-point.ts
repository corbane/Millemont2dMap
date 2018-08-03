/// <reference path="svg-map.ts" />

module ImageMap
{
    export class InfoPoint
    {
        readonly root: SVGSVGElement
        readonly useElement: SVGUseElement
        protected popup: HTMLElement = null
 
        protected x: number
        protected y: number
        protected ox = 0
        protected oy = 0
        protected w: number
        protected h: number
        protected scale = 1

        // suggest
        // bar pp = new ImageMap.Popup ("query")
        // pp.attachTo (InfoPoint)

        constructor (readonly doc: Document, el: SVGElement = null)
        {
            this.root = doc.querySelector ("svg") as SVGSVGElement

            if( el )
                this.symbol = this.getSymbolFrom (el)
            else
                this.symbol = this.getStandardSymbol ()

            this.x = this.symbol.viewBox.baseVal.x
            this.y = this.symbol.viewBox.baseVal.y
            this.w = this.symbol.viewBox.baseVal.width
            this.h = this.symbol.viewBox.baseVal.height
            
            this.useElement = doc.createElementNS ("http://www.w3.org/2000/svg", "use")
            this.useElement.setAttribute ("href", "#" + this.symbol.id)
            this.useElement.addEventListener ("mouseover", this.showPopup.bind (this))
            this.useElement.addEventListener ("mouseout", this.hidePopup.bind (this))

            //this.updateSvg ()
        }

        private symbol: SVGSymbolElement

        // createFromTemplate
        protected getSymbolFrom (el: SVGElement): SVGSymbolElement
        {
            var defs = this.root.querySelector ("defs")
            if( !defs )
            {
                defs = this.doc.createElementNS ("http://www.w3.org/2000/svg", "defs")
                this.root.appendChild (defs)
            }

            if( el.tagName.toLowerCase () == "symbol" )
            {
                var s = el.cloneNode (true) as SVGSymbolElement
            }
            else
            {
                var s = this.doc.createElementNS ("http://www.w3.org/2000/svg", "symbol")
                s.appendChild (el)
            }

            s.id = newId ()
            defs.appendChild (s)

            return s
        }
        
        protected getStandardSymbol (): SVGSymbolElement
        {
            var defs = this.root.querySelector ("defs")
            if( !defs )
            {
                defs = this.doc.createElementNS ("http://www.w3.org/2000/svg", "defs")
                this.root.appendChild (defs)
            }

            var s = this.doc.createElementNS ("http://www.w3.org/2000/svg", "symbol")
            s.id = newId ()
            s.viewBox.baseVal.x = -50
            s.viewBox.baseVal.y = -50
            s.viewBox.baseVal.width = 100
            s.viewBox.baseVal.height = 100

            var c1 = this.doc.createElementNS ("http://www.w3.org/2000/svg", "circle")
            c1.setAttribute ("cx", "0")
            c1.setAttribute ("cy", "0")
            c1.setAttribute ("r", "40")
            c1.setAttribute ("fill", "none")
            c1.setAttribute ("stroke", "#FFD50055")
            c1.setAttribute ("stroke-width", "5")

            var c2 = this.doc.createElementNS ("http://www.w3.org/2000/svg", "circle")
            c2.setAttribute ("cx", "0")
            c2.setAttribute ("cy", "0")
            c2.setAttribute ("r", "30")
            c2.setAttribute ("fill", "#FFD50055")
            c2.setAttribute ("stroke-width", "0")

            s.appendChild (c1)
            s.appendChild (c2)

            defs.appendChild (s)

            return s
        }

        attachTo (el: SVGGraphicsElement, x: "left"|"center"|"right"|number, y: "top"|"center"|"bottom"|number)
        {
            var bbox = el.getBBox ()

            if( x == "left" )
                x = bbox.x
            else if( x == "center" )
                x = bbox.x + bbox.width / 2
            else if( x == "right" )
                x = bbox.x + bbox.width

            if( y == "top" )
                y = bbox.y
            else if( y == "center" )
                y = bbox.y + bbox.height / 2
            else if( y == "bottom" )
                y = bbox.y + bbox.height

            this.setPosition (x, y)

            el.parentNode.appendChild (this.useElement)
        }

        //#region Transform

        setPosition (x: number, y: number)
        {
            this.x = x + this.symbol.viewBox.baseVal.x
            this.y = y + this.symbol.viewBox.baseVal.y
            this.updateSvg ()
        }

        offsetX (n: number): void
        {
            this.ox = n
            this.updateSvg ()
        }

        offsetY (n: number): void
        {
            this.oy = n
            this.updateSvg ()
        }

        setSize (width: number, height: number)
        {
            this.w = width
            this.h = height
            this.updateSvg ()
        }

        setScale (n: number)
        {
            this.scale = n
            this.updateSvg ()
        }

        protected updateSvg ()
        {
            var w = this.w * this.scale
            var h = this.h * this.scale
            var x = this.x + (this.w - w) / 2
            var y = this.y + (this.h - h) / 2

            this.useElement.setAttribute ("x", (x + this.ox).toString ())
            this.useElement.setAttribute ("y", (y + this.oy).toString ())
            this.useElement.setAttribute ("width",  (w).toString ())
            this.useElement.setAttribute ("height", (h).toString ())
        }

        //#endregion

        select ()
        {
            this.useElement.classList.add ("selected")
        }

        unselect ()
        {
            this.useElement.classList.remove ("selected")
        }

        //#region Popup

        setPopup (popup: HTMLElement)
        {
            if( popup )
                popup.classList.add ("mmmfest", "map-popup")

            if( !isRunningOnMobile )
                this.popup = popup
        }

        showPopup (evt: MouseEvent)
        {
            if( !this.popup )
                return

            this.popup.style.display = "block"

            var b = this.useElement.getBoundingClientRect () as DOMRect
            //var bbox = this.map.getClientRectFor (this.svg)
            this.popup.style.left = (b.x + b.width) + "px"
            this.popup.style.top  = (b.y + b.height) + 30 + "px"
        }

        hidePopup ()
        {
            if( !this.popup )
                return

            this.popup.style.display = "none"
        }

        //#endregion
    }
}