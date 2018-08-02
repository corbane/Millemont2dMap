
var map

function init (obj)
{
    map = new ImageMap.SvgMap (obj.contentDocument.querySelector("svg"))

    map.addFilter (
        "blur-filter",
        `<feGaussianBlur in="SourceGraphic" stdDeviation="9" />`
    )
    
    var camp = map.regions.get ("camping")
    camp.infoPoint.offsetY (-100)

    function printSelected (region)
    {
        var ids = []
        for( var r of region.map.getSelected () )
            ids.push (r.id)

        document.getElementById ("info").innerHTML = ids.join (", ")
    }

    for( var region of map.regions )
    {
        region.hSelect.add (printSelected)
        region.hUnselect.add (printSelected)
    }
    
    console.log (map)
}

function toggleMobileView ()
{
    map.setMobileMode (event.target.checked)
}