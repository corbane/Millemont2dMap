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
            this.popup.style.top = (window.screenY + b.top + offsetY) + "px";
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
        function Region2d(container, options) {
            this.container = container;
            this.active = false;
            this.path = typeof options.path == "string" ? container.ownerDocument.querySelector(options.path) : options.path;
            this.image = typeof options.image == "string" ? container.ownerDocument.querySelector(options.image) : options.image;
            this.image.style.transition = "all 0.25s";
            if (options.onSelect)
                this.onSelect = options.onSelect;
            if (options.onUnselect)
                this.onUnselect = options.onUnselect;
            this.infoPoint = new MMMFest.InfoPoint(container);
            var bbox = this.path.getBBox();
            this.infoPoint.setPosition(bbox.x + bbox.width / 2, bbox.y + bbox.height / 2);
            this.infoPoint.setScale(10);
            if (options.popupInfo)
                this.infoPoint.setPopup(options.popupInfo);
            if (!this.container.ownerDocument.querySelector("#blur-filter")) {
                var tmp = this.container.ownerDocument.createElementNS("http://www.w3.org/2000/svg", "g");
                tmp.innerHTML = "<filter id=\"blur-filter\" x=\"0\" y=\"0\">\n                    <feGaussianBlur in=\"SourceGraphic\" stdDeviation=\"8\" />\n                </filter>";
                this.container.ownerDocument.querySelector("svg g").appendChild(tmp.children[0]);
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
        function Map2d(container, options) {
            this.container = container;
            this.regions = [];
            this.selectedSape = null;
            if (typeof options.background == "string")
                var bg = this.container.querySelector(options.background);
            else
                var bg = options.background;
            bg.style.opacity = "1";
            bg.style.transition = "all 0.5s";
            bg.addEventListener("click", this.onBackgroundClick.bind(this));
            this.background = bg;
        }
        Map2d.prototype.addRegion = function (regionOptions) {
            var r = new MMMFest.Region2d(this.container, regionOptions);
            r.image.addEventListener("click", this.onClick.bind(this, r));
            r.infoPoint.svg.addEventListener("click", this.onClick.bind(this, r));
            r.image.addEventListener("mouseover", this.onMouseOver.bind(this, r));
            this.regions.push(r);
            return r;
        };
        Map2d.prototype.onMouseOver = function (sh) {
            this.show(sh);
            this.background.onmousemove = this.onMouseMove.bind(this, sh);
        };
        Map2d.prototype.onMouseMove = function (sh) {
            this.hideAll();
            this.background.onmousemove = null;
        };
        Map2d.prototype.onClick = function (sh) {
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
            for (var _i = 0, _a = this.regions; _i < _a.length; _i++) {
                var s = _a[_i];
                s.hide();
            }
            sh.show();
            this.background.style.opacity = "0.5";
        };
        Map2d.prototype.hideAll = function () {
            for (var _i = 0, _a = this.regions; _i < _a.length; _i++) {
                var s = _a[_i];
                s.hide();
            }
            this.background.style.opacity = "1";
        };
        return Map2d;
    }());
    MMMFest.Map2d = Map2d;
})(MMMFest || (MMMFest = {}));
/// <reference path="map-2d.ts" />
function initMillemontSVG(obj) {
    var map = new MMMFest.Map2d(obj.contentDocument.querySelector("svg"), { background: "#i_background" }), fn = function (sh) {
        document.getElementById("info").innerHTML = sh.image.id;
    }, ufn = function (sh) {
        document.getElementById("info").innerHTML = "<br/>";
    };
    map.addRegion({ path: "#t_orangerie", image: "#i_orangerie", onSelect: fn, onUnselect: ufn, popupInfo: document.querySelector("#p_orangerie") });
    map.addRegion({ path: "#t_grchateau", image: "#i_grchateau", onSelect: fn, onUnselect: ufn, popupInfo: document.querySelector("#p_orangerie") });
    map.addRegion({ path: "#t_ptchateau", image: "#i_ptchateau", onSelect: fn, onUnselect: ufn, popupInfo: document.querySelector("#p_orangerie") });
    map.addRegion({ path: "#t_cochets", image: "#i_cochets", onSelect: fn, onUnselect: ufn, popupInfo: null });
    var camp = map.addRegion({ path: "#t_camping", image: "#i_camping", onSelect: fn, onUnselect: ufn });
    camp.infoPoint.offsetY(-200);
    console.log(map);
}
//# sourceMappingURL=index.js.map