/// <reference path="region-2d.ts" />

module MMMFest
{
    export class Map2d
    {
        readonly regions: Region2d [] = []

        readonly background: SVGElement

        constructor (readonly container: SVGSVGElement, options: Map2d.IOptions)
        {
            if( typeof options.background == "string" )
                var bg = this.container.querySelector (options.background) as SVGElement
            else
                var bg = options.background
                
            bg.classList.add ("mmmfest", "map2d-background")
            bg.onclick = this.onBackgroundClick.bind (this)
            this.background = bg
        }

        addRegion (regionOptions: Region2d.IOptions): Region2d
        {
            var region = new Region2d (this.container, regionOptions)

            region.HSelect.add (this.onRegionSelected.bind (this, region))
            region.HUnselect.add (this.onRegionUnelected.bind (this, region))
            region.HMouseOut.add (this.onMouseOut.bind (this, region))
            this.hmo = region.HMouseOver.add (this.onMouseOver.bind (this, region))

            this.regions.push (region)

            return region
        }

        select (region: Region2d)
        {
            region.select ()
        }

        unselect ()
        {
            if( this.selectedSape )
                this.selectedSape.unselect ()
        }

        /** Handle Mouse Over (index) */
        private hmo: number

        protected onMouseOver (region: Region2d, evt: MouseEvent)
        {
            console.log ("Event onMouseOver")
            region.HMouseOver.remove (this.hmo)
            this.show (region)
        }

        protected onMouseOut (region: Region2d, evt: MouseEvent)
        {
            console.log ("Event onMouseOut")
            this.hmo = region.HMouseOver.add (this.onMouseOver.bind (this, region))
            this.hideAll ()
        }

        protected onBackgroundClick (evt: Event)
        {
            if( evt.target != this.background )
                return

            this.unselect ()
        }

        private selectedSape: Region2d = null

        private onRegionSelected (region: Region2d)
        {
            if( this.selectedSape )
                this.selectedSape.unselect ()
                
            this.selectedSape = region
                
            this.show (region)
        }

        private onRegionUnelected (region: Region2d)
        {
            if( this.selectedSape == region  )
                this.show (region)
            else
                this.hideAll ()
            
            this.selectedSape = null
        }

        protected show (sh: Region2d)
        {
            for( var s of this.regions )
                s.hide ()

            sh.show ()

            this.background.classList.add ("ghost")
        }

        protected hideAll ()
        {
            for( var s of this.regions )
                s.hide ()
            
            this.background.classList.remove ("ghost")
        }
    }

    export module Map2d
    {
        export interface IOptions
        {
            background: SVGElement | string
        }
    }
}