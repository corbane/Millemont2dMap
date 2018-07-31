module MMMFest.Event
{
    export class Handle <F extends (...args) => any>
    {
        private registers: F[] = []

        public add (callback: F): number
        {
            this.registers.push (callback)
            return this.registers.length - 1
        }

        public remove (idx: number)
        {
            if( idx < 0 || this.registers.length < idx + 1 )
                return
                
            this.registers.splice(idx, 1)
        }
        
        public trigger = <F> ((...args): any =>
        {
            for( var fn of this.registers )
                fn.apply (this, args)
        })
    }
}