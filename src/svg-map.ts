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

        // TODO:
        // HRegionSelected
        // HRegionUnselected
        // HRegionEnabled
        // HRegionDisabled

        HLoaded = new Event.Handle <(map: this) => void> ()

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
            
            this.loadDefinitions (object.getAttribute ("data-url") )
            .then (def =>
            {
                this.initBackground (def.background)
                this.initRegions (def.regions)
                this.zoomToAll ()
                this.initFilters ()
                this.HLoaded.trigger (this)
            })
        }

        load (url: string)
        {
            this.regions.clear ()
            this.loadDefinitions (url)
        }

        private async loadDefinitions (url: string)
        {
            if( url )
                return <SvgMap.IJson> await (fetch (url).then (rep => rep.json ()))
            
            return <SvgMap.IJson> {}
        }

        //#region Background

        private initBackground (def?: SvgMap.IJsonBackground)
        {
            if( def )
            {
                //@ts-ignore
                this.background = this.createBackgroundElement (def)

                if( this.root.firstChild )
                    this.root.insertBefore (this.root.firstChild, this.background)
                else
                    this.root.appendChild (this.background)
            } 
            else
            {
                //@ts-ignore
                this.background = this.container.hasAttribute ("data-background")  
                                ? this.doc.querySelector (this.container.getAttribute ("data-background") )
                                : this.doc.querySelector (this.options.backgroundSelector)
            }

            if( !this.background )
                throw "Can not find the background element"
                
            this.background.classList.add ("background")
            this.background.onclick = this.onBackgroundClick.bind (this)
        }

        private createBackgroundElement (def: SvgMap.IJsonBackground)
        {
            var img = this.doc.createElementNS ("http://www.w3.org/2000/svg", "image")
            img.setAttributeNS ("http://www.w3.org/1999/xlink", "href", def.href)
            img.id = def.id || "background"
            img.setAttribute ("x", def.x.toString ())
            img.setAttribute ("y", def.y.toString ())
            img.setAttribute ("width", def.width.toString ())
            img.setAttribute ("height", def.height.toString ())
            return img
        }

        //#endregion

        //#region Regions

        readonly regions = new RegionCollection (this)

        private initRegions (defs: Region2d.IJson[])
        {
            this.regions.HRegionAdded.add (this.onRegionAdded.bind (this))
            
            if( defs )
            {
                for( var el of defs )
                    this.regions.add (el)
            }
            else
            {
                var els = this.container.hasAttribute ("data-regions-selector")  
                        ? this.doc.querySelectorAll (this.container.getAttribute ("data-regions-selector") )
                        : this.doc.querySelectorAll (this.options.regionsSelector)
            
                //@ts-ignore
                for( var el of els )
                    this.regions.add (el)
            }
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

        zoomToAll ()
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

            this.HSelectionChanged.trigger (this)
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

            this.HSelectionChanged.trigger (this)
        }

        private onBackgroundClick (evt: Event)
        {
            if( evt.target != this.background )
                return
            
            while( this.selectedSapes.length )
                (this.selectedSapes.splice (0, 1))[0].unselect ()
            
            this.updateDisplay ()

            this.HSelectionChanged.trigger (this)
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

        private onOverRegion (region: Region2d, evt: MouseEvent)
        {
            if( this.mobileMode )
                return
                
            this.background.onmouseover = this.onOverBackground.bind (this)
            this.setDisplayMode ("ghost")
        }

        private onOverBackground (region: Region2d, evt: MouseEvent)
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

        //#endregion
    }

    export module SvgMap
    {
        export interface IJson
        {
            "@type": "https://corbane.github.io/ImageMap/schema"
            background: IJsonBackground
            regions: Region2d.IJson []
            infoPoints: InfoPoint.IJson
        }

        export interface IJsonBackground
        {
            "@type": "https://corbane.github.io/ImageMap/schema/background"
            href: string
            id?: string
            x: number
            y: number
            width: number
            height: number
        }

        export class Options
        {
            backgroundSelector : string = "#background"
            regionsSelector    : string = "g#regions > *"
            infoPointSelector  : string = "g#info-points > *"
            filtersSelector    : string = "defs > filter"
            //background : selector|element
            //regions: selector|elements
        }
    }
}