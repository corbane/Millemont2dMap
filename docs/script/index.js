function toggleTabDemo(el, id)	
{	
    var i, x, tablinks,	
        parent = document.querySelector (".demo-source-tab-content"),	
        content = parent.getElementsByClassName(id)[0],	
        isOpen = content.style.display == "block"	
    	
	x = parent.getElementsByClassName("demo-source-tab")	
	for (i = 0; i < x.length; i++)	
        x[i].style.display = "none"	
        
 	tablinks = el.parentElement.getElementsByClassName("demo-tab-anchor")	
	for (i = 0; i < tablinks.length; i++)	
        tablinks[i].classList.remove ("border-amber")	
        
     if( !isOpen )	
    {	
        content.style.display = "block"	
        el.classList.add ("border-amber")	
    }	
}