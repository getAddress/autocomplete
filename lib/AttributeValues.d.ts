import { Options } from "./Options";
export default class AttributeValues {
    readonly options: Options;
    readonly listId: string;
    readonly listClassName: string;
    readonly listAdditionalClassNames: string[] | undefined;
    readonly listShowAllClassName: string;
    readonly listShowAllAdditionalClassNames: string[] | undefined;
    readonly containerId: string;
    readonly containerClassName: string;
    readonly containerAdditionalClassNames: string[] | undefined;
    readonly containerFocusedClassName: string;
    readonly containerFocusedAdditionalClassNames: string[] | undefined;
    readonly suggestionClassName: string;
    readonly suggestionAdditionalClassNames: string[] | undefined;
    readonly suggestionFocusedClassName: string;
    readonly suggestionFocusedAdditionalClassNames: string[] | undefined;
    readonly suggestionShowAllClassName: string;
    readonly suggestionShowAllAdditionalClassNames: string[] | undefined;
    readonly id_prefix: string | undefined;
    readonly inputClassName: string;
    readonly inputAdditionalClassNames: string[] | undefined;
    readonly inputShowClassName: string;
    readonly inputShowAdditionalClassNames: string[] | undefined;
    constructor(options: Options, index: number);
    getSuggestionId(index: number): string;
}
