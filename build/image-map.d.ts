declare module ImageMap {
    class InfoPoint {
        readonly doc: Document;
        readonly root: SVGSVGElement;
        readonly useElement: SVGUseElement;
        protected popup: HTMLElement;
        protected x: number;
        protected y: number;
        protected ox: number;
        protected oy: number;
        protected w: number;
        protected h: number;
        protected scale: number;
        constructor(doc: Document, el?: SVGElement);
        private symbol;
        protected getSymbolFrom(el: SVGElement): SVGSymbolElement;
        protected getStandardSymbol(): SVGSymbolElement;
        attachTo(el: SVGGraphicsElement, x: "left" | "center" | "right" | number, y: "top" | "center" | "bottom" | number): void;
        setPosition(x: number, y: number): void;
        offsetX(n: number): void;
        offsetY(n: number): void;
        setSize(width: number, height: number): void;
        setScale(n: number): void;
        protected updateSvg(): void;
        select(): void;
        unselect(): void;
        setPopup(popup: HTMLElement): void;
        showPopup(evt: MouseEvent): void;
        hidePopup(): void;
    }
}
declare module ImageMap.Event {
    class Handle<F extends (...args: any[]) => any> {
        private registers;
        add(callback: F): number;
        remove(idx: number): void;
        trigger: F;
        private enabled;
        disable(): void;
        enable(): void;
    }
}
declare module ImageMap {
    /**
     * A region is defined in the SVG file.
     *
     * The regions MUST have a unique id
     *
     * By default te regions is defined inside a `g` element with id equal to `"regions"`.
     * ~~You can change this query selector with [[SvgMap.Options.regionsSelector]]~~
     *
     * Example:
     * ```svg
     * <?xml version="1.0" encoding="UTF-8"?>
     * <!DOCTYPE svg ... >
     * <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.0">
     *     ... see SvgMap ...
     *     <g id="regions">
     *         <g id="id1">
     *             <path d=" ... ">
     *             <polygon points=" ... ">
     *         <g>
     *         <circle id="id2" .../>
     *     </g>
     * </svg>
     * ```
     */
    class Region2d {
        readonly map: SvgMap;
        readonly id: string;
        readonly HMouseOver: Event.Handle<(region: this, evt: MouseEvent) => void>;
        readonly HClick: Event.Handle<(region: this, evt: MouseEvent) => void>;
        readonly HSelect: Event.Handle<(region: this, evt: MouseEvent) => void>;
        readonly HUnselect: Event.Handle<(region: this, evt: MouseEvent) => void>;
        readonly HEnable: Event.Handle<(region: this) => void>;
        readonly HDisable: Event.Handle<(region: this) => void>;
        private readonly doc;
        constructor(map: SvgMap, contour: SVGGraphicsElement | string | Region2d.IJson);
        readonly gElement: SVGGElement;
        private initGlobalElement;
        private onMouseOver;
        readonly pathElement: SVGGraphicsElement;
        private initContourPath;
        readonly imageElement: SVGImageElement;
        private clipPath;
        private initClippedImage;
        readonly infoPoint: InfoPoint;
        private initInfoPoint;
        protected selected: boolean;
        private initSelection;
        isSelected(): boolean;
        select(): void;
        unselect(): void;
        private onClick;
        isEnabled(): boolean;
        enable(): void;
        disable(): void;
        updateDisplay(): void;
    }
    module Region2d {
        interface IJson {
            _id: string;
            _points: string;
            _class?: string;
        }
    }
}
declare module ImageMap {
    class RegionCollection implements Iterable<Region2d> {
        protected parent: SvgMap;
        protected registry: Region2d[];
        HRegionAdded: Event.Handle<(region: Region2d) => void>;
        HRegionRemoved: Event.Handle<(region: Region2d) => void>;
        constructor(parent: SvgMap);
        add(el: SVGGraphicsElement | string | Region2d.IJson | Region2d.IJson[]): Region2d;
        has(region: Region2d): boolean;
        indexOf(region: string | Region2d): number;
        get(id: string): Region2d;
        remove(...regions: (string | Region2d)[]): void;
        clear(): void;
        [Symbol.iterator](): Iterator<Region2d>;
        toArray(): Array<Region2d>;
    }
}
declare module ImageMap {
    /**
     * Use [mobile-detect.js](https://github.com/hgoebl/mobile-detect.js)
     */
    const isRunningOnMobile: boolean;
    /**
     * A `SvgMap` is defined in a SVG file and it's correspond to the `svg` tag element
     *
     * The `SvgMap` elements contain an `SVGImageElement` and a series of [[Region2d]] elements.
     *
     * This image define the maximum `viewBox` of the SVG, so it MUST define the `x`, `y`, `width`, `height` attributes.
     *
     * By default this image must have the id equal to `"background"`, ~~you can change the query selector with [[SvgMap.Options.backgroundSelector]]~~
     *
     * Example:
     * ```svg
     * <?xml version="1.0" encoding="UTF-8"?>
     * <!DOCTYPE svg [...] >
     * <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.0">
     *     <image id="background" width="600" height="600" x="0" y="0" xlink:href=" ... "/>
     *     ... see Region2d api ...
     * </svg>
     * ```
     */
    class SvgMap {
        readonly options: SvgMap.Options;
        readonly background: SVGImageElement;
        readonly container: HTMLObjectElement;
        readonly doc: Document;
        readonly root: SVGSVGElement;
        HLoaded: Event.Handle<(map: this) => void>;
        constructor(object: HTMLObjectElement);
        /** @hidden */
        getClientRectFor(el: string | SVGGraphicsElement): DOMRect;
        private initBackground;
        readonly regions: RegionCollection;
        private getRegionsDefinitions;
        private initRegions;
        private onRegionAdded;
        zoomTo(b: SVGRect, margin?: number): void;
        zoomAll(): void;
        private selectedSapes;
        HSelectionChanged: Event.Handle<(map: this) => void>;
        select(region: Region2d): void;
        unselect(region?: Region2d): void;
        getSelected(): Region2d[];
        private onRegionSelected;
        private onRegionUnelected;
        private onBackgroundClick;
        protected displayMode: "ghost" | "normal";
        /**
         * Use [mobile-detect.js](https://github.com/hgoebl/mobile-detect.js)
         */
        private mobileMode;
        setDisplayMode(mode: "ghost" | "normal"): void;
        /**
         * Active or desactive the mouse over event for mobile view.
         */
        setMobileMode(v?: boolean): void;
        updateDisplay(): void;
        private onOverRegion;
        private onOverBackground;
        filtersRegister: {
            [key: string]: string;
        };
        private defsElement;
        private initFilters;
    }
    module SvgMap {
        class Options {
            backgroundSelector: string;
            regionsSelector: string;
            infoPointSelector: string;
            filtersSelector: string;
        }
    }
}
declare interface Element {
    vElement: any;
}
declare module ImageMap {
    function newId(): string;
}
