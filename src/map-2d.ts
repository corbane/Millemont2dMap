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
            bg.addEventListener ("click", this.onBackgroundClick.bind (this))
            this.background = bg
        }

        addRegion (regionOptions: Region2d.IOptions): Region2d
        {
            var r = new Region2d (this.container, regionOptions)
            //r.svg.onmouseover = this.onMouseOver.bind (this, r)
            r.HMouseOver.add (this.onMouseOver.bind (this, r))
            //r.svg.addEventListener ("mouseout", this.onMouseOut.bind (this, r))
            r.HMouseOut.add (this.onMouseOut.bind (this, r))
            r.svg.addEventListener ("click", this.onClick.bind (this, r))
            //r.infoPoint.svg.addEventListener ("click", this.onClick.bind (this, r))
            this.regions.push (r)
            return r
        }

        protected onMouseOver (sh: Region2d, evt: MouseEvent)
        {
            //sh.svg.onmouseover = null
            sh.HMouseOver.remove (this.onMouseOver.bind (this, sh))
            this.show (sh)
        }

        protected onMouseOut (sh: Region2d, evt: MouseEvent)
        {
            //sh.svg.onmouseover = this.onMouseOver.bind (this, sh)
            sh.HMouseOver.add (this.onMouseOver.bind (this, sh))
            this.hideAll ()
        }

        private selectedSape: Region2d = null

        protected onClick (sh: Region2d)
        {
            if( this.selectedSape == sh )
            {
                this.unselect ()
                this.show (sh)
            }
            else
            {
                this.unselect ()
                this.select (sh)
            }
        }

        select (sh: Region2d)
        {
            if( this.selectedSape )
                this.selectedSape.unselect ()
            
            sh.select ()
            this.show (sh)

            /*if( sh.onSelect )
                sh.onSelect (sh)*/
                
            this.selectedSape = sh
        }

        unselect ()
        {
            var sh = this.selectedSape
            if( sh == null )
                return
                
            sh.unselect ()
            this.hideAll ()

            /*if( sh.onUnselect )
                sh.onUnselect (sh)*/

            this.selectedSape = null

            return
        }

        protected onBackgroundClick ()
        {
            this.unselect ()
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