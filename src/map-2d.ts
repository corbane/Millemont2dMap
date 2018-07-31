/// <reference path="region-2d.ts" />
/// <reference path="event.ts" />

module ImageMap
{
    export class Map2d
    {
        readonly regions: Region2d [] = []

        readonly background: SVGImageElement

        constructor (readonly container: SVGSVGElement, options: Map2d.IOptions)
        {

            // Initialize background

            if( typeof options.background == "string" )
                this.background = this.container.querySelector (options.background) as SVGImageElement
            else
                this.background = options.background
                
            this.background.classList.add ("background")
            this.background.onclick = this.onBackgroundClick.bind (this)

            // Initialize svg container

            this.container.classList.add ("mmmfest", "map2d")
            this.container.setAttribute ("width", "100%")
            this.container.setAttribute ("height", "100%")
            this.container.viewBox.baseVal.x = this.background.y.baseVal.value
            this.container.viewBox.baseVal.y = this.background.x.baseVal.value
            this.container.viewBox.baseVal.width = this.background.width.baseVal.value
            this.container.viewBox.baseVal.height = this.background.height.baseVal.value
            this.setNormalMode ()
        }

        addRegion (el: SVGGraphicsElement|string): Region2d
        {
            var region = new Region2d (this, el)

            region.HSelect.add (this.onRegionSelected.bind (this, region))
            region.HUnselect.add (this.onRegionUnelected.bind (this, region))
            region.HMouseOver.add (this.onOverRegion.bind (this, region))

            this.regions.push (region)

            // Initialize popup info

            var popup = document.querySelector (`[data-for="${region.id}"]`) as HTMLElement
            if( popup )
                region.infoPoint.setPopup (popup)

            return region
        }

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
        }

        private onRegionUnelected (region: Region2d)
        {
            this.selectedSape = null
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

        protected onOverRegion (region: Region2d, evt: MouseEvent)
        {
            this.background.onmouseover = this.onOverBackground.bind (this)
            this.setGhostMode (region)
        }

        protected onOverBackground (region: Region2d, evt: MouseEvent)
        {
            this.background.onmouseover = null
            this.setNormalMode ()
        }

        //#endregion
    }

    export module Map2d
    {
        export interface IOptions
        {
            background: SVGImageElement | string
        }
    }
}