/// <reference path="map-2d.ts" />

function init (obj: HTMLObjectElement)
{
    var map = new MMMFest.Map2d (obj.contentDocument.querySelector ("svg"), { background: "#i_background" }),
        backgroundImage = obj.contentDocument.querySelector ("#i_background") as SVGImageElement
        
    map.addRegion ({ path: "#t_orangerie", image: backgroundImage, onSelect: fn, onUnselect: ufn, popupInfo: document.querySelector ("#p_orangerie") })
    map.addRegion ({ path: "#t_grchateau", image: backgroundImage, onSelect: fn, onUnselect: ufn, popupInfo: document.querySelector ("#p_grchateau") })
    map.addRegion ({ path: "#t_ptchateau", image: backgroundImage, onSelect: fn, onUnselect: ufn, popupInfo: document.querySelector ("#p_orangerie") })
    map.addRegion ({ path: "#t_cochets",   image: backgroundImage,   onSelect: fn, onUnselect: ufn, popupInfo: null })
    var camp = map.addRegion ({ path: "#t_camping",   image: backgroundImage,   onSelect: fn, onUnselect: ufn })
    camp.infoPoint.offsetY (-200)

    console.log (map)

    function fn (sh: MMMFest.Region2d)
    { document.getElementById ("info").innerHTML = sh.path.id }
        
    function ufn (sh: MMMFest.Region2d)
    { document.getElementById ("info").innerHTML = "<br/>" }
}

