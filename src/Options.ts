import {AutocompleteFilter} from "getaddress-api";
import { IOutputFields } from "./OutputFields";

export class Options 
{
    id_prefix?:string = "getAddress-autocomplete";
    css_prefix?:string = "getAddress_autocomplete";
    output_fields:IOutputFields = undefined;
    delay:number = 200;
    minimum_characters:number = 2; 
    clear_list_on_select = true;
    select_on_focus = true;
    show_all_for_postcode = false;
    show_all_for_postcode_text  = "Show all..";
    alt_autocomplete_url:string = undefined;
    alt_get_url:string = undefined;
    input_class_names:string[] = [];
    input_show_class_names:string[] = [];
    list_class_names:string[] = [];
    container_class_names:string[] = [];
    suggestion_class_names:string[] = [];
    list_show_all_class_names:string[] = [];
    highlight_suggestion = true;
    highlight_suggestion_start_tag = "<b>";
    highlight_suggestion_end_tag = "</b>";
    list_width:string = undefined;
    suggestion_count = 6;
    auto_calc_list_height= true;
    suggestion_template= undefined;
    filter:AutocompleteFilter=undefined;
    bind_output_fields=true;
    input_focus_on_select=true;
    debug=false;
    enable_get=true;

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
    show_all_for_postcode?:boolean;
    how_all_for_postcode_text?:string;
    alt_autocomplete_url?:string;
    alt_get_url?:string;
    input_class_names?:string[];
    input_show_class_names?:string[];
    list_class_names?:string[];
    container_class_names?:string[];
    suggestion_class_names?:string[];
    highlight_suggestion?:boolean;
    highlight_suggestion_start_tag?:string;
    highlight_suggestion_end_tag?:string;
    list_width?:string;
    suggestion_count?:number;
    auto_calc_list_height?:boolean;
    suggestion_template?:string;
    filter?:AutocompleteFilter;
    bind_output_fields?:boolean;
    output_fields?:IOutputFields;
    input_focus_on_select?:boolean;
    debug?:boolean;
    enable_get?:boolean;
    list_show_all_class_names?:string[];
}

