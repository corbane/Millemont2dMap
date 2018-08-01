function initTurbineDemo(obj)
{
	var doc = obj.contentDocument,
		map = new ImageMap.Map2d(doc.querySelector("svg"), { background: "#background" })

	map.addFilter (
		"blur-filter",
		`<feConvolveMatrix
			bias="0.10000000000000001"
			result="result0"
			preserveAlpha="true"
			targetY="1"
			targetX="1"
			divisor="0.01"
			in="SourceGraphic"
			kernelMatrix="1 1 1 1 -8 1 1 1 1"
			order="3 3"
			id="feConvolveMatrix1188"/>
		<feColorMatrix
			values="-0.15 -0.3 -0.05 0 1 -0.15 -0.3 -0.05 0 1 -0.15 -0.3 -0.05 0 1 0 0 0 1 0"
			result="result3"/>`
	)

	//var stat = map.addRegion("#stator")
	//var roto = map.addRegion("#rotor")
	//var shaf = map.addRegion("#shaft")
	//var gate = map.addRegion("#gate")
    //var blad = map.addRegion("#blades")
    
	//map.zoomTo (shaf.pathElement.getBBox (), 500)
	//map.zoomTo (blad.gElement.getBBox ())

	//map.addStylesheet ()
}
