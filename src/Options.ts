import {AutocompleteFilter} from 'getaddress-api';
import { Options as FSoptions } from "getaddress-autocomplete-modal";

export class Options 
{
    static show_all_for_postcode_defaut = false;
    static show_all_for_postcode_text_default = "Show all..";
    id_prefix?:string = "getAddress-autocomplete";
    css_prefix?:string = "getAddress_autocomplete";
    delay?:number = 200;
    minimum_characters?:number = 2; 
    clear_list_on_select?:boolean = true;
    select_on_focus? = true;
    show_all_for_postcode? = Options.show_all_for_postcode_defaut;
    show_all_for_postcode_text?  = Options.show_all_for_postcode_text_default;
    alt_autocomplete_url?:string = undefined;
    alt_get_url?:string  = undefined;
    input_class_names?:string[] = [];
    input_show_class_names?:string[] = [];
    list_class_names?:string[] = [];
    container_class_names?:string[] = [];
    suggestion_class_names?:string[] = [];
    suggestion_focused_class_names?:string[] = [];
    suggestion_show_all_class_names?:string[] = [];
    list_show_all_class_names?:string[] = [];
    container_focused_class_names?:string[] = [];
    highlight_suggestion? = true;
    highlight_suggestion_start_tag? = "<b>";
    highlight_suggestion_end_tag? = "</b>";
    list_width?:string  = undefined;
    suggestion_count? = 6;
    auto_calc_list_height?= true;
    suggestion_template?= "{formatted_address}{postcode,, }{postcode}";
    filter?:Partial<AutocompleteFilter> =undefined;
    bind_output_fields?=true;
    input_focus_on_select?=true;
    debug?=false;
    enable_get?=true;
    set_default_output_field_names?=true;
    remember_last_search? = true;
    full_screen_on_mobile=true;
    max_mobile_screen_width = 500;
    full_screen_options?:Partial<FSoptions>=undefined;

    constructor(options: Partial<Options> = {}) {
        Object.assign(this, options);
    }

}



