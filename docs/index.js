function initMillemontSVG(obj) {
    console.log(new Millemont.clicable2dMap(obj));
}
var Millemont;
(function (Millemont) {
    var Shape = /** @class */ (function () {
        function Shape(path, image) {
            this.path = path;
            this.image = image;
        }
        return Shape;
    }());
    Millemont.Shape = Shape;
    var clicable2dMap = /** @class */ (function () {
        function clicable2dMap(el) {
            this.el = el;
            this.currentShape = null;
            var doc = el.contentDocument;
            this.shapes = {
                orangerie: new Shape(doc.querySelector("#t_orangerie"), doc.querySelector("#i_orangerie")),
                grandChateau: new Shape(doc.querySelector("#t_grchateau"), doc.querySelector("#i_grchateau")),
                petitChateau: new Shape(doc.querySelector("#t_ptchateau"), doc.querySelector("#i_ptchateau")),
                camping: new Shape(doc.querySelector("#t_camping"), doc.querySelector("#i_camping")),
                courDesCochets: new Shape(doc.querySelector("#t_cochets"), doc.querySelector("#i_cochets"))
            };
            for (var name in this.shapes)
                this.initShape(this.shapes[name]);
            this.background = doc.querySelector("#i_background");
            this.initBackground();
        }
        clicable2dMap.prototype.onMouseOver = function (sh) {
            this.currentShape = sh;
            this.hideAllOther(sh);
            this.background.addEventListener("mousemove", this.onMouseMove.bind(this, sh));
        };
        clicable2dMap.prototype.onMouseMove = function (sh) {
            if (!this.currentShape)
                return;
            this.currentShape = null;
            this.hideAll();
        };
        clicable2dMap.prototype.hideAllOther = function (sh) {
            for (var name in this.shapes)
                this.hide(this.shapes[name]);
            this.show(sh);
            this.background.style.opacity = "0.5";
        };
        clicable2dMap.prototype.hideAll = function () {
            for (var name in this.shapes)
                this.hide(this.shapes[name]);
            this.background.style.opacity = "1";
        };
        clicable2dMap.prototype.initShape = function (sh) {
            sh.path.style.strokeWidth = "15";
            //path.style.transition = "all 0.25s"
            sh.path.style.strokeWidth = "0";
            sh.image.style.transition = "all 0.25s";
            sh.image.addEventListener("mouseover", this.onMouseOver.bind(this, sh));
        };
        clicable2dMap.prototype.initBackground = function () {
            this.background.style.opacity = "1";
            this.background.style.transition = "all 0.25s";
        };
        clicable2dMap.prototype.hide = function (sh) {
            //sh.path.style.fill = ""
            //sh.path.style.fillOpacity = ""
            sh.path.style.strokeWidth = "0";
            sh.image.style.opacity = "0";
        };
        clicable2dMap.prototype.show = function (sh) {
            //sh.path.style.fill = "#FFD500"
            //sh.path.style.fillOpacity = "0.5"
            sh.path.style.strokeWidth = "";
            sh.image.style.opacity = "1";
        };
        return clicable2dMap;
    }());
    Millemont.clicable2dMap = clicable2dMap;
})(Millemont || (Millemont = {}));
//# sourceMappingURL=index.js.map