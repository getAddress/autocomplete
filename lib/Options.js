export class Options {
    constructor(options = {}) {
        this.id_prefix = "getAddress-autocomplete";
        this.css_prefix = "getAddress_autocomplete";
        this.delay = 200;
        this.minimum_characters = 2;
        this.clear_list_on_select = true;
        this.select_on_focus = true;
        this.show_all_for_postcode = Options.show_all_for_postcode_defaut;
        this.show_all_for_postcode_text = Options.show_all_for_postcode_text_default;
        this.alt_autocomplete_url = undefined;
        this.alt_get_url = undefined;
        this.input_class_names = [];
        this.input_show_class_names = [];
        this.list_class_names = [];
        this.container_class_names = [];
        this.suggestion_class_names = [];
        this.suggestion_focused_class_names = [];
        this.suggestion_show_all_class_names = [];
        this.list_show_all_class_names = [];
        this.container_focused_class_names = [];
        this.highlight_suggestion = true;
        this.highlight_suggestion_start_tag = "<b>";
        this.highlight_suggestion_end_tag = "</b>";
        this.list_width = undefined;
        this.suggestion_count = 6;
        this.auto_calc_list_height = true;
        this.suggestion_template = "{formatted_address}{postcode,, }{postcode}";
        this.filter = undefined;
        this.bind_output_fields = true;
        this.input_focus_on_select = true;
        this.debug = false;
        this.enable_get = true;
        this.set_default_output_field_names = true;
        this.remember_last_search = true;
        this.full_screen_on_mobile = true;
        this.max_mobile_screen_width = 500;
        this.full_screen_options = undefined;
        this.show_postcode = false;
        Object.assign(this, options);
    }
}
Options.show_all_for_postcode_defaut = false;
Options.show_all_for_postcode_text_default = "Show all..";
//# sourceMappingURL=Options.js.map