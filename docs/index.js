var MMMFest;
(function (MMMFest) {
    var InfoPoint = /** @class */ (function () {
        function InfoPoint(container) {
            this.container = container;
            this.popup = null;
            this.scale = 1;
            this.active = false;
            var g = this.container.ownerDocument.createElementNS("http://www.w3.org/2000/svg", "g");
            g.setAttributeNS(null, "pointer-events", "all");
            g.addEventListener("mouseover", this.showPopup.bind(this));
            g.addEventListener("mouseout", this.hidePopup.bind(this));
            container.appendChild(g);
            this.svg = g;
            this.setPosition(100, 100);
        }
        InfoPoint.prototype.updateSvg = function () {
            this.svg.style.transform = "scale(" + this.scale + ")";
            this.svg.style.transformOrigin = this.x + "px " + this.y + "px"; // "center center"
            this.svg.innerHTML = this.getInnerSvg();
        };
        InfoPoint.prototype.getInnerSvg = function () {
            return "\n                <circle cx=\"" + this.x + "\" cy=\"" + this.y + "\" r=\"14\" fill=\"" + (this.active ? "#FFD50055" : "none") + "\" stroke=\"gold\" stroke-width=\"2\"/>\n                <circle cx=\"" + this.x + "\" cy=\"" + (this.y - 6) + "\" r=\"2\" fill=\"gold\"/>\n                <rect x=\"" + (this.x - 1.5) + "\" y=\"" + (this.y - 2) + "\" width=\"3\" height=\"10\" fill=\"gold\"/>";
        };
        InfoPoint.prototype.setPosition = function (x, y) {
            this.x = this.x_origin = x;
            this.y = this.y_origin = y;
            this.updateSvg();
            this.svg.innerHTML = this.getInnerSvg();
        };
        InfoPoint.prototype.offsetX = function (n) {
            this.x = this.x_origin + n;
            this.updateSvg();
        };
        InfoPoint.prototype.offsetY = function (n) {
            this.y = this.y_origin + n;
            this.updateSvg();
        };
        InfoPoint.prototype.setScale = function (n) {
            this.scale = n;
            this.svg.style.transform = "scale(" + this.scale + ")";
        };
        InfoPoint.prototype.select = function () {
            this.active = true;
            this.updateSvg();
        };
        InfoPoint.prototype.unselect = function () {
            this.active = false;
            this.updateSvg();
        };
        InfoPoint.prototype.setPopup = function (popup) {
            if (popup)
                popup.classList.add("mmmfest-2dmap-popup");
            this.popup = popup;
        };
        InfoPoint.prototype.showPopup = function (evt) {
            if (!this.popup)
                return;
            this.popup.style.display = "block";
            var b = this.svg.getBoundingClientRect(), offsetY = this.popup.getBoundingClientRect().height / 2 - b.height / 2;
            this.popup.style.left = (b.left + b.width + 20) + "px";
            this.popup.style.top = (window.screenY + b.top + b.height - offsetY) + "px";
        };
        InfoPoint.prototype.hidePopup = function () {
            if (!this.popup)
                return;
            this.popup.style.display = "none";
        };
        return InfoPoint;
    }());
    MMMFest.InfoPoint = InfoPoint;
})(MMMFest || (MMMFest = {}));
/// <reference path="info-point.ts" />
var MMMFest;
(function (MMMFest) {
    var Region2d = /** @class */ (function () {
        function Region2d(svg, path, image) {
            this.svg = svg;
            this.path = path;
            this.image = image;
            this.active = false;
            image.style.transition = "all 0.25s";
            var bbox = path.getBBox();
            this.infoPoint = new MMMFest.InfoPoint(svg.ownerDocument.querySelector("svg"));
            this.infoPoint.setPosition(bbox.x + bbox.width / 2, bbox.y + bbox.height / 2);
            this.infoPoint.setScale(10);
            /*var bbox = path.getBBox (),
                c = this.ownerDoc.createElementNS ("http://www.w3.org/2000/svg", "circle")

            c.setAttributeNS (null, "cx", (bbox.x + bbox.width / 2).toString ())
            c.setAttributeNS (null, "cy", (bbox.y + bbox.height / 2).toString ())
            c.setAttributeNS (null, "r", "100")
            c.setAttributeNS (null, "fill", "#FFD500")
            c.setAttributeNS (null, "stroke-width", "15")
            c.style.fillOpacity = "0.5"
            c.style.transition = "all 0.5s"

            this.ownerDoc.querySelector ("svg").appendChild (c)
            this.centerPoint = c*/
            if (!this.svg.ownerDocument.querySelector("#blur-filter")) {
                var tmp = this.svg.ownerDocument.createElementNS("http://www.w3.org/2000/svg", "g");
                tmp.innerHTML = "<filter id=\"blur-filter\" x=\"0\" y=\"0\">\n                    <feGaussianBlur in=\"SourceGraphic\" stdDeviation=\"8\" />\n                </filter>";
                this.svg.ownerDocument.querySelector("svg g").appendChild(tmp.children[0]);
            }
        }
        Region2d.prototype.select = function () {
            this.active = true;
            this.path.style.stroke = "white";
            this.path.style.filter = "url(#blur-filter)";
            this.infoPoint.select();
        };
        Region2d.prototype.unselect = function () {
            this.active = false;
            this.path.style.stroke = "";
            this.path.style.filter = "";
            this.infoPoint.unselect();
        };
        Region2d.prototype.hide = function () {
            this.path.style.strokeWidth = this.active ? "" : "0";
            this.image.style.opacity = this.active ? "1" : "0";
            //this.centerPoint.style.fillOpacity = this.active ? "1" : "0.5"
            //this.infoPoint.svg.style.fillOpacity = this.active ? "1" : "0.5"
        };
        Region2d.prototype.show = function () {
            this.path.style.strokeWidth = "";
            this.image.style.opacity = "1";
            //this.centerPoint.style.fillOpacity = "1"
            //this.infoPoint.svg.style.fillOpacity = "1"
        };
        return Region2d;
    }());
    MMMFest.Region2d = Region2d;
})(MMMFest || (MMMFest = {}));
/// <reference path="region-2d.ts" />
var MMMFest;
(function (MMMFest) {
    var Map2d = /** @class */ (function () {
        function Map2d(el) {
            this.el = el;
            this.selectedSape = null;
            var svg = el.contentDocument.querySelector("svg");
            this.shapes = {
                orangerie: new MMMFest.Region2d(svg, svg.querySelector("#t_orangerie"), svg.querySelector("#i_orangerie")),
                grandChateau: new MMMFest.Region2d(svg, svg.querySelector("#t_grchateau"), svg.querySelector("#i_grchateau")),
                petitChateau: new MMMFest.Region2d(svg, svg.querySelector("#t_ptchateau"), svg.querySelector("#i_ptchateau")),
                camping: new MMMFest.Region2d(svg, svg.querySelector("#t_camping"), svg.querySelector("#i_camping")),
                courDesCochets: new MMMFest.Region2d(svg, svg.querySelector("#t_cochets"), svg.querySelector("#i_cochets"))
            };
            for (var name in this.shapes) {
                var sh = this.shapes[name];
                sh.image.addEventListener("click", this.onClick.bind(this, name, sh));
                //sh.centerPoint.addEventListener ("click", this.onClick.bind (this, name, sh))
                sh.infoPoint.svg.addEventListener("click", this.onClick.bind(this, name, sh));
                sh.image.addEventListener("mouseover", this.onMouseOver.bind(this, sh));
            }
            var bg = svg.querySelector("#i_background");
            bg.style.opacity = "1";
            bg.style.transition = "all 0.5s";
            bg.addEventListener("click", this.onBackgroundClick.bind(this));
            this.background = bg;
        }
        Map2d.prototype.onMouseOver = function (sh) {
            console.log("mouseOver");
            this.show(sh);
            this.background.onmousemove = this.onMouseMove.bind(this, sh);
        };
        Map2d.prototype.onMouseMove = function (sh) {
            console.log("mouseMove");
            this.hideAll();
            this.background.onmousemove = null;
        };
        Map2d.prototype.onClick = function (name, sh) {
            if (this.selectedSape == sh) {
                this.unselect();
                this.show(sh);
            }
            else {
                this.unselect();
                this.select(sh);
            }
        };
        Map2d.prototype.select = function (sh) {
            if (this.selectedSape)
                this.selectedSape.unselect();
            sh.select();
            this.show(sh);
            if (sh.onSelect)
                sh.onSelect(sh);
            this.selectedSape = sh;
        };
        Map2d.prototype.unselect = function () {
            var sh = this.selectedSape;
            if (sh == null)
                return;
            sh.unselect();
            this.hideAll();
            if (sh.onUnselect)
                sh.onUnselect(sh);
            this.selectedSape = null;
            return;
        };
        Map2d.prototype.onBackgroundClick = function () {
            this.unselect();
            /*if( this.currentShape )
                this.currentShape.setSelected (false)
            
            this.hideAll ()*/
        };
        Map2d.prototype.show = function (sh) {
            for (var name in this.shapes)
                this.shapes[name].hide();
            sh.show();
            this.background.style.opacity = "0.5";
        };
        Map2d.prototype.hideAll = function () {
            for (var name in this.shapes)
                this.shapes[name].hide();
            this.background.style.opacity = "1";
        };
        return Map2d;
    }());
    MMMFest.Map2d = Map2d;
})(MMMFest || (MMMFest = {}));
/// <reference path="map-2d.ts" />
function initMillemontSVG(obj) {
    var map = new MMMFest.Map2d(obj);
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
    map.shapes.camping.infoPoint.setPopup(document.querySelector("#p_orangerie"));
    map.shapes.courDesCochets.infoPoint.setPopup(null);
    map.shapes.grandChateau.infoPoint.setPopup(document.querySelector("#p_grchateau"));
    //map.shapes.orangerie.infoPoint.setPopup      ...
    map.shapes.petitChateau.infoPoint.setPopup(document.querySelector("#p_orangerie"));
    map.shapes.camping.infoPoint.offsetY(-200);
    console.log(map);
}
//# sourceMappingURL=index.js.map