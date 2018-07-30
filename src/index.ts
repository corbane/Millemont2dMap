


function initMillemontSVG (obj: HTMLObjectElement)
{
    var map = new Millemont.Svg2dMap (obj)

    var fn = (name: string, sh: Millemont.Shape) => { alert (name) }
    map.shapes.camping.onClick = fn
    map.shapes.courDesCochets.onClick = fn
    map.shapes.grandChateau.onClick = fn
    map.shapes.orangerie.onClick = fn
    map.shapes.petitChateau.onClick = fn

    console.log (map)
}

module Millemont
{
    export class Shape 
    {
        readonly centerPoint: SVGCircleElement

        constructor (protected ownerDoc: Document, readonly path: SVGPolygonElement, readonly image: SVGImageElement)
        {
            image.style.transition = "all 0.25s"

            var bbox = path.getBBox (),
                c = this.ownerDoc.createElementNS ("http://www.w3.org/2000/svg", "circle")

            c.setAttributeNS (null, "cx", (bbox.x + bbox.width / 2).toString ())
            c.setAttributeNS (null, "cy", (bbox.y + bbox.height / 2).toString ())
            c.setAttributeNS (null, "r", "100")
            c.setAttributeNS (null, "fill", "#FFD500")
            c.setAttributeNS (null, "stroke-width", "20")
            c.style.fillOpacity = "0.5"
            c.style.transition = "all 0.5s"

            this.ownerDoc.querySelector ("svg").appendChild (c)
            this.centerPoint = c
        }

        onClick? (name: string, sh: this): void

        hide ()
        {
            this.path.style.strokeWidth = "0"
            this.image.style.opacity = "0"
            this.centerPoint.style.fillOpacity = "0.5"
        }

        show ()
        {
            this.path.style.strokeWidth = ""
            this.image.style.opacity = "1"
            this.centerPoint.style.fillOpacity = "1"
        }
    }

    export class Svg2dMap
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
                orangerie:      new Shape (doc, doc.querySelector ("#t_orangerie"), doc.querySelector ("#i_orangerie")),
                grandChateau:   new Shape (doc, doc.querySelector ("#t_grchateau"), doc.querySelector ("#i_grchateau")),
                petitChateau:   new Shape (doc, doc.querySelector ("#t_ptchateau"), doc.querySelector ("#i_ptchateau")),
                camping:        new Shape (doc, doc.querySelector ("#t_camping"), doc.querySelector ("#i_camping")),
                courDesCochets: new Shape (doc, doc.querySelector ("#t_cochets"), doc.querySelector ("#i_cochets"))
            }
            
            for( var name in this.shapes )
            {
                var sh = this.shapes[name] as Shape
                sh.image.addEventListener ("click", this.onClick.bind (this, name, sh))
                sh.image.addEventListener ("mouseover", this.onMouseOver.bind (this, sh))
            }

            this.background = doc.querySelector ("#i_background") as SVGImageElement
            this.background.style.opacity = "1"
            this.background.style.transition = "all 0.25s"
        }

        protected onMouseOver (sh: Shape)
        {
            console.log ("mouseOver")
            this.show (sh)
            this.background.onmousemove = this.onMouseMove.bind (this, sh)
        }

        protected onMouseMove (sh: Shape)
        {
            console.log ("mouseMove")
            this.hideAll ()
            this.background.onmousemove = null
        }

        protected onClick (name: string, sh: Shape)
        {
            if( sh.onClick )
                sh.onClick (name, sh)
        }

       show (sh: Shape)
        {
            for( var name in this.shapes )
                this.shapes[name].hide ()

            sh.show ()

            this.background.style.opacity = "0.5"
        }

        hideAll ()
        {
            for( var name in this.shapes )
                this.shapes[name].hide ()
            
            this.background.style.opacity = "1"
        }
    }
}