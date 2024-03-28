import AttributeValues from "./AttributeValues";
export default class Style {
    readonly attributeValues: AttributeValues;
    constructor(attributeValues: AttributeValues);
    css: string;
    cssNoListWidth: string;
    cssWithListWidth: string;
    inject: () => void;
    private getCss;
}
