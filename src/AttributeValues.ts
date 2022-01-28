import { Options } from "./Options";


export default class AttributeValues{
    
    readonly listId:string;
    readonly listClassName:string;
    readonly listAdditionalClassNames:string[]
    readonly listClassNameShowAll:string;

    readonly containerId:string
    readonly containerClassName:string;
    readonly containerFocusedClassName:string;
    readonly containerAdditionalClassNames:string[]

    readonly suggestionClassName:string;
    readonly suggestionFocusedClassName:string;
    readonly suggestionAdditionalClassNames:string[]
    readonly suggestionShowAllClassName:string;
    
    readonly id_prefix:string;
    readonly inputClassName:string;
    readonly inputAdditionalClassNames:string[]
    readonly inputShowClassName:string;

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
        this.listClassNameShowAll = `${css_prefix}_list_show`;

        
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
        //todo:

    }

    getSuggestionId(index:number){
        return `${this.id_prefix}-suggestion-${index}`;
    }
}