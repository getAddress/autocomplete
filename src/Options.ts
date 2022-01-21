
export class Options 
{
    id_prefix?:string = "getAddress-autocomplete";
    css_prefix?:string = "getAddress_autocomplete";
    delay:number = 200;
    minimum_characters:number = 2; 
    clear_list_on_select = true;
    select_on_focus = true;

    constructor(options:IOptions = {})
    {
        for (const prop in options) {
            if (options.hasOwnProperty(prop) && typeof options[prop] !== 'undefined') {
                this[prop] = options[prop];
            }
        }
    }
}

export interface IOptions{
    id_prefix?:string;
    css_prefix?:string;
    delay?:number;
    minimum_characters?:number;
    clear_list_on_select?:boolean;
    select_on_focus?:boolean;
}

