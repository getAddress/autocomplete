import { Options } from "./Options";

let index = 0;
export default class AttributeValues{
    
    readonly listId:string;
    readonly listClassName:string;
    
    readonly containerId:string
    readonly containerClassName:string;
    readonly containerFocusedClassName:string;

    readonly suggestionClassName:string;
    readonly suggestionFocusedClassName:string;
    
    readonly id_prefix:string;
    readonly inputClassName:string;
    readonly inputShowClassName:string;

    constructor(readonly options:Options)
    {
        let suffix= "";
        if(index > 0)
        {
            suffix = `-${index}`;
        }

        this.id_prefix = options.id_prefix;
        const css_prefix = options.css_prefix;

        this.listId = `${this.id_prefix}-list${suffix}`;
        this.listClassName = `${css_prefix}_list`;
        
        this.containerId = `${this.id_prefix}-container${suffix}`;
        this.containerClassName = `${css_prefix}_container`;
        this.containerFocusedClassName = `${css_prefix}_container_focused`;
        
        this.suggestionClassName = `${css_prefix}_suggestion`;
        this.suggestionFocusedClassName = `${css_prefix}_suggestion_focused`;

        this.inputClassName = `${css_prefix}_input`;
        this.inputShowClassName = `${css_prefix}_input_show`;


        index+=1;
    }

    getSuggestionId(index:number){
        return `${this.id_prefix}-suggestion-${index}`;
    }
}