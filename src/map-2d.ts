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
    export class Map2d
    {
        readonly background: SVGImageElement

        constructor (readonly container: SVGSVGElement)
        {
            // Initialize regions collection
            
            this.regions.HRegionAdded.add (this.onRegionAdded.bind (this))
            
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

            // Initialize svg container

            this.container.classList.add ("image-map")
            this.container.setAttribute ("width", "100%")
            this.container.setAttribute ("height", "100%")
            this.restoreZoom ()
        }

        //#region Regions

        readonly regions = new RegionCollection (this)

        private onRegionAdded (region: Region2d)
        {
            region.hSelect.add (this.onRegionSelected.bind (this, region))
            region.hUnselect.add (this.onRegionUnelected.bind (this, region))
            region.hMouseOver.add (this.onOverRegion.bind (this, region))
            this.setNormalMode ()
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

        restoreZoom ()
        {
            this.zoomTo (this.background.getBBox ())
        }

        //#endregion

        //#region Selection

        select (region: Region2d)
        {
            region.select ()
        }

        unselect ()
        {
            if( this.selectedSape )
                this.selectedSape.unselect ()
        }

        private selectedSape: Region2d = null

        private onRegionSelected (region: Region2d)
        {
            if( this.selectedSape )
                this.selectedSape.unselect ()
                
            this.selectedSape = region

            if( this.mobileMode )
                this.setGhostMode (region)
        }

        private onRegionUnelected (region: Region2d)
        {
            this.selectedSape = null

            if( this.mobileMode )
                this.setNormalMode ()
        }

        protected onBackgroundClick (evt: Event)
        {
            if( evt.target != this.background )
                return

            this.unselect ()
        }

        //#endregion

        //#region display mode

        setGhostMode (sh: Region2d)
        {
            for( var s of this.regions )
                s.disable ()

            sh.enable ()

            this.container.classList.remove ("normal-view")
            this.container.classList.add ("ghost-view")
        }

        setNormalMode ()
        {
            for( var s of this.regions )
                s.disable ()
            
            this.container.classList.remove ("ghost-view")
            this.container.classList.add ("normal-view")
        }

        /**
         * Use [mobile-detect.js](https://github.com/hgoebl/mobile-detect.js)
         */
        private mobileMode: boolean = isRunningOnMobile

        /**
         * Active or desactive the mouse over event for mobile view.
         */
        setMobileMode (v: boolean = true)
        {
            this.mobileMode = v
        }

        protected onOverRegion (region: Region2d, evt: MouseEvent)
        {
            if( this.mobileMode )
                return
                
            this.background.onmouseover = this.onOverBackground.bind (this)
            this.setGhostMode (region)
        }

        protected onOverBackground (region: Region2d, evt: MouseEvent)
        {
            if( this.mobileMode )
                return

            this.background.onmouseover = null
            this.setNormalMode ()
        }

        //#endregion
    
        //#region Filters

        filtersRegister: { [key: string]: string } = {}

        private addFilter (id: string, def: string = null)
        {
            var doc = this.container.ownerDocument
            if( def )
            {
                var defs = this.container.querySelector ("defs") as SVGDefsElement
                if( !defs )
                {
                    defs = doc.createElementNS ("http://www.w3.org/2000/svg", "defs")
                    this.container.appendChild (defs)
                }

                var filter = doc.createElementNS ("http://www.w3.org/2000/svg", "filter")
                filter.id = id
                filter.innerHTML = def
                defs.appendChild (filter)

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