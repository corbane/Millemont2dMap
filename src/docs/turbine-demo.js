function initTurbineDemo(obj)
{
	var doc = obj.contentDocument,
		map = new ImageMap.Map2d(doc.querySelector("svg"), { background: "#background" }),
        backgroundImage = doc.querySelector("#background")
        
	var stat = map.addRegion("#stator")
	var roto = map.addRegion("#rotor")
	var shaf = map.addRegion("#shaft")
	var gate = map.addRegion("#gate")
    var blad = map.addRegion("#blades")
    
	//map.zoomTo (shaf.pathElement.getBBox (), 500)
	//map.zoomTo (blad.gElement.getBBox ())

	//map.addStylesheet ()
}
