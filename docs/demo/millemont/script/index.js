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
var map;
function init(obj) {
    map = new ImageMap.SvgMap(obj);
    map.HLoaded.add(function (map) {
        var camp = map.regions.get("camping");
        camp.infoPoint.offsetY(-100);
        function printSelected(map) {
            var e_1, _a;
            var ids = [];
            try {
                for (var _b = __values(map.getSelected()), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var r = _c.value;
                    ids.push(r.id);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            document.getElementById("info").innerHTML = ids.join(", ");
        }
        map.HSelectionChanged.add(printSelected);
        console.log(map);
    });
}
function toggleMobileView() {
    map.setMobileMode(event.target.checked);
}
toggleTabDemo(document.querySelector(".demo-tab-anchor"), 'tab-html-source');
function loadDefinition(url) {
    map.load(url);
}
//# sourceMappingURL=index.js.map