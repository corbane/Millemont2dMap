module ImageMap.Event
{
    export class Handle <F extends (...args) => any>
    {
        private registers: F[] = []

        add (callback: F): number
        {
            this.registers.push (callback)
            return this.registers.length - 1
        }

        remove (idx: number)
        {
            if( idx < 0 || this.registers.length < idx + 1 )
                return

            this.registers.splice(idx, 1)
        }
        
        trigger = <F> function (...args): any
        {
            if( !this.enable )
                return
                
            for( var fn of this.registers )
                fn.apply (this, arguments)
        }

        private enabled = true

        disable ()
        {
            this.enabled = false
        }

        enable ()
        {
            this.enabled = true
        }
    }
}