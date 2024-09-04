import AttributeValues from "./AttributeValues";
export default class Input {
    readonly input: HTMLInputElement;
    readonly attributeValues: AttributeValues;
    readonly handleFocus: ((event: any) => void);
    readonly handlePaste: ((event: any) => void);
    constructor(input: HTMLInputElement, attributeValues: AttributeValues, handleFocus: ((event: any) => void), handlePaste: ((event: any) => void));
    private build;
    destroy(): void;
    element: HTMLInputElement;
    removeInputShowClassNames: () => void;
    addInputShowClassNames: () => void;
    hasMinimumCharacters: () => boolean;
    setSelectionRange: () => void;
}
