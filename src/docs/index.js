
function toggleTabDemo(el, id)
{
    var i, x, tablinks,
        parent = el.parentElement,
        content = parent.getElementsByClassName(id)[0],
        isOpen = content.style.display == "block"
    
	x = parent.getElementsByClassName("demo-tab-content")
	for (i = 0; i < x.length; i++)
		x[i].style.display = "none"

	tablinks = parent.getElementsByClassName("demo-tab-anchor")
	for (i = 0; i < tablinks.length; i++)
		tablinks[i].classList.remove ("border-amber")

    if( !isOpen )
    {
        content.style.display = "block"
        el.classList.add ("border-amber")
    }
}
