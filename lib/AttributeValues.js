export default class AttributeValues {
    constructor(options, index) {
        this.options = options;
        this.listAdditionalClassNames = undefined;
        this.listShowAllAdditionalClassNames = undefined;
        this.containerAdditionalClassNames = undefined;
        this.containerFocusedAdditionalClassNames = undefined;
        this.suggestionAdditionalClassNames = undefined;
        this.suggestionFocusedAdditionalClassNames = undefined;
        this.suggestionShowAllAdditionalClassNames = undefined;
        this.id_prefix = "";
        this.inputAdditionalClassNames = undefined;
        this.inputShowAdditionalClassNames = undefined;
        let suffix = "";
        if (index > 0) {
            suffix = `-${index}`;
        }
        this.id_prefix = options.id_prefix;
        const css_prefix = options.css_prefix;
        this.listId = `${this.id_prefix}-list${suffix}`;
        this.listClassName = `${css_prefix}_list`;
        if (options.list_class_names) {
            this.listAdditionalClassNames = options.list_class_names;
        }
        this.listShowAllClassName = `${css_prefix}_list_show`;
        if (options.list_show_all_class_names) {
            this.listShowAllAdditionalClassNames = options.list_show_all_class_names;
        }
        this.containerId = `${this.id_prefix}-container${suffix}`;
        this.containerClassName = `${css_prefix}_container`;
        if (options.container_class_names) {
            this.containerAdditionalClassNames = options.container_class_names;
        }
        this.containerFocusedClassName = `${css_prefix}_container_focused`;
        if (options.container_focused_class_names) {
            this.containerFocusedAdditionalClassNames = options.container_focused_class_names;
        }
        this.suggestionClassName = `${css_prefix}_suggestion`;
        if (options.suggestion_class_names) {
            this.suggestionAdditionalClassNames = options.suggestion_class_names;
        }
        this.suggestionShowAllClassName = `${css_prefix}_suggestion_show_all`;
        if (options.suggestion_show_all_class_names) {
            this.suggestionShowAllAdditionalClassNames = options.suggestion_show_all_class_names;
        }
        this.suggestionFocusedClassName = `${css_prefix}_suggestion_focused`;
        if (options.suggestion_focused_class_names) {
            this.suggestionFocusedAdditionalClassNames = options.suggestion_focused_class_names;
        }
        this.inputClassName = `${css_prefix}_input`;
        if (options.input_class_names) {
            this.inputAdditionalClassNames = options.input_class_names;
        }
        this.inputShowClassName = `${css_prefix}_input_show`;
        if (options.input_show_class_names) {
            this.inputShowAdditionalClassNames = options.input_show_class_names;
        }
    }
    getSuggestionId(index) {
        return `${this.id_prefix}-suggestion-${index}`;
    }
}
//# sourceMappingURL=AttributeValues.js.map