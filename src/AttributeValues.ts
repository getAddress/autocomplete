import { Options } from "./Options";

export default class AttributeValues{
    
    readonly listId:string;
    readonly listClassName:string;
    readonly listAdditionalClassNames:string[]
    
    readonly listShowAllClassName:string;
    readonly listShowAllClassNames:string[]
    //todo: add addtional class names

    readonly containerId:string
    readonly containerClassName:string;
    readonly containerAdditionalClassNames:string[]

    readonly containerFocusedClassName:string;
    //todo: add addtional class names

    readonly suggestionClassName:string;
    readonly suggestionAdditionalClassNames:string[]

    readonly suggestionFocusedClassName:string;
    //todo: add addtional class names
    
    readonly suggestionShowAllClassName:string;
    //todo: add addtional class names
    
    readonly id_prefix:string;
    readonly inputClassName:string;
    readonly inputAdditionalClassNames:string[]

    readonly inputShowClassName:string;
    readonly inputShowAdditionalClassNames:string[]

    constructor(readonly options:Options, index:number)
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
        if(options.list_class_names)
        {
            this.listAdditionalClassNames  = options.list_class_names;
        }
        this.listShowAllClassName = `${css_prefix}_list_show`;

        if(options.list_show_all_class_names)
        {
            this.listShowAllClassNames  = options.list_show_all_class_names;
        }

        this.containerId = `${this.id_prefix}-container${suffix}`;
        this.containerClassName = `${css_prefix}_container`;
        this.containerFocusedClassName = `${css_prefix}_container_focused`;
        if(options.container_class_names)
        {
            this.containerAdditionalClassNames  = options.container_class_names;
        }
        
        this.suggestionClassName = `${css_prefix}_suggestion`;
        this.suggestionFocusedClassName = `${css_prefix}_suggestion_focused`;
        this.suggestionShowAllClassName = `${css_prefix}_suggestion_show_all`;
        if(options.suggestion_class_names){
            this.suggestionAdditionalClassNames  = options.suggestion_class_names;
        }

        this.inputClassName = `${css_prefix}_input`;
        if(options.input_class_names){
          this.inputAdditionalClassNames  = options.input_class_names;
        }
       
        this.inputShowClassName = `${css_prefix}_input_show`;
        if(options.input_show_class_names){
            this.inputShowAdditionalClassNames  = options.input_show_class_names;
        }
    }

    getSuggestionId(index:number){
        return `${this.id_prefix}-suggestion-${index}`;
    }
}