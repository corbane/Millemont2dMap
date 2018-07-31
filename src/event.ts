module MMMFest.Event
{
    export class Handle <F extends (...args) => any>
    {
        private registers: F[] = []

        public add (callback: F)
        {
            this.registers.push (callback)
        }

        public remove (callback: F)
        {
            var cb: Function
            for (var i = 0 ; cb = this.registers[i] ; ++i)
                if( cb == callback )
                {
                    this.registers.splice(i--, 1)
                    return
                }
        }
        
        public trigger = <F> ((...args): any =>
        {
            for( var fn of this.registers )
                fn.apply (this, args)
        })
    }
}