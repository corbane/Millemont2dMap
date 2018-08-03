/// <reference path="region-2d.ts" />
/// <reference path="event.ts" />
/// <reference path="region-collection.ts" />

module ImageMap
{
    /** @hidden */
    declare const MobileDetect: any

    /**
     * Use [mobile-detect.js](https://github.com/hgoebl/mobile-detect.js)
     */
    export const isRunningOnMobile: boolean = new MobileDetect(navigator.userAgent).mobile ()

    /**
     * A `SvgMap` is defined in a SVG file and it's correspond to the `svg` tag element
     * 
     * The `SvgMap` elements contain an `SVGImageElement` and a series of [[Region2d]] elements.
     * 
     * This image define the maximum `viewBox` of the SVG, so it MUST define the `x`, `y`, `width`, `height` attributes.
     * 
     * By default this image must have the id equal to `"background"`, ~~you can change the query selector with [[SvgMap.Options.backgroundSelector]]~~
     * 
     * Example:
     * ```svg
     * <?xml version="1.0" encoding="UTF-8"?>
     * <!DOCTYPE svg [...] >
     * <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.0">
     *     <image id="background" width="600" height="600" x="0" y="0" xlink:href=" ... "/>
     *     ... see Region2d api ...
     * </svg>
     * ```
     */
    export class SvgMap
    {
        readonly options = new SvgMap.Options ()

        readonly background: SVGImageElement

        readonly container: HTMLObjectElement
        readonly doc: Document
        readonly root: SVGSVGElement

        constructor (object: HTMLObjectElement)
        {
            if( object.tagName.toLowerCase () != "object" )
                throw "The container object MUST be an `<object/>` element :("

            this.container = object
            this.container.style.padding = "0"

            this.doc = object.contentDocument

            this.root = this.doc.querySelector ("svg")
            this.root.classList.add ("image-map")
            this.root.setAttribute ("width", "100%")
            this.root.setAttribute ("height", "100%")
            
            this.initBackground ()
            this.zoomAll ()

            this.initRegions ()
            this.initFilters ()

        }

        /** @hidden */
        getClientRectFor (el: string|SVGGraphicsElement): DOMRect
        {
            var a = this.container.getBoundingClientRect () as DOMRect,
                margin = Number.parseFloat (window.getComputedStyle (this.container).borderWidth)
            
            if( typeof el == "string" )
                var b = this.doc.querySelector (el).getBoundingClientRect () as DOMRect
            else
                var b = el.getBoundingClientRect () as DOMRect
            //var b = this.doc.querySelector ("#cochets").getBoundingClientRect () as DOMRect

            return {
                width  : b.width,
                height : b.height,
                x      : a.x + margin + b.x,
                y      : a.y + margin + b.y,
                left   : a.x + margin + b.x,
                right  : a.x + margin + b.x + b.width,
                top    : a.y + margin + b.y,
                bottom : a.y + margin + b.y + b.height
            }
        }

        //#region Background

        private initBackground ()
        {
            var el = this.doc.querySelector (this.options.backgroundSelector)
            if( !el )
                throw "Can not find the background element"
                
            //@ts-ignore
            this.background = el as SVGImageElement
            this.background.classList.add ("background")
            this.background.onclick = this.onBackgroundClick.bind (this)
        }

        //#endregion

        //#region Regions

        readonly regions = new RegionCollection (this)

        private initRegions ()
        {
            this.regions.HRegionAdded.add (this.onRegionAdded.bind (this))

            var els = this.doc.querySelectorAll (this.options.regionsSelector)
            //@ts-ignore
            for( var el of els )
                this.regions.add (el as SVGGraphicsElement)
        }

        private onRegionAdded (region: Region2d)
        {
            region.HSelect.add (this.onRegionSelected.bind (this))
            region.HUnselect.add (this.onRegionUnelected.bind (this))
            region.HMouseOver.add (this.onOverRegion.bind (this))
            this.updateDisplay ()
        }

        //#endregion

        //#region Zoom

        zoomTo (b: SVGRect, margin = 0)
        {
            this.root.viewBox.baseVal.x = b.x - margin
            this.root.viewBox.baseVal.y = b.y - margin
            this.root.viewBox.baseVal.width = b.width + margin*2
            this.root.viewBox.baseVal.height = b.height + margin*2
        }

        zoomAll ()
        {
            this.zoomTo (this.background.getBBox ())
        }

        //#endregion

        //#region Selection

        private selectedSapes: Region2d[] = []

        HSelectionChanged = new Event.Handle <(map: this) => void> ()

