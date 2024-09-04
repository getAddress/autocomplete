import AttributeValues from "./AttributeValues";
export default class List {
    readonly attributeValues: AttributeValues;
    readonly handleMouseEnter: ((event: any) => void);
    readonly handleClick: ((event: any) => void);
    private readonly list;
    element: HTMLElement;
    constructor(attributeValues: AttributeValues, handleMouseEnter: ((event: any) => void), handleClick: ((event: any) => void));
    private build;
    destroy(): void;
    clear: () => void;
    removeShowAllClassNames: () => void;
    addShowAllClassNames: () => void;
}
