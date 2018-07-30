/// <reference path="map-2d.ts" />

function initMillemontSVG (obj: HTMLObjectElement)
{
    var map = new MMMFest.Map2d (obj)

    var fn = (sh: MMMFest.Region2d) => {
        document.getElementById ("info").innerHTML = sh.image.id
    }
    map.shapes.camping.onSelect        = fn
    map.shapes.courDesCochets.onSelect = fn
    map.shapes.grandChateau.onSelect   = fn
    map.shapes.orangerie.onSelect      = fn
    map.shapes.petitChateau.onSelect   = fn

    var ufn = (sh: MMMFest.Region2d) => {
        document.getElementById ("info").innerHTML = "<br/>"
    }
    map.shapes.camping.onUnselect        = ufn
    map.shapes.courDesCochets.onUnselect = ufn
    map.shapes.grandChateau.onUnselect   = ufn
    map.shapes.orangerie.onUnselect      = ufn
    map.shapes.petitChateau.onUnselect   = ufn

    map.shapes.camping.infoPoint.setPopup        (document.querySelector ("#p_orangerie"))
    map.shapes.courDesCochets.infoPoint.setPopup (null)
    map.shapes.grandChateau.infoPoint.setPopup   (document.querySelector ("#p_grchateau"))
    //map.shapes.orangerie.infoPoint.setPopup      ...
    map.shapes.petitChateau.infoPoint.setPopup   (document.querySelector ("#p_orangerie"))

    map.shapes.camping.infoPoint.offsetY (-200)

    console.log (map)
}

