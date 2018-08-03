/// <reference path="region-2d.ts" />
/// <reference path="svg-map.ts" />
/// <reference path="event.ts" />

module ImageMap
{
    export class RegionCollection implements Iterable <Region2d> // == <g id="regions"> ... </g>
    {
        protected registry: Region2d [] = []
   
        HRegionAdded = new Event.Handle <(region: Region2d) => void> ()
        HRegionRemoved = new Event.Handle <(region: Region2d) => void> ()
        
        constructor (protected map: SvgMap)
        { }

        add (def: Region2d.TDefinition|Region2d.TDefinition[]): Region2d
        {
            if( Array.isArray (def) )
            {
                for( var r of def )
                    this.add (r)
                return
            }
            
            var region = new Region2d (this.map, def)
            this.registry.push (region)

            // Initialize popup info

            var popup = document.querySelector (`[data-for="${region.id}"]`) as HTMLElement //TODO: make popup external
            if( popup )
                region.infoPoint.setPopup (popup)

            this.HRegionAdded.trigger (region)

            return region
        }

        has (region: Region2d): boolean
        { return !(this.indexOf (region) == -1) }

        indexOf (region: string|Region2d): number
        {
            if( typeof region == "string" )
                region = this.get (region)

            var i = 0
            for( var vel of this.registry )
            {
                if( vel === region ) return i
                ++i
            }
            return -1
        }

        get (id: string): Region2d
        {
            var el = this.map.root.getElementById (id)
            if( el )
                return el.parentElement.vElement as Region2d

            return null
        }

        remove (...regions: (string|Region2d) [])
        {
            for( var region of regions )
            {
                var i = this.indexOf (region)
                if( i == -1 ) continue

                var del = this.registry.splice (i, 1)

                this.HRegionRemoved.trigger (del[0])
            }
        }

        clear ()
        {
            this.remove (...this.registry)
            this.registry = []
        }
        
        [Symbol.iterator](): Iterator <Region2d>
        {
            var i = 0

            return {
                next: (): IteratorResult <Region2d> => 
                {
                    return i == this.registry.length
                        ? { done: true, value: undefined }
                        : { done: false, value: this.registry[i++] }
                }
            }
        }

        toArray (): Array <Region2d>
        {
            return Object.create (this.registry)
        }
    }
}