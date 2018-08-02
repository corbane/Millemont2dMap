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
     * A `map2d` is defined in a SVG file and it's correspond to the `svg` tag element
     * 
     * The `map2d` elements MUST contain an` SVGImageElement` and a series of [[Region2d]] elements.
     * This image define the maximum `viewBox` of the SVG do it must define the `x`, `y`, `width`, `height` attributes.
     * 
     * Example:
     * ```svg
     * <?xml version="1.0" encoding="UTF-8"?>
     * <!DOCTYPE svg [...] >
     * <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.0">
     *     <image width="600" height="600" x="0" y="0" xlink:href=" ... "/>
     *     ... see Region2d api ...
     * </svg>
     * ```
     */
    export class SvgMap
    {
        readonly background: SVGImageElement

        constructor (readonly container: SVGSVGElement)
        {
            this.initRegions ()
            
            // Initialize children of SVG

            var childs = container.ownerDocument.querySelectorAll ("svg > *")
            for( var i = 0 ; i < childs.length ; ++i )
            {
                var name = childs[i].tagName.toLowerCase () 
                if( name == "script" )
                    continue // Live reload inject a script element

                if( name == "image" )
                {
                    // Initialize background
                    this.background = childs[i] as SVGImageElement
                    this.background.classList.add ("background")
                    this.background.onclick = this.onBackgroundClick.bind (this)
                }
                else
                {
                    // Initialize regions
                    this.regions.add (childs[i] as SVGGraphicsElement)
                }
            }

            this.initFilters ()

            // Initialize svg container

            this.container.classList.add ("image-map")
            this.container.setAttribute ("width", "100%")
            this.container.setAttribute ("height", "100%")
            this.zoomAll ()
        }

        //#region Regions

        readonly regions = new RegionCollection (this)

        private initRegions ()
        {
            this.regions.HRegionAdded.add (this.onRegionAdded.bind (this))
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
            this.container.viewBox.baseVal.x = b.x - margin
            this.container.viewBox.baseVal.y = b.y - margin
            this.container.viewBox.baseVal.width = b.width + margin*2
            this.container.viewBox.baseVal.height = b.height + margin*2
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

            this.container.classList.remove ("normal-view")
            this.container.classList.remove ("ghost-view")

            if( mode == "ghost" )
                this.container.classList.add ("ghost-view")
            else
                this.container.classList.add ("normal-view")

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
            var defs = this.container.querySelector ("defs") as SVGDefsElement
            if( !defs )
            {
                defs = this.container.ownerDocument.createElementNS ("http://www.w3.org/2000/svg", "defs")
                this.container.appendChild (defs)
            }
            this.defsElement = defs
        }

        addFilter (id: string, def: string = null)
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
        }

        //#endregion
    }
}