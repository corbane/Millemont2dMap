/// <reference path="region-2d.ts" />
/// <reference path="event.ts" />

module MMMFest
{
    export class Map2d
    {
        readonly regions: Region2d [] = []

        readonly background: SVGImageElement

        readonly HOverRegion = new MMMFest.Event.Handle <(region: Region2d) => void> ()

        constructor (readonly container: SVGSVGElement, options: Map2d.IOptions)
        {
            if( typeof options.background == "string" )
                var bg = this.container.querySelector (options.background) as SVGImageElement
            else
                var bg = options.background
                
            bg.classList.add ("mmmfest", "map2d-background")
            bg.onclick = this.onBackgroundClick.bind (this)
            this.background = bg

            // Initialize svg viewbox

            this.container.viewBox.baseVal.x = this.background.y.baseVal.value
            this.container.viewBox.baseVal.y = this.background.x.baseVal.value
            this.container.viewBox.baseVal.width = this.background.width.baseVal.value
            this.container.viewBox.baseVal.height = this.background.height.baseVal.value
        }

        addRegion (regionOptions: Region2d.IOptions): Region2d
        {
            var region = new Region2d (this, regionOptions)

            region.HSelect.add (this.onRegionSelected.bind (this, region))
            region.HUnselect.add (this.onRegionUnelected.bind (this, region))
            region.HMouseOver.add (this.onOverRegion.bind (this, region))

            this.regions.push (region)

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

        //#region Ghost display

        setGhostMode (sh: Region2d)
        {
            for( var s of this.regions )
                s.hide ()

            sh.show ()

            this.background.classList.add ("ghost")
        }

        setInitialMode ()
        {
            for( var s of this.regions )
                s.hide ()
            
            this.background.classList.remove ("ghost")
        }

        protected onOverRegion (region: Region2d, evt: MouseEvent)
        {
            console.log ("Event onMouseOver")
            this.background.onmouseover = this.onOverBackground.bind (this)
            this.setGhostMode (region)
        }

        protected onOverBackground (region: Region2d, evt: MouseEvent)
        {
            console.log ("onOverBackground")
            this.background.onmouseover = null
            this.setInitialMode ()
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