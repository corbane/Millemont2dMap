
function initMillemontDemo (obj)
{
    var doc = obj.contentDocument,
        map = new ImageMap.Map2d (doc.querySelector ("svg"), { background: "#background" })
        
    var oran = map.addRegion ("#orangerie")
    var grch = map.addRegion ("#grchateau")
    var ptch = map.addRegion ("#ptchateau")
    var coch = map.addRegion ("#cochets")
    var camp = map.addRegion ("#camping")
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

    function fn (region)
    { document.getElementById ("info").innerHTML = region.id }
        
    function ufn (region)
    { document.getElementById ("info").innerHTML = "<br/>" }
}
