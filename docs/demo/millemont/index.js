
var map

function init (obj)
{
    map = new ImageMap.SvgMap (obj)
    map.HLoaded.add (map =>
    {
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
            region.HSelect.add (printSelected)
            region.HUnselect.add (printSelected)
        }
        
        console.log (map)        
    })
    

}

function toggleMobileView ()
{
    map.setMobileMode (event.target.checked)
}