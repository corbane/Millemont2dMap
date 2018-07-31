var MMMFest;
(function (MMMFest) {
    var InfoPoint = /** @class */ (function () {
        function InfoPoint() {
            this.popup = null;
            this.scale = 1;
            this.active = false;
            var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
            g.setAttributeNS(null, "pointer-events", "all");
            g.addEventListener("mouseover", this.showPopup.bind(this));
            g.addEventListener("mouseout", this.hidePopup.bind(this));
            this.svg = g;
            this.setPosition(100, 100);
        }
        InfoPoint.prototype.updateSvg = function () {
            this.svg.style.transform = "scale(" + this.scale + ")";
            this.svg.style.transformOrigin = this.x + "px " + this.y + "px"; // "center center"
            this.svg.innerHTML = this.getInnerSvg();
        };
        /**
         * Overrides this method for build a custom style point
         */
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
                popup.classList.add("mmmfest", "map-popup");
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
var MMMFest;
(function (MMMFest) {
    var Event;
    (function (Event) {
        var Handle = /** @class */ (function () {
            function Handle() {
                var _this = this;
                this.registers = [];
                this.trigger = (function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    for (var _a = 0, _b = _this.registers; _a < _b.length; _a++) {
                        var fn = _b[_a];
                        fn.apply(_this, args);
                    }
                });
            }
            Handle.prototype.add = function (callback) {
                this.registers.push(callback);
                return this.registers.length - 1;
            };
            Handle.prototype.remove = function (idx) {
                if (idx < 0 || this.registers.length < idx + 1)
                    return;
                this.registers.splice(idx, 1);
            };
            return Handle;
        }());
        Event.Handle = Handle;
    })(Event = MMMFest.Event || (MMMFest.Event = {}));
})(MMMFest || (MMMFest = {}));
/// <reference path="info-point.ts" />
/// <reference path="event.ts" />
var MMMFest;
(function (MMMFest) {
    var tmp = document.createElementNS("http://www.w3.org/2000/svg", "g");
    tmp.innerHTML
        = "<filter id=\"blur-filter\" x=\"0\" y=\"0\">"
            + "<feGaussianBlur in=\"SourceGraphic\" stdDeviation=\"8\" />"
            + "</filter>";
    var blurFilterExists = false;
    var blurFilterElement = tmp.children[0];
    var Region2d = /** @class */ (function () {
        function Region2d(map, options) {
            this.map = map;
            this.HMouseOver = new MMMFest.Event.Handle();
            this.HClick = new MMMFest.Event.Handle();
            this.HSelect = new MMMFest.Event.Handle();
            this.HUnselect = new MMMFest.Event.Handle();
            this.HEnable = new MMMFest.Event.Handle();
            this.HDisable = new MMMFest.Event.Handle();
            var doc = map.container.ownerDocument;
            // Initialize path & background
            this.path = typeof options.path == "string"
                ? doc.querySelector(options.path)
                : options.path;
            this.background = typeof options.image == "string"
                ? doc.querySelector(options.image)
                : options.image;
            this.path.classList.add("path");
            if (!blurFilterExists) {
                map.container.appendChild(blurFilterElement);
                blurFilterExists = true;
            }
            // Create clipping path
            var p;
            switch (this.path.tagName) {
                case "polygon":
                case "polyline":
                    p = doc.createElementNS("http://www.w3.org/2000/svg", "polyline");
                    p.setAttributeNS(null, "points", this.path.getAttributeNS(null, "points"));
                    break;
                default:
                    throw "Not implemented";
            }
            var clipPath = doc.createElementNS("http://www.w3.org/2000/svg", "clipPath");
            clipPath.id = "clip-" + this.path.id;
            clipPath.appendChild(p);
            // Create info point
            this.infoPoint = new MMMFest.InfoPoint();
            var bbox = this.path.getBBox();
            this.infoPoint.setPosition(bbox.x + bbox.width / 2, bbox.y + bbox.height / 2);
            this.infoPoint.setScale(10);
            if (options.popupInfo)
                this.infoPoint.setPopup(options.popupInfo);
            // Create clipping background
            this.image = doc.createElementNS("http://www.w3.org/2000/svg", "use");
            this.image.classList.add("image");
            this.image.setAttributeNS("http://www.w3.org/1999/xlink", "href", '#' + this.background.id);
            this.image.setAttributeNS(null, "clip-path", "url(#" + clipPath.id + ")");
            // Create master svg element
            var g = doc.createElementNS("http://www.w3.org/2000/svg", "g");
            g.classList.add("region2d");
            g.appendChild(clipPath);
            g.appendChild(this.image);
            g.appendChild(this.path);
            g.appendChild(this.infoPoint.svg);
            this.svg = g;
            map.container.appendChild(g);
            // Initialize event callbacks
            this.svg.addEventListener("click", this.onClick.bind(this));
            this.svg.addEventListener("mouseover", this.onMouseOver.bind(this));
        }
        Region2d.prototype.onClick = function (evt) {
            this.HClick.trigger(this, evt);
            if (this.isSelected())
                this.unselect();
            else
                this.select();
        };
        Region2d.prototype.onMouseOver = function (evt) {
            console.log("OVER");
            this.HMouseOver.trigger(this, evt);
        };
        Region2d.prototype.isSelected = function () {
            return this.svg.classList.contains("selected");
        };
        Region2d.prototype.select = function () {
            this.svg.classList.add("selected");
            this.infoPoint.select();
            this.HSelect.trigger(this);
        };
        Region2d.prototype.unselect = function () {
            this.svg.classList.remove("selected");
            this.infoPoint.unselect();
            this.HUnselect.trigger(this);
        };
        Region2d.prototype.isEnabled = function () {
            return !this.svg.classList.contains("disabled");
        };
        Region2d.prototype.enable = function () {
            this.svg.classList.remove("disabled");
            this.HEnable.trigger(this);
        };
        Region2d.prototype.disable = function () {
            this.svg.classList.add("disabled");
            this.HDisable.trigger(this);
        };
        return Region2d;
    }());
    MMMFest.Region2d = Region2d;
})(MMMFest || (MMMFest = {}));
/// <reference path="region-2d.ts" />
/// <reference path="event.ts" />
var MMMFest;
(function (MMMFest) {
    var Map2d = /** @class */ (function () {
        function Map2d(container, options) {
            // Initialize background
            this.container = container;
            this.regions = [];
            this.selectedSape = null;
            if (typeof options.background == "string")
                this.background = this.container.querySelector(options.background);
            else
                this.background = options.background;
            this.background.classList.add("mmmfest", "map2d-background");
            this.background.onclick = this.onBackgroundClick.bind(this);
            // Initialize svg viewbox
            this.container.classList.add("mmmfest", "map2d");
            this.container.viewBox.baseVal.x = this.background.y.baseVal.value;
            this.container.viewBox.baseVal.y = this.background.x.baseVal.value;
            this.container.viewBox.baseVal.width = this.background.width.baseVal.value;
            this.container.viewBox.baseVal.height = this.background.height.baseVal.value;
        }
        Map2d.prototype.addRegion = function (regionOptions) {
            var region = new MMMFest.Region2d(this, regionOptions);
            region.HSelect.add(this.onRegionSelected.bind(this, region));
            region.HUnselect.add(this.onRegionUnelected.bind(this, region));
            region.HMouseOver.add(this.onOverRegion.bind(this, region));
            this.regions.push(region);
            return region;
        };
        //#region Selection
        Map2d.prototype.select = function (region) {
            region.select();
        };
        Map2d.prototype.unselect = function () {
            if (this.selectedSape)
                this.selectedSape.unselect();
        };
        Map2d.prototype.onRegionSelected = function (region) {
            if (this.selectedSape)
                this.selectedSape.unselect();
            this.selectedSape = region;
        };
        Map2d.prototype.onRegionUnelected = function (region) {
            this.selectedSape = null;
        };
        Map2d.prototype.onBackgroundClick = function (evt) {
            if (evt.target != this.background)
                return;
            this.unselect();
        };
        //#endregion
        //#region display mode
        Map2d.prototype.setGhostMode = function (sh) {
            for (var _i = 0, _a = this.regions; _i < _a.length; _i++) {
                var s = _a[_i];
                s.disable();
            }
            sh.enable();
            this.background.classList.add("disabled");
        };
        Map2d.prototype.setInitialMode = function () {
            for (var _i = 0, _a = this.regions; _i < _a.length; _i++) {
                var s = _a[_i];
                s.disable();
            }
            this.background.classList.remove("disabled");
        };
        Map2d.prototype.onOverRegion = function (region, evt) {
            console.log("Event onMouseOver");
            this.background.onmouseover = this.onOverBackground.bind(this);
            this.setGhostMode(region);
        };
        Map2d.prototype.onOverBackground = function (region, evt) {
            console.log("onOverBackground");
            this.background.onmouseover = null;
            this.setInitialMode();
        };
        return Map2d;
    }());
    MMMFest.Map2d = Map2d;
})(MMMFest || (MMMFest = {}));
/// <reference path="map-2d.ts" />
function init(obj) {
    var map = new MMMFest.Map2d(obj.contentDocument.querySelector("svg"), { background: "#i_background" }), backgroundImage = obj.contentDocument.querySelector("#i_background");
    var oran = map.addRegion({ path: "#t_orangerie", image: backgroundImage, /*onSelect: fn, onUnselect: ufn,*/ popupInfo: document.querySelector("#p_orangerie") });
    var grch = map.addRegion({ path: "#t_grchateau", image: backgroundImage, /*onSelect: fn, onUnselect: ufn,*/ popupInfo: document.querySelector("#p_grchateau") });
    var ptch = map.addRegion({ path: "#t_ptchateau", image: backgroundImage, /*onSelect: fn, onUnselect: ufn,*/ popupInfo: document.querySelector("#p_orangerie") });
    var coch = map.addRegion({ path: "#t_cochets", image: backgroundImage, /*onSelect: fn, onUnselect: ufn,*/ popupInfo: null });
    var camp = map.addRegion({ path: "#t_camping", image: backgroundImage });
    camp.infoPoint.offsetY(-200);
    oran.HSelect.add(fn);
    grch.HSelect.add(fn);
    ptch.HSelect.add(fn);
    coch.HSelect.add(fn);
    camp.HSelect.add(fn);
    oran.HUnselect.add(ufn);
    grch.HUnselect.add(ufn);
    ptch.HUnselect.add(ufn);
    coch.HUnselect.add(ufn);
    camp.HUnselect.add(ufn);
    console.log(map);
    function fn(sh) { document.getElementById("info").innerHTML = sh.path.id; }
    function ufn(sh) { document.getElementById("info").innerHTML = "<br/>"; }
}
//# sourceMappingURL=index.js.map