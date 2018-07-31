/*! modernizr 3.6.0 (Custom Build) | MIT *
 * https://modernizr.com/download/?-pointerevents-touchevents !*/
!function(e,n,t){function o(e,n){return typeof e===n}function i(){var e,n,t,i,s,r,a;for(var d in f)if(f.hasOwnProperty(d)){if(e=[],n=f[d],n.name&&(e.push(n.name.toLowerCase()),n.options&&n.options.aliases&&n.options.aliases.length))for(t=0;t<n.options.aliases.length;t++)e.push(n.options.aliases[t].toLowerCase());for(i=o(n.fn,"function")?n.fn():n.fn,s=0;s<e.length;s++)r=e[s],a=r.split("."),1===a.length?Modernizr[a[0]]=i:(!Modernizr[a[0]]||Modernizr[a[0]]instanceof Boolean||(Modernizr[a[0]]=new Boolean(Modernizr[a[0]])),Modernizr[a[0]][a[1]]=i),l.push((i?"":"no-")+a.join("-"))}}function s(){return"function"!=typeof n.createElement?n.createElement(arguments[0]):p?n.createElementNS.call(n,"http://www.w3.org/2000/svg",arguments[0]):n.createElement.apply(n,arguments)}function r(){var e=n.body;return e||(e=s(p?"svg":"body"),e.fake=!0),e}function a(e,t,o,i){var a,f,d,l,u="modernizr",p=s("div"),v=r();if(parseInt(o,10))for(;o--;)d=s("div"),d.id=i?i[o]:u+(o+1),p.appendChild(d);return a=s("style"),a.type="text/css",a.id="s"+u,(v.fake?v:p).appendChild(a),v.appendChild(p),a.styleSheet?a.styleSheet.cssText=e:a.appendChild(n.createTextNode(e)),p.id=u,v.fake&&(v.style.background="",v.style.overflow="hidden",l=c.style.overflow,c.style.overflow="hidden",c.appendChild(v)),f=t(p,e),v.fake?(v.parentNode.removeChild(v),c.style.overflow=l,c.offsetHeight):p.parentNode.removeChild(p),!!f}var f=[],d={_version:"3.6.0",_config:{classPrefix:"",enableClasses:!0,enableJSClass:!0,usePrefixes:!0},_q:[],on:function(e,n){var t=this;setTimeout(function(){n(t[e])},0)},addTest:function(e,n,t){f.push({name:e,fn:n,options:t})},addAsyncTest:function(e){f.push({name:null,fn:e})}},Modernizr=function(){};Modernizr.prototype=d,Modernizr=new Modernizr;var l=[],u=d._config.usePrefixes?" -webkit- -moz- -o- -ms- ".split(" "):["",""];d._prefixes=u;var c=n.documentElement,p="svg"===c.nodeName.toLowerCase(),v=d.testStyles=a;Modernizr.addTest("touchevents",function(){var t;if("ontouchstart"in e||e.DocumentTouch&&n instanceof DocumentTouch)t=!0;else{var o=["@media (",u.join("touch-enabled),("),"heartz",")","{#modernizr{top:9px;position:absolute}}"].join("");v(o,function(e){t=9===e.offsetTop})}return t});var h=function(){function e(e,n){var i;return e?(n&&"string"!=typeof n||(n=s(n||"div")),e="on"+e,i=e in n,!i&&o&&(n.setAttribute||(n=s("div")),n.setAttribute(e,""),i="function"==typeof n[e],n[e]!==t&&(n[e]=t),n.removeAttribute(e)),i):!1}var o=!("onblur"in n.documentElement);return e}();d.hasEvent=h;var m="Moz O ms Webkit",y=d._config.usePrefixes?m.toLowerCase().split(" "):[];d._domPrefixes=y,Modernizr.addTest("pointerevents",function(){var e=!1,n=y.length;for(e=Modernizr.hasEvent("pointerdown");n--&&!e;)h(y[n]+"pointerdown")&&(e=!0);return e}),i(),delete d.addTest,delete d.addAsyncTest;for(var w=0;w<Modernizr._q.length;w++)Modernizr._q[w]();e.Modernizr=Modernizr}(window,document);