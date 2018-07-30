
function initMillemontSVG (obj: HTMLObjectElement)
{
    var map = new Millemont.Svg2dMap (obj)

    var fn = (name: string, sh: Millemont.Shape) => { document.getElementById ("info").innerHTML = name }
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
            c.setAttributeNS (null, "stroke-width", "15")
            c.style.fillOpacity = "0.5"
            c.style.transition = "all 0.5s"

            this.ownerDoc.querySelector ("svg").appendChild (c)
            this.centerPoint = c

            if( !this.ownerDoc.querySelector ("#blur-filter") )
            {
                var tmp = this.ownerDoc.createElementNS ("http://www.w3.org/2000/svg", "g")
                tmp.innerHTML = `<filter id="blur-filter" x="0" y="0">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="8" />
                </filter>`

                this.ownerDoc.querySelector ("svg g").appendChild (tmp.children[0])
            }
        }

        onClick? (name: string, sh: this): void

        private active: boolean = false

        setSelected (v: boolean)
        {
            this.active = v

            this.path.style.stroke = v ? "white" : ""
            this.path.style.filter = v ? "url(#blur-filter)" : ""
            this.centerPoint.style.stroke = v ? "white" : "transparent"
        }

        hide ()
        {
            this.path.style.strokeWidth = this.active ? "" : "0"
            this.image.style.opacity    = this.active ? "1" : "0"
            this.centerPoint.style.fillOpacity = this.active ? "1" : "0.5"
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
                sh.centerPoint.addEventListener ("click", this.onClick.bind (this, name, sh))
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

        private currentShape: Shape

        protected onClick (name: string, sh: Shape)
        {
            if( this.currentShape )
                this.currentShape.setSelected (false)
            
            sh.setSelected (true)
            this.currentShape = sh

            this.show (sh)

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