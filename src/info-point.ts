/// <reference path="svg-map.ts" />

module ImageMap
{
    export class InfoPoint
    {
        readonly svg: SVGGraphicsElement
        protected popup: HTMLElement = null

        protected scale = 1
        protected x: number
        protected y: number
        protected x_origin: number
        protected y_origin: number

        // suggest
        // var p = ImageMap.InfoPoint.createFrom (element)
        // p.attachTo (element, position)
        // bar pp = new ImageMap.Popup ("query")
        // pp.attachTo (p)

        constructor ()
        {
            this.svg = document.createElementNS ("http://www.w3.org/2000/svg", "g")
            this.svg.setAttributeNS (null, "pointer-events", "all")
            this.svg.addEventListener ("mouseover", this.showPopup.bind (this))
            this.svg.addEventListener ("mouseout", this.hidePopup.bind (this))
            this.setPosition (100, 100)
        }

        /*static load (doc: Document, query: string): InfoPoint
        {
            var el = doc.querySelector (query)
            if( !el )
                throw "Can not load info point :("

            var ip = new InfoPoint ()
            ip.getInnerHtml = (): string => el.innerHTML

            return ip
        }*/

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

            if( el.nextSibling )
                el.parentNode.insertBefore (this.svg, el.nextSibling)
            else
                el.parentNode.appendChild (this.svg)
        }

        protected updateSvg ()
        {
            this.svg.style.transform = `scale(${this.scale})`
            this.svg.style.transformOrigin = `${this.x}px ${this.y}px` // "center center"
            this.svg.innerHTML = this.getInnerHtml ()
        }

        /**
         * Overrides this method for build a custom style point
         */
        getInnerHtml(): string
        {
            return `
                <circle cx="${this.x}" cy="${this.y}" r="14" fill="${this.active ? "#FFD50055" : "none"}" stroke="gold" stroke-width="2"/>
                <circle cx="${this.x}" cy="${this.y - 6}" r="2" fill="gold"/>
                <rect x="${this.x - 1.5}" y="${this.y - 2}" width="3" height="10" fill="gold"/>`
        }

        //#region Transform

        setPosition (x: number, y: number)
        {
            this.x = this.x_origin = x
            this.y = this.y_origin = y
            this.updateSvg ()

        }

        offsetX (n: number): void
        {
            this.x = this.x_origin + n
            this.updateSvg ()
        }

        offsetY (n: number): void
        {
            this.y = this.y_origin + n
            this.updateSvg ()
        }

        setScale (n: number)
        {
            this.scale = n
            this.svg.style.transform = `scale(${this.scale})`
        }

        //#endregion

        protected active = false

        select ()
        {
            this.active = true
            this.updateSvg ()
        }

        unselect ()
        {
            this.active = false
            this.updateSvg ()
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

            var b = this.svg.getBoundingClientRect () as DOMRect
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