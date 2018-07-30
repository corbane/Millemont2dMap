


function initMillemontSVG (obj: HTMLObjectElement)
{
    console.log (new Millemont.clicable2dMap (obj))
}

module Millemont
{
    export class Shape 
    {
        constructor (readonly path: SVGPolygonElement, readonly image: SVGImageElement)
        {  }
    }

    export class clicable2dMap
    {
        readonly shapes: {
            orangerie: Shape
            grandChateau: Shape
            petitChateau: Shape
            camping: Shape
            courDesCochets: Shape
        }

        readonly background: SVGImageElement

        constructor (protected el: HTMLObjectElement)
        {
            var doc = el.contentDocument

            this.shapes = {
                orangerie:      new Shape (doc.querySelector ("#t_orangerie"), doc.querySelector ("#i_orangerie")),
                grandChateau:   new Shape (doc.querySelector ("#t_grchateau"), doc.querySelector ("#i_grchateau")),
                petitChateau:   new Shape (doc.querySelector ("#t_ptchateau"), doc.querySelector ("#i_ptchateau")),
                camping:        new Shape (doc.querySelector ("#t_camping"), doc.querySelector ("#i_camping")),
                courDesCochets: new Shape (doc.querySelector ("#t_cochets"), doc.querySelector ("#i_cochets"))
            }

            for( var name in this.shapes )
                this.initShape (this.shapes[name])

            this.background = doc.querySelector ("#i_background") as SVGImageElement
            this.initBackground ()
        }

        private currentShape = null

        protected onMouseOver (sh: Shape)
        {
            this.currentShape = sh
            this.hideAllOther (sh)
            this.background.addEventListener ("mousemove", this.onMouseMove.bind (this, sh))
        }

        protected onMouseMove (sh: Shape)
        {
            if( !this.currentShape )
                return

            this.currentShape = null
            this.hideAll ()
        }

        hideAllOther (sh: Shape)
        {
            for( var name in this.shapes )
                this.hide (this.shapes[name])

            this.show (sh)

            this.background.style.opacity = "0.5"
        }

        hideAll ()
        {
            for( var name in this.shapes )
                this.hide (this.shapes[name])

            this.background.style.opacity = "1"
        }

        private initShape (sh: Shape)
        {
            sh.path.style.strokeWidth = "15"

            //path.style.transition = "all 0.25s"
            sh.path.style.strokeWidth = "0"

            sh.image.style.transition = "all 0.25s"
            sh.image.addEventListener ("mouseover", this.onMouseOver.bind (this, sh))
        }

        private initBackground ()
        {
            this.background.style.opacity = "1"
            this.background.style.transition = "all 0.25s"
        }

        private hide (sh: Shape)
        {
            //sh.path.style.fill = ""
            //sh.path.style.fillOpacity = ""
            sh.path.style.strokeWidth = "0"
            sh.image.style.opacity = "0"
        }

        private show (sh: Shape)
        {
            //sh.path.style.fill = "#FFD500"
            //sh.path.style.fillOpacity = "0.5"
            sh.path.style.strokeWidth = ""
            sh.image.style.opacity = "1"
        }
    }
}