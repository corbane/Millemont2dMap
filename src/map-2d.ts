/// <reference path="region-2d.ts" />

module MMMFest
{
    export class Map2d
    {
        readonly shapes: {
            orangerie: Region2d
            grandChateau: Region2d
            petitChateau: Region2d
            camping: Region2d
            courDesCochets: Region2d
        }

        readonly background: SVGImageElement

        constructor (protected el: HTMLObjectElement)
        {
            var svg = el.contentDocument.querySelector ("svg")

            this.shapes = {
                orangerie:      new Region2d (svg, svg.querySelector ("#t_orangerie"), svg.querySelector ("#i_orangerie"), ),
                grandChateau:   new Region2d (svg, svg.querySelector ("#t_grchateau"), svg.querySelector ("#i_grchateau")),
                petitChateau:   new Region2d (svg, svg.querySelector ("#t_ptchateau"), svg.querySelector ("#i_ptchateau")),
                camping:        new Region2d (svg, svg.querySelector ("#t_camping"), svg.querySelector ("#i_camping")),
                courDesCochets: new Region2d (svg, svg.querySelector ("#t_cochets"), svg.querySelector ("#i_cochets"))
            }
            
            for( var name in this.shapes )
            {
                var sh = this.shapes[name] as Region2d
                sh.image.addEventListener ("click", this.onClick.bind (this, name, sh))
                //sh.centerPoint.addEventListener ("click", this.onClick.bind (this, name, sh))
                sh.infoPoint.svg.addEventListener ("click", this.onClick.bind (this, name, sh))
                sh.image.addEventListener ("mouseover", this.onMouseOver.bind (this, sh))
            }

            var bg = svg.querySelector ("#i_background") as SVGImageElement
            bg.style.opacity = "1"
            bg.style.transition = "all 0.5s"
            bg.addEventListener ("click", this.onBackgroundClick.bind (this))
            this.background = bg
        }

        protected onMouseOver (sh: Region2d)
        {
            console.log ("mouseOver")
            this.show (sh)
            this.background.onmousemove = this.onMouseMove.bind (this, sh)
        }

        protected onMouseMove (sh: Region2d)
        {
            console.log ("mouseMove")
            this.hideAll ()
            this.background.onmousemove = null
        }

        private selectedSape: Region2d = null

        protected onClick (name: string, sh: Region2d)
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

            if( sh.onSelect )
                sh.onSelect (sh)
                
            this.selectedSape = sh
        }

        unselect ()
        {
            var sh = this.selectedSape
            if( sh == null )
                return
                
            sh.unselect ()
            this.hideAll ()

            if( sh.onUnselect )
                sh.onUnselect (sh)

            this.selectedSape = null

            return
        }

        protected onBackgroundClick ()
        {
            this.unselect ()
            /*if( this.currentShape )
                this.currentShape.setSelected (false)
            
            this.hideAll ()*/
        }

        protected show (sh: Region2d)
        {
            for( var name in this.shapes )
                this.shapes[name].hide ()

            sh.show ()

            this.background.style.opacity = "0.5"
        }

        protected hideAll ()
        {
            for( var name in this.shapes )
                this.shapes[name].hide ()
            
            this.background.style.opacity = "1"
        }
    }
}