        select (region: Region2d)
        {
            region.select ()
        }

        unselect (region: Region2d = null)
        {
            if( region )
                region.unselect ()
            else
            {
                while( this.selectedSapes.length )
                    (this.selectedSapes.splice (0, 1))[0].unselect ()
            }
        }

        getSelected (): Region2d []
        {
            return this.selectedSapes.slice (0)
        }

        private onRegionSelected (region: Region2d, evt: MouseEvent)
        {
            if( !(evt.shiftKey || evt.ctrlKey) )
            {
                while( this.selectedSapes.length )
                {
                    var r = (this.selectedSapes.splice (0, 1))[0]
                    if( r != region )
                        r.unselect ()
                }
            }
                
            this.selectedSapes.push (region)

            this.updateDisplay ()
        }

        private onRegionUnelected (region: Region2d, evt: MouseEvent)
        {
            var i = this.selectedSapes.indexOf (region)
            if( i == -1 )
                return
            
            this.selectedSapes.splice (i, 1)

            if( !(evt.shiftKey || evt.ctrlKey) )
            {
                while( this.selectedSapes.length )
                    (this.selectedSapes.splice (0, 1))[0].unselect ()
            }

            this.updateDisplay ()
        }

        protected onBackgroundClick (evt: Event)
        {
            if( evt.target != this.background )
                return
            
            while( this.selectedSapes.length )
                (this.selectedSapes.splice (0, 1))[0].unselect ()
            
            this.updateDisplay ()
        }

        //#endregion

        //#region Display

        protected displayMode: "ghost" | "normal" = "normal"

        /**
         * Use [mobile-detect.js](https://github.com/hgoebl/mobile-detect.js)
         */
        private mobileMode: boolean = isRunningOnMobile

        setDisplayMode (mode: "ghost" | "normal")
        {
            if( this.displayMode == mode )
                return

            this.displayMode = mode

            this.root.classList.remove ("normal-view")
            this.root.classList.remove ("ghost-view")

            if( mode == "ghost" )
                this.root.classList.add ("ghost-view")
            else
                this.root.classList.add ("normal-view")

            this.updateDisplay ()
        }

        /**
         * Active or desactive the mouse over event for mobile view.
         */
        setMobileMode (v: boolean = true)
        {
            this.mobileMode = v
            this.updateDisplay ()
        }

        updateDisplay ()
        {
            if( this.mobileMode )
            {
                if( this.selectedSapes.length )
                    this.setDisplayMode ("ghost")
                else
                    this.setDisplayMode ("normal")
            }

            if( this.displayMode == "ghost" )
            {
                for( var s of this.regions )
                    s.disable ()

                for( var r of this.selectedSapes )
                    r.enable ()
            }
            else //"normal"
            {
                for( var s of this.regions )
                    s.disable ()
            }
        }

        protected onOverRegion (region: Region2d, evt: MouseEvent)
        {
            if( this.mobileMode )
                return
                
            this.background.onmouseover = this.onOverBackground.bind (this)
            this.setDisplayMode ("ghost")
        }

        protected onOverBackground (region: Region2d, evt: MouseEvent)
        {
            if( this.mobileMode )
                return

            this.background.onmouseover = null
            this.setDisplayMode ("normal")
        }

        //#endregion
    
        //#region Filters

        filtersRegister: { [key: string]: string } = {}

        private defsElement: SVGDefsElement

        private initFilters ()
        {
            var defs = this.root.querySelector ("defs") as SVGDefsElement
            if( !defs )
            {
                defs = this.doc.createElementNS ("http://www.w3.org/2000/svg", "defs")
                this.root.appendChild (defs)
            }
            this.defsElement = defs

            var filters = this.doc.querySelectorAll (this.options.filtersSelector)
            //@ts-ignore
            for( var f of filters )
            {
                if( !f.id )
                    continue

                //this.addFilter (f.id, f.innerHTML)
            }
        }

        /*addFilter (id: string, def: string = null)
        {
            var doc = this.container.ownerDocument
            if( def )
            {
                var filter = doc.createElementNS ("http://www.w3.org/2000/svg", "filter")
                filter.id = id
                filter.innerHTML = def
                this.defsElement.appendChild (filter)

                this.filtersRegister[id] = def
            }
            else
            {
                //TODO default & global filters
            }
        }*/

        //#endregion
    }

    export module SvgMap
    {
        export class Options
        {
            backgroundSelector : string = "#background"
            regionsSelector    : string = "g#regions > *"
            infoPointSelector  : string = "g#info-points > *"
            filtersSelector    : string = "defs > filter"
        }
    }
}