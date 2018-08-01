
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

        constructor ()
        {
            this.svg = document.createElementNS ("http://www.w3.org/2000/svg", "g")
            this.svg.setAttributeNS (null, "pointer-events", "all")
            this.svg.addEventListener ("mouseover", this.showPopup.bind (this))
            this.svg.addEventListener ("mouseout", this.hidePopup.bind (this))
            this.setPosition (100, 100)
        }

        protected updateSvg ()
        {
            this.svg.style.transform = `scale(${this.scale})`
            this.svg.style.transformOrigin = `${this.x}px ${this.y}px` // "center center"
            this.svg.innerHTML = this.getInnerSvg ()
        }

        /**
         * Overrides this method for build a custom style point
         */
        getInnerSvg(): string
        {
            return `
                <circle cx="${this.x}" cy="${this.y}" r="14" fill="${this.active ? "#FFD50055" : "none"}" stroke="gold" stroke-width="2"/>
                <circle cx="${this.x}" cy="${this.y - 6}" r="2" fill="gold"/>
                <rect x="${this.x - 1.5}" y="${this.y - 2}" width="3" height="10" fill="gold"/>`
        }

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

            var b = this.svg.getBoundingClientRect () as DOMRect,
                offsetY = this.popup.getBoundingClientRect().height / 2 - b.height / 2
            //this.popup.style.left = (b.left + b.width + 20) + "px"
            //this.popup.style.top = (window.screenY + b.top + offsetY) + "px"
            this.popup.style.left = evt.pageX + 30 + "px"
            this.popup.style.top = evt.pageY + 30 + "px"
        }

        hidePopup ()
        {
            if( !this.popup )
                return

            this.popup.style.display = "none"
        }
    }
}