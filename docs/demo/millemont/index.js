
var map

function init (obj)
{
    map = new ImageMap.SvgMap (obj)
    map.HLoaded.add (map =>
    {
        var camp = map.regions.get ("camping")
        camp.infoPoint.offsetY (-100)

        function printSelected (map)
        {
            var ids = []
            for( var r of map.getSelected () )
                ids.push (r.id)

            document.getElementById ("info").innerHTML = ids.join (", ")
        }

        map.HSelectionChanged.add (printSelected)
        
        console.log (map)        
    })
}

function toggleMobileView ()
{
    map.setMobileMode (event.target.checked)
}

toggleTabDemo (document.querySelector (".demo-tab-anchor"), 'tab-html-source');