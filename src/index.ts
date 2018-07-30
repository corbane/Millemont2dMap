/// <reference path="map-2d.ts" />

function initMillemontSVG (obj: HTMLObjectElement)
{
    var map = new MMMFest.Map2d (obj.contentDocument.querySelector ("svg"), { background: "#i_background" }),
        fn = (sh: MMMFest.Region2d) => {
            document.getElementById ("info").innerHTML = sh.image.id
        },
        ufn = (sh: MMMFest.Region2d) => {
            document.getElementById ("info").innerHTML = "<br/>"
        }
    
    map.addRegion ({ path: "#t_orangerie", image: "#i_orangerie", onSelect: fn, onUnselect: ufn, popupInfo: document.querySelector ("#p_orangerie") })
    map.addRegion ({ path: "#t_grchateau", image: "#i_grchateau", onSelect: fn, onUnselect: ufn, popupInfo: document.querySelector ("#p_orangerie") })
    map.addRegion ({ path: "#t_ptchateau", image: "#i_ptchateau", onSelect: fn, onUnselect: ufn, popupInfo: document.querySelector ("#p_orangerie") })
    map.addRegion ({ path: "#t_cochets",   image: "#i_cochets",   onSelect: fn, onUnselect: ufn, popupInfo: null })
    var camp = map.addRegion ({ path: "#t_camping",   image: "#i_camping",   onSelect: fn, onUnselect: ufn })
    camp.infoPoint.offsetY (-200)

    console.log (map)
}

