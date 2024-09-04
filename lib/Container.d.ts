import AttributeValues from "./AttributeValues";
export default class Container {
    readonly attributeValues: AttributeValues;
    readonly handleKeyDown: ((event: KeyboardEvent) => void);
    readonly handleKeyUp: ((event: KeyboardEvent) => void);
    readonly handleFocusOut: ((event: any) => void);
    private readonly container;
    element: HTMLElement;
    constructor(attributeValues: AttributeValues, handleKeyDown: ((event: KeyboardEvent) => void), handleKeyUp: ((event: KeyboardEvent) => void), handleFocusOut: ((event: any) => void));
    destroy(): void;
    private build;
    addFocusedClassNames: () => void;
    removeFocusedClassNames: () => void;
}
