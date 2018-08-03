/// <reference path="svg-map.ts" />

declare interface Element
{
    vElement: any
}

module ImageMap
{
    /** @hidden */
    var _id = 0

    export function newId (): string
    {
        return "_id" + (++_id)
    }
}