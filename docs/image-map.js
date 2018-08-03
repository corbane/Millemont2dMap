var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
/// <reference path="svg-map.ts" />
var ImageMap;
(function (ImageMap) {
    var InfoPoint = /** @class */ (function () {
        function InfoPoint(doc, definition) {
            if (definition === void 0) { definition = null; }
            this.doc = doc;
            this.popup = null;
            this.ox = 0;
            this.oy = 0;
            this.scale = 1;
            this.root = doc.querySelector("svg");
            if (definition)
                this.symbol = this.getSymbolFrom(definition);
            else
                this.symbol = this.getStandardSymbol();
            this.x = this.symbol.viewBox.baseVal.x;
            this.y = this.symbol.viewBox.baseVal.y;
            this.w = this.symbol.viewBox.baseVal.width;
            this.h = this.symbol.viewBox.baseVal.height;
            this.useElement = doc.createElementNS("http://www.w3.org/2000/svg", "use");
            this.useElement.setAttribute("href", "#" + this.symbol.id);
            this.useElement.addEventListener("mouseover", this.showPopup.bind(this));
            this.useElement.addEventListener("mouseout", this.hidePopup.bind(this));
            //this.updateSvg ()
        }
        InfoPoint.prototype.dispose = function () {
            if (this.useElement.parentNode)
                this.useElement.parentNode.removeChild(this.useElement);
            this.symbol.parentNode.removeChild(this.symbol);
        };
        InfoPoint.prototype.getSymbolFrom = function (definition) {
            var defs = this.root.querySelector("defs");
            if (!defs) {
                defs = this.doc.createElementNS("http://www.w3.org/2000/svg", "defs");
                this.root.appendChild(defs);
            }
            if (typeof definition == "string")
                definition = this.doc.querySelector(definition);
            if (definition.tagName.toLowerCase() == "symbol") {
                var s = definition.cloneNode(true);
            }
            else {
                var s = this.doc.createElementNS("http://www.w3.org/2000/svg", "symbol");
                s.appendChild(definition);
            }
            s.id = ImageMap.newId();
            defs.appendChild(s);
            return s;
        };
        InfoPoint.prototype.getStandardSymbol = function () {
            var defs = this.root.querySelector("defs");
            if (!defs) {
                defs = this.doc.createElementNS("http://www.w3.org/2000/svg", "defs");
                this.root.appendChild(defs);
            }
            var s = this.doc.createElementNS("http://www.w3.org/2000/svg", "symbol");
            s.id = ImageMap.newId();
            s.viewBox.baseVal.x = -50;
            s.viewBox.baseVal.y = -50;
            s.viewBox.baseVal.width = 100;
            s.viewBox.baseVal.height = 100;
            var c1 = this.doc.createElementNS("http://www.w3.org/2000/svg", "circle");
            c1.setAttribute("cx", "0");
            c1.setAttribute("cy", "0");
            c1.setAttribute("r", "40");
            c1.setAttribute("fill", "none");
            c1.setAttribute("stroke", "#FFD50055");
            c1.setAttribute("stroke-width", "5");
            var c2 = this.doc.createElementNS("http://www.w3.org/2000/svg", "circle");
            c2.setAttribute("cx", "0");
            c2.setAttribute("cy", "0");
            c2.setAttribute("r", "30");
            c2.setAttribute("fill", "#FFD50055");
            c2.setAttribute("stroke-width", "0");
            s.appendChild(c1);
            s.appendChild(c2);
            defs.appendChild(s);
            return s;
        };
        InfoPoint.prototype.attachTo = function (el, x, y) {
            var bbox = el.getBBox();
            if (x == "left")
                x = bbox.x;
            else if (x == "center")
                x = bbox.x + bbox.width / 2;
            else if (x == "right")
                x = bbox.x + bbox.width;
            if (y == "top")
                y = bbox.y;
            else if (y == "center")
                y = bbox.y + bbox.height / 2;
            else if (y == "bottom")
                y = bbox.y + bbox.height;
            this.setPosition(x, y);
            el.parentNode.appendChild(this.useElement);
        };
        //#region Transform
        InfoPoint.prototype.setPosition = function (x, y) {
            this.x = x + this.symbol.viewBox.baseVal.x;
            this.y = y + this.symbol.viewBox.baseVal.y;
            this.updateSvg();
        };
        InfoPoint.prototype.offsetX = function (n) {
            this.ox = n;
            this.updateSvg();
        };
        InfoPoint.prototype.offsetY = function (n) {
            this.oy = n;
            this.updateSvg();
        };
        InfoPoint.prototype.setSize = function (width, height) {
            this.w = width;
            this.h = height;
            this.updateSvg();
        };
        InfoPoint.prototype.setScale = function (n) {
            this.scale = n;
            this.updateSvg();
        };
        InfoPoint.prototype.updateSvg = function () {
            var w = this.w * this.scale;
            var h = this.h * this.scale;
            var x = this.x + (this.w - w) / 2;
            var y = this.y + (this.h - h) / 2;
            this.useElement.setAttribute("x", (x + this.ox).toString());
            this.useElement.setAttribute("y", (y + this.oy).toString());
            this.useElement.setAttribute("width", (w).toString());
            this.useElement.setAttribute("height", (h).toString());
        };
        //#endregion
        InfoPoint.prototype.select = function () {
            this.useElement.classList.add("selected");
        };
        InfoPoint.prototype.unselect = function () {
            this.useElement.classList.remove("selected");
        };
        //#region Popup
        InfoPoint.prototype.setPopup = function (popup) {
            if (popup)
                popup.classList.add("mmmfest", "map-popup");
            if (!ImageMap.isRunningOnMobile)
                this.popup = popup;
        };
        InfoPoint.prototype.showPopup = function (evt) {
            if (!this.popup)
                return;
            this.popup.style.display = "block";
            var b = this.useElement.getBoundingClientRect();
            //var bbox = this.map.getClientRectFor (this.svg)
            this.popup.style.left = (b.x + b.width) + "px";
            this.popup.style.top = (b.y + b.height) + 30 + "px";
        };
        InfoPoint.prototype.hidePopup = function () {
            if (!this.popup)
                return;
            this.popup.style.display = "none";
        };
        return InfoPoint;
    }());
    ImageMap.InfoPoint = InfoPoint;
})(ImageMap || (ImageMap = {}));
var ImageMap;
(function (ImageMap) {
    var Event;
    (function (Event) {
        var Handle = /** @class */ (function () {
            function Handle() {
                this.registers = [];
                this.trigger = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    var e_1, _a;
                    if (!this.enable)
                        return;
                    try {
                        for (var _b = __values(this.registers), _c = _b.next(); !_c.done; _c = _b.next()) {
                            var fn = _c.value;
                            fn.apply(this, arguments);
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                };
                this.enabled = true;
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
            Handle.prototype.disable = function () {
                this.enabled = false;
            };
            Handle.prototype.enable = function () {
                this.enabled = true;
            };
            return Handle;
        }());
        Event.Handle = Handle;
    })(Event = ImageMap.Event || (ImageMap.Event = {}));
})(ImageMap || (ImageMap = {}));
/// <reference path="svg-map.ts" />
/// <reference path="info-point.ts" />
/// <reference path="event.ts" />
var ImageMap;
(function (ImageMap) {
    /**
     * A region is defined in the SVG file.
     *
     * The regions MUST have a unique id
     *
     * By default te regions is defined inside a `g` element with id equal to `"regions"`.
     * ~~You can change this query selector with [[SvgMap.Options.regionsSelector]]~~
     *
     * Example:
     * ```svg
     * <?xml version="1.0" encoding="UTF-8"?>
     * <!DOCTYPE svg ... >
     * <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.0">
     *     ... see SvgMap ...
     *     <g id="regions">
     *         <g id="id1">
     *             <path d=" ... ">
     *             <polygon points=" ... ">
     *         <g>
     *         <circle id="id2" .../>
     *     </g>
     * </svg>
     * ```
     */
    var Region2d = /** @class */ (function () {
        function Region2d(map, def) {
            this.map = map;
            this.HMouseOver = new ImageMap.Event.Handle();
            this.HClick = new ImageMap.Event.Handle();
            this.HSelect = new ImageMap.Event.Handle();
            this.HUnselect = new ImageMap.Event.Handle();
            this.HEnable = new ImageMap.Event.Handle();
            this.HDisable = new ImageMap.Event.Handle();
            //#endregion
            //#region Selection
            this.selected = false;
            this.doc = map.doc;
            this.initGlobalElement();
            this.initContourPath(def);
            this.id = this.pathElement.id;
            this.initClippedImage();
            this.initInfoPoint();
            this.initSelection();
            this.updateDisplay();
        }
        Region2d.prototype.dispose = function () {
            this.gElement.parentNode.removeChild(this.gElement);
            if (this.infoPoint)
                this.infoPoint.dispose();
        };
        Region2d.prototype.initGlobalElement = function () {
            //@ts-ignore
            this.gElement = this.doc.createElementNS("http://www.w3.org/2000/svg", "g");
            this.gElement.classList.add("region2d");
            this.gElement.vElement = this;
            this.gElement.addEventListener("mouseover", this.onMouseOver.bind(this));
            this.map.root.appendChild(this.gElement);
        };
        Region2d.prototype.onMouseOver = function (evt) {
            this.HMouseOver.trigger(this, evt);
        };
        Region2d.prototype.initContourPath = function (def) {
            if (typeof def == "string")
                //@ts-ignore
                this.pathElement = this.doc.querySelector(def);
            else if (def instanceof SVGGraphicsElement)
                //@ts-ignore
                this.pathElement = def;
            else {
                //@ts-ignore
                this.pathElement = this.createRegionElement(def);
                this.gElement.appendChild(this.pathElement);
            }
            this.pathElement.classList.add("path");
            this.gElement.appendChild(this.pathElement);
        };
        Region2d.prototype.createRegionElement = function (def) {
            if (def.polygon) {
                var poly = this.doc.createElementNS("http://www.w3.org/2000/svg", "polygon");
                poly.id = def.id;
                poly.setAttribute("class", def["class"] || "");
                poly.setAttribute("points", def.polygon);
                return poly;
            }
            else if (def.path) {
                var path = this.doc.createElementNS("http://www.w3.org/2000/svg", "path");
                path.id = def.id;
                path.setAttribute("class", def["class"] || "");
                path.setAttribute("d", def.path);
                return path;
            }
            throw "Unable to read region definition";
        };
        Region2d.prototype.initClippedImage = function () {
            var e_2, _a;
            var clipid = "clip-" + this.pathElement.id; //!!!!!!!!!!
            //@ts-ignore
            this.imageElement = this.map.background.cloneNode(true);
            this.imageElement.setAttribute("class", "image");
            this.imageElement.setAttribute("clip-path", "url(#" + clipid + ")");
            this.clipPath = this.doc.createElementNS("http://www.w3.org/2000/svg", "clipPath");
            this.clipPath.id = clipid;
            var p;
            switch (this.pathElement.tagName) {
                case "polygon":
                case "polyline":
                    p = this.doc.createElementNS("http://www.w3.org/2000/svg", "polyline");
                    p.setAttributeNS(null, "points", this.pathElement.getAttributeNS(null, "points"));
                    this.clipPath.appendChild(p);
                    break;
                case "g":
                    try {
                        //@ts-ignore
                        for (var _b = __values(this.pathElement.children), _c = _b.next(); !_c.done; _c = _b.next()) {
                            var e = _c.value;
                            this.clipPath.appendChild(e.cloneNode(true));
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                    break;
                default:
                    throw "Not implemented";
            }
            this.gElement.appendChild(this.clipPath);
            this.gElement.appendChild(this.imageElement);
        };
        Region2d.prototype.initInfoPoint = function () {
            var s = this.doc.querySelector("defs > symbol#info-point");
            //@ts-ignore
            this.infoPoint = new ImageMap.InfoPoint(this.doc, s);
            this.infoPoint.attachTo(this.pathElement, "center", "center");
            if (s) {
                var scale = parseFloat(s.getAttribute("data-scale"));
                if (scale)
                    this.infoPoint.setScale(scale);
            }
        };
        Region2d.prototype.initSelection = function () {
            this.gElement.addEventListener("click", this.onClick.bind(this));
        };
        Region2d.prototype.isSelected = function () {
            return this.selected;
        };
        Region2d.prototype.select = function () {
            if (!this.selected)
                this.onClick({ ctrlKey: false, shiftKey: false });
        };
        Region2d.prototype.unselect = function () {
            if (this.selected)
                this.onClick({ ctrlKey: false, shiftKey: false });
        };
        Region2d.prototype.onClick = function (evt) {
            this.HClick.trigger(this, evt);
            if (this.selected) {
                this.selected = false;
                this.updateDisplay();
                this.HUnselect.trigger(this, evt);
            }
            else {
                this.selected = true;
                this.updateDisplay();
                this.HSelect.trigger(this, evt);
            }
        };
        //#endregion
        //#region Activation
        Region2d.prototype.isEnabled = function () {
            return !this.gElement.classList.contains("disabled");
        };
        Region2d.prototype.enable = function () {
            this.gElement.classList.remove("disabled");
            this.HEnable.trigger(this);
        };
        Region2d.prototype.disable = function () {
            this.gElement.classList.add("disabled");
            this.HDisable.trigger(this);
        };
        //#endregion
        //#region display
        Region2d.prototype.updateDisplay = function () {
            if (this.selected) {
                this.gElement.classList.add("selected");
                this.infoPoint.select();
            }
            else {
                this.gElement.classList.remove("selected");
                this.infoPoint.unselect();
            }
            if (this.isEnabled)
                this.gElement.classList.remove("disabled");
            else
                this.gElement.classList.add("disabled");
        };
        return Region2d;
    }());
    ImageMap.Region2d = Region2d;
})(ImageMap || (ImageMap = {}));
/// <reference path="region-2d.ts" />
/// <reference path="svg-map.ts" />
/// <reference path="event.ts" />
var ImageMap;
(function (ImageMap) {
    var RegionCollection = /** @class */ (function () {
        function RegionCollection(map) {
            this.map = map;
            this.registry = [];
            this.HRegionAdded = new ImageMap.Event.Handle();
            this.HRegionRemoved = new ImageMap.Event.Handle();
        }
        RegionCollection.prototype.add = function (def) {
            var e_3, _a;
            if (Array.isArray(def)) {
                try {
                    for (var def_1 = __values(def), def_1_1 = def_1.next(); !def_1_1.done; def_1_1 = def_1.next()) {
                        var r = def_1_1.value;
                        this.add(r);
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (def_1_1 && !def_1_1.done && (_a = def_1["return"])) _a.call(def_1);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
                return;
            }
            var region = new ImageMap.Region2d(this.map, def);
            this.registry.push(region);
            // Initialize popup info
            var popup = document.querySelector("[data-for=\"" + region.id + "\"]"); //TODO: make popup external
            if (popup)
                region.infoPoint.setPopup(popup);
            this.HRegionAdded.trigger(region);
            return region;
        };
        RegionCollection.prototype.has = function (region) { return !(this.indexOf(region) == -1); };
        RegionCollection.prototype.indexOf = function (region) {
            var e_4, _a;
            if (typeof region == "string")
                region = this.get(region);
            var i = 0;
            try {
                for (var _b = __values(this.registry), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var vel = _c.value;
                    if (vel === region)
                        return i;
                    ++i;
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
                }
                finally { if (e_4) throw e_4.error; }
            }
            return -1;
        };
        RegionCollection.prototype.get = function (id) {
            var el = this.map.root.getElementById(id);
            if (el)
                return el.parentElement.vElement;
            return null;
        };
        RegionCollection.prototype.remove = function () {
            var regions = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                regions[_i] = arguments[_i];
            }
            var e_5, _a;
            try {
                for (var regions_1 = __values(regions), regions_1_1 = regions_1.next(); !regions_1_1.done; regions_1_1 = regions_1.next()) {
                    var region = regions_1_1.value;
                    var i = this.indexOf(region);
                    if (i == -1)
                        continue;
                    var del = this.registry.splice(i, 1);
                    this.HRegionRemoved.trigger(del[0]);
                    del[0].dispose();
                }
            }
            catch (e_5_1) { e_5 = { error: e_5_1 }; }
            finally {
                try {
                    if (regions_1_1 && !regions_1_1.done && (_a = regions_1["return"])) _a.call(regions_1);
                }
                finally { if (e_5) throw e_5.error; }
            }
        };
        RegionCollection.prototype.clear = function () {
            this.remove.apply(this, __spread(this.registry));
            this.registry = [];
        };
        RegionCollection.prototype[Symbol.iterator] = function () {
            var _this = this;
            var i = 0;
            return {
                next: function () {
                    return i == _this.registry.length
                        ? { done: true, value: undefined }
                        : { done: false, value: _this.registry[i++] };
                }
            };
        };
        RegionCollection.prototype.toArray = function () {
            return Object.create(this.registry);
        };
        return RegionCollection;
    }());
    ImageMap.RegionCollection = RegionCollection;
})(ImageMap || (ImageMap = {}));
/// <reference path="region-2d.ts" />
/// <reference path="event.ts" />
/// <reference path="region-collection.ts" />
var ImageMap;
(function (ImageMap) {
    /**
     * Use [mobile-detect.js](https://github.com/hgoebl/mobile-detect.js)
     */
    ImageMap.isRunningOnMobile = new MobileDetect(navigator.userAgent).mobile();
    /**
     * A `SvgMap` is defined in a SVG file and it's correspond to the `svg` tag element
     *
     * The `SvgMap` elements contain an `SVGImageElement` and a series of [[Region2d]] elements.
     *
     * This image define the maximum `viewBox` of the SVG, so it MUST define the `x`, `y`, `width`, `height` attributes.
     *
     * By default this image must have the id equal to `"background"`, ~~you can change the query selector with [[SvgMap.Options.backgroundSelector]]~~
     *
     * Example:
     * ```svg
     * <?xml version="1.0" encoding="UTF-8"?>
     * <!DOCTYPE svg [...] >
     * <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.0">
     *     <image id="background" width="600" height="600" x="0" y="0" xlink:href=" ... "/>
     *     ... see Region2d api ...
     * </svg>
     * ```
     */
    var SvgMap = /** @class */ (function () {
        function SvgMap(object) {
            var _this = this;
            this.options = new SvgMap.Options();
            // TODO:
            // HRegionSelected
            // HRegionUnselected
            // HRegionEnabled
            // HRegionDisabled
            this.HLoaded = new ImageMap.Event.Handle();
            //#endregion
            //#region Regions
            this.regions = new ImageMap.RegionCollection(this);
            //#endregion
            //#region Selection
            this.selectedSapes = [];
            this.HSelectionChanged = new ImageMap.Event.Handle();
            //#endregion
            //#region Display
            this.displayMode = "normal";
            /**
             * Use [mobile-detect.js](https://github.com/hgoebl/mobile-detect.js)
             */
            this.mobileMode = ImageMap.isRunningOnMobile;
            //#endregion
            //#region Filters
            this.filtersRegister = {};
            if (object.tagName.toLowerCase() != "object")
                throw "The container object MUST be an `<object/>` element :(";
            this.container = object;
            this.container.style.padding = "0";
            this.doc = object.contentDocument;
            this.root = this.doc.querySelector("svg");
            this.root.classList.add("image-map");
            this.root.setAttribute("width", "100%");
            this.root.setAttribute("height", "100%");
            this.loadDefinitions(object.getAttribute("data-url"))
                .then(function (def) {
                _this.initBackground(def.background);
                _this.initRegions(def.regions);
                _this.zoomToAll();
                _this.initFilters();
                _this.HLoaded.trigger(_this);
            });
        }
        SvgMap.prototype.load = function (url) {
            var _this = this;
            this.regions.clear();
            this.loadDefinitions(url).then(function (defs) {
                _this.initRegions(defs.regions);
            });
        };
        SvgMap.prototype.loadDefinitions = function (url) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!url) return [3 /*break*/, 2];
                            return [4 /*yield*/, fetch(url).then(function (rep) {
                                    return rep.json();
                                })];
                        case 1: return [2 /*return*/, _a.sent()];
                        case 2: return [2 /*return*/, {}];
                    }
                });
            });
        };
        //#region Background
        SvgMap.prototype.initBackground = function (def) {
            if (def) {
                //@ts-ignore
                this.background = this.createBackgroundElement(def);
                if (this.root.firstChild)
                    this.root.insertBefore(this.root.firstChild, this.background);
                else
                    this.root.appendChild(this.background);
            }
            else {
                //@ts-ignore
                this.background = this.container.hasAttribute("data-background")
                    ? this.doc.querySelector(this.container.getAttribute("data-background"))
                    : this.doc.querySelector(this.options.backgroundSelector);
            }
            if (!this.background)
                throw "Can not find the background element";
            this.background.classList.add("background");
            this.background.onclick = this.onBackgroundClick.bind(this);
        };
        SvgMap.prototype.createBackgroundElement = function (def) {
            var img = this.doc.createElementNS("http://www.w3.org/2000/svg", "image");
            img.setAttributeNS("http://www.w3.org/1999/xlink", "href", def.href);
            img.id = def.id || "background";
            img.setAttribute("x", def.x.toString());
            img.setAttribute("y", def.y.toString());
            img.setAttribute("width", def.width.toString());
            img.setAttribute("height", def.height.toString());
            return img;
        };
        SvgMap.prototype.initRegions = function (defs) {
            var e_6, _a, e_7, _b;
            this.regions.HRegionAdded.add(this.onRegionAdded.bind(this));
            if (defs) {
                try {
                    for (var defs_1 = __values(defs), defs_1_1 = defs_1.next(); !defs_1_1.done; defs_1_1 = defs_1.next()) {
                        var el = defs_1_1.value;
                        this.regions.add(el);
                    }
                }
                catch (e_6_1) { e_6 = { error: e_6_1 }; }
                finally {
                    try {
                        if (defs_1_1 && !defs_1_1.done && (_a = defs_1["return"])) _a.call(defs_1);
                    }
                    finally { if (e_6) throw e_6.error; }
                }
            }
            else {
                var els = this.container.hasAttribute("data-regions-selector")
                    ? this.doc.querySelectorAll(this.container.getAttribute("data-regions-selector"))
                    : this.doc.querySelectorAll(this.options.regionsSelector);
                try {
                    //@ts-ignore
                    for (var els_1 = __values(els), els_1_1 = els_1.next(); !els_1_1.done; els_1_1 = els_1.next()) {
                        var el = els_1_1.value;
                        this.regions.add(el);
                    }
                }
                catch (e_7_1) { e_7 = { error: e_7_1 }; }
                finally {
                    try {
                        if (els_1_1 && !els_1_1.done && (_b = els_1["return"])) _b.call(els_1);
                    }
                    finally { if (e_7) throw e_7.error; }
                }
            }
        };
        SvgMap.prototype.onRegionAdded = function (region) {
            region.HSelect.add(this.onRegionSelected.bind(this));
            region.HUnselect.add(this.onRegionUnelected.bind(this));
            region.HMouseOver.add(this.onOverRegion.bind(this));
            this.updateDisplay();
        };
        //#endregion
        //#region Zoom
        SvgMap.prototype.zoomTo = function (b, margin) {
            if (margin === void 0) { margin = 0; }
            this.root.viewBox.baseVal.x = b.x - margin;
            this.root.viewBox.baseVal.y = b.y - margin;
            this.root.viewBox.baseVal.width = b.width + margin * 2;
            this.root.viewBox.baseVal.height = b.height + margin * 2;
        };
        SvgMap.prototype.zoomToAll = function () {
            this.zoomTo(this.background.getBBox());
        };
        SvgMap.prototype.select = function (region) {
            region.select();
        };
        SvgMap.prototype.unselect = function (region) {
            if (region === void 0) { region = null; }
            if (region)
                region.unselect();
            else {
                while (this.selectedSapes.length)
                    (this.selectedSapes.splice(0, 1))[0].unselect();
            }
        };
        SvgMap.prototype.getSelected = function () {
            return this.selectedSapes.slice(0);
        };
        SvgMap.prototype.onRegionSelected = function (region, evt) {
            if (!(evt.shiftKey || evt.ctrlKey)) {
                while (this.selectedSapes.length) {
                    var r = (this.selectedSapes.splice(0, 1))[0];
                    if (r != region)
                        r.unselect();
                }
            }
            this.selectedSapes.push(region);
            this.updateDisplay();
            this.HSelectionChanged.trigger(this);
        };
        SvgMap.prototype.onRegionUnelected = function (region, evt) {
            var i = this.selectedSapes.indexOf(region);
            if (i == -1)
                return;
            this.selectedSapes.splice(i, 1);
            if (!(evt.shiftKey || evt.ctrlKey)) {
                while (this.selectedSapes.length)
                    (this.selectedSapes.splice(0, 1))[0].unselect();
            }
            this.updateDisplay();
            this.HSelectionChanged.trigger(this);
        };
        SvgMap.prototype.onBackgroundClick = function (evt) {
            if (evt.target != this.background)
                return;
            while (this.selectedSapes.length)
                (this.selectedSapes.splice(0, 1))[0].unselect();
            this.updateDisplay();
            this.HSelectionChanged.trigger(this);
        };
        SvgMap.prototype.setDisplayMode = function (mode) {
            if (this.displayMode == mode)
                return;
            this.displayMode = mode;
            this.root.classList.remove("normal-view");
            this.root.classList.remove("ghost-view");
            if (mode == "ghost")
                this.root.classList.add("ghost-view");
            else
                this.root.classList.add("normal-view");
            this.updateDisplay();
        };
        /**
         * Active or desactive the mouse over event for mobile view.
         */
        SvgMap.prototype.setMobileMode = function (v) {
            if (v === void 0) { v = true; }
            this.mobileMode = v;
            this.updateDisplay();
        };
        SvgMap.prototype.updateDisplay = function () {
            var e_8, _a, e_9, _b, e_10, _c;
            if (this.mobileMode) {
                if (this.selectedSapes.length)
                    this.setDisplayMode("ghost");
                else
                    this.setDisplayMode("normal");
            }
            if (this.displayMode == "ghost") {
                try {
                    for (var _d = __values(this.regions), _e = _d.next(); !_e.done; _e = _d.next()) {
                        var s = _e.value;
                        s.disable();
                    }
                }
                catch (e_8_1) { e_8 = { error: e_8_1 }; }
                finally {
                    try {
                        if (_e && !_e.done && (_a = _d["return"])) _a.call(_d);
                    }
                    finally { if (e_8) throw e_8.error; }
                }
                try {
                    for (var _f = __values(this.selectedSapes), _g = _f.next(); !_g.done; _g = _f.next()) {
                        var r = _g.value;
                        r.enable();
                    }
                }
                catch (e_9_1) { e_9 = { error: e_9_1 }; }
                finally {
                    try {
                        if (_g && !_g.done && (_b = _f["return"])) _b.call(_f);
                    }
                    finally { if (e_9) throw e_9.error; }
                }
            }
            else //"normal"
             {
                try {
                    for (var _h = __values(this.regions), _j = _h.next(); !_j.done; _j = _h.next()) {
                        var s = _j.value;
                        s.disable();
                    }
                }
                catch (e_10_1) { e_10 = { error: e_10_1 }; }
                finally {
                    try {
                        if (_j && !_j.done && (_c = _h["return"])) _c.call(_h);
                    }
                    finally { if (e_10) throw e_10.error; }
                }
            }
        };
        SvgMap.prototype.onOverRegion = function (region, evt) {
            if (this.mobileMode)
                return;
            this.background.onmouseover = this.onOverBackground.bind(this);
            this.setDisplayMode("ghost");
        };
        SvgMap.prototype.onOverBackground = function (region, evt) {
            if (this.mobileMode)
                return;
            this.background.onmouseover = null;
            this.setDisplayMode("normal");
        };
        SvgMap.prototype.initFilters = function () {
            var e_11, _a;
            var defs = this.root.querySelector("defs");
            if (!defs) {
                defs = this.doc.createElementNS("http://www.w3.org/2000/svg", "defs");
                this.root.appendChild(defs);
            }
            this.defsElement = defs;
            var filters = this.doc.querySelectorAll(this.options.filtersSelector);
            try {
                //@ts-ignore
                for (var filters_1 = __values(filters), filters_1_1 = filters_1.next(); !filters_1_1.done; filters_1_1 = filters_1.next()) {
                    var f = filters_1_1.value;
                    if (!f.id)
                        continue;
                    //this.addFilter (f.id, f.innerHTML)
                }
            }
            catch (e_11_1) { e_11 = { error: e_11_1 }; }
            finally {
                try {
                    if (filters_1_1 && !filters_1_1.done && (_a = filters_1["return"])) _a.call(filters_1);
                }
                finally { if (e_11) throw e_11.error; }
            }
        };
        return SvgMap;
    }());
    ImageMap.SvgMap = SvgMap;
    (function (SvgMap) {
        var Options = /** @class */ (function () {
            function Options() {
                this.backgroundSelector = "#background";
                this.regionsSelector = "g#regions > *";
                this.infoPointSelector = "g#info-points > *";
                this.filtersSelector = "defs > filter";
                //background : selector|element
                //regions: selector|elements
            }
            return Options;
        }());
        SvgMap.Options = Options;
    })(SvgMap = ImageMap.SvgMap || (ImageMap.SvgMap = {}));
})(ImageMap || (ImageMap = {}));
/// <reference path="svg-map.ts" />
var ImageMap;
(function (ImageMap) {
    /** @hidden */
    var _id = 0;
    function newId() {
        return "_id" + (++_id);
    }
    ImageMap.newId = newId;
})(ImageMap || (ImageMap = {}));
// <reference path="vendor/mobile-detect.js" />
/// <reference path="image-map.ts" />
//# sourceMappingURL=image-map.js.map