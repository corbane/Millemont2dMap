/// <reference path="map-2d.ts" />

function init (obj: HTMLObjectElement)
{
    var map = new MMMFest.Map2d (obj.contentDocument.querySelector ("svg"), { background: "#i_background" }),
        backgroundImage = obj.contentDocument.querySelector ("#i_background") as SVGImageElement
        
    var oran = map.addRegion ({ path: "#t_orangerie", image: backgroundImage, /*onSelect: fn, onUnselect: ufn,*/ popupInfo: document.querySelector ("#p_orangerie") })
    var grch = map.addRegion ({ path: "#t_grchateau", image: backgroundImage, /*onSelect: fn, onUnselect: ufn,*/ popupInfo: document.querySelector ("#p_grchateau") })
    var ptch = map.addRegion ({ path: "#t_ptchateau", image: backgroundImage, /*onSelect: fn, onUnselect: ufn,*/ popupInfo: document.querySelector ("#p_orangerie") })
    var coch = map.addRegion ({ path: "#t_cochets",   image: backgroundImage, /*onSelect: fn, onUnselect: ufn,*/ popupInfo: null })
    var camp = map.addRegion ({ path: "#t_camping",   image: backgroundImage, /*onSelect: fn, onUnselect: ufn*/ })
    camp.infoPoint.offsetY (-200)

    oran.HSelect.add (fn)
    grch.HSelect.add (fn)
    ptch.HSelect.add (fn)
    coch.HSelect.add (fn)
    camp.HSelect.add (fn)

    oran.HUnselect.add (ufn)
    grch.HUnselect.add (ufn)
    ptch.HUnselect.add (ufn)
    coch.HUnselect.add (ufn)
    camp.HUnselect.add (ufn)

    console.log (map)

    function fn (sh: MMMFest.Region2d)
    { document.getElementById ("info").innerHTML = sh.path.id }
        
    function ufn (sh: MMMFest.Region2d)
    { document.getElementById ("info").innerHTML = "<br/>" }
}

