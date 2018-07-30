function initMillemontSVG(obj) {
    var map = new Millemont.Svg2dMap(obj);
    var fn = function (sh) {
        document.getElementById("info").innerHTML = sh.image.id;
    };
    map.shapes.camping.onSelect = fn;
    map.shapes.courDesCochets.onSelect = fn;
    map.shapes.grandChateau.onSelect = fn;
    map.shapes.orangerie.onSelect = fn;
    map.shapes.petitChateau.onSelect = fn;
    var ufn = function (sh) {
        document.getElementById("info").innerHTML = "<br/>";
    };
    map.shapes.camping.onUnselect = ufn;
    map.shapes.courDesCochets.onUnselect = ufn;
    map.shapes.grandChateau.onUnselect = ufn;
    map.shapes.orangerie.onUnselect = ufn;
    map.shapes.petitChateau.onUnselect = ufn;
    console.log(map);
}
var Millemont;
(function (Millemont) {
    var Shape = /** @class */ (function () {
        function Shape(ownerDoc, path, image) {
            this.ownerDoc = ownerDoc;
            this.path = path;
            this.image = image;
            this.active = false;
            image.style.transition = "all 0.25s";
            var bbox = path.getBBox(), c = this.ownerDoc.createElementNS("http://www.w3.org/2000/svg", "circle");
            c.setAttributeNS(null, "cx", (bbox.x + bbox.width / 2).toString());
            c.setAttributeNS(null, "cy", (bbox.y + bbox.height / 2).toString());
            c.setAttributeNS(null, "r", "100");
            c.setAttributeNS(null, "fill", "#FFD500");
            c.setAttributeNS(null, "stroke-width", "15");
            c.style.fillOpacity = "0.5";
            c.style.transition = "all 0.5s";
            this.ownerDoc.querySelector("svg").appendChild(c);
            this.centerPoint = c;
            if (!this.ownerDoc.querySelector("#blur-filter")) {
                var tmp = this.ownerDoc.createElementNS("http://www.w3.org/2000/svg", "g");
                tmp.innerHTML = "<filter id=\"blur-filter\" x=\"0\" y=\"0\">\n                    <feGaussianBlur in=\"SourceGraphic\" stdDeviation=\"8\" />\n                </filter>";
                this.ownerDoc.querySelector("svg g").appendChild(tmp.children[0]);
            }
        }
        Shape.prototype.setSelected = function (v) {
            this.active = v;
            this.path.style.stroke = v ? "white" : "";
            this.path.style.filter = v ? "url(#blur-filter)" : "";
            this.centerPoint.style.stroke = v ? "white" : "transparent";
        };
        Shape.prototype.hide = function () {
            this.path.style.strokeWidth = this.active ? "" : "0";
            this.image.style.opacity = this.active ? "1" : "0";
            this.centerPoint.style.fillOpacity = this.active ? "1" : "0.5";
        };
        Shape.prototype.show = function () {
            this.path.style.strokeWidth = "";
            this.image.style.opacity = "1";
            this.centerPoint.style.fillOpacity = "1";
        };
        return Shape;
    }());
    Millemont.Shape = Shape;
    var Svg2dMap = /** @class */ (function () {
        function Svg2dMap(el) {
            this.el = el;
            this.selectedSape = null;
            var doc = el.contentDocument;
            this.shapes = {
                orangerie: new Shape(doc, doc.querySelector("#t_orangerie"), doc.querySelector("#i_orangerie")),
                grandChateau: new Shape(doc, doc.querySelector("#t_grchateau"), doc.querySelector("#i_grchateau")),
                petitChateau: new Shape(doc, doc.querySelector("#t_ptchateau"), doc.querySelector("#i_ptchateau")),
                camping: new Shape(doc, doc.querySelector("#t_camping"), doc.querySelector("#i_camping")),
                courDesCochets: new Shape(doc, doc.querySelector("#t_cochets"), doc.querySelector("#i_cochets"))
            };
            for (var name in this.shapes) {
                var sh = this.shapes[name];
                sh.image.addEventListener("click", this.onClick.bind(this, name, sh));
                sh.centerPoint.addEventListener("click", this.onClick.bind(this, name, sh));
                sh.image.addEventListener("mouseover", this.onMouseOver.bind(this, sh));
            }
            var bg = doc.querySelector("#i_background");
            bg.style.opacity = "1";
            bg.style.transition = "all 0.5s";
            bg.addEventListener("click", this.onBackgroundClick.bind(this));
            this.background = bg;
        }
        Svg2dMap.prototype.onMouseOver = function (sh) {
            console.log("mouseOver");
            this.show(sh);
            this.background.onmousemove = this.onMouseMove.bind(this, sh);
        };
        Svg2dMap.prototype.onMouseMove = function (sh) {
            console.log("mouseMove");
            this.hideAll();
            this.background.onmousemove = null;
        };
        Svg2dMap.prototype.onClick = function (name, sh) {
            if (this.selectedSape == sh) {
                this.unselect();
                this.show(sh);
            }
            else {
                this.unselect();
                this.select(sh);
            }
        };
        Svg2dMap.prototype.select = function (sh) {
            if (this.selectedSape)
                this.selectedSape.setSelected(false);
            sh.setSelected(true);
            this.show(sh);
            if (sh.onSelect)
                sh.onSelect(sh);
            this.selectedSape = sh;
        };
        Svg2dMap.prototype.unselect = function () {
            var sh = this.selectedSape;
            if (sh == null)
                return;
            sh.setSelected(false);
            this.hideAll();
            if (sh.onUnselect)
                sh.onUnselect(sh);
            this.selectedSape = null;
            return;
        };
        Svg2dMap.prototype.onBackgroundClick = function () {
            this.unselect();
            /*if( this.currentShape )
                this.currentShape.setSelected (false)
            
            this.hideAll ()*/
        };
        Svg2dMap.prototype.show = function (sh) {
            for (var name in this.shapes)
                this.shapes[name].hide();
            sh.show();
            this.background.style.opacity = "0.5";
        };
        Svg2dMap.prototype.hideAll = function () {
            for (var name in this.shapes)
                this.shapes[name].hide();
            this.background.style.opacity = "1";
        };
        return Svg2dMap;
    }());
    Millemont.Svg2dMap = Svg2dMap;
})(Millemont || (Millemont = {}));
//# sourceMappingURL=index.js.map