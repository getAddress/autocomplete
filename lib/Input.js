export default class Input {
    constructor(input, attributeValues, handleFocus, handlePaste) {
        this.input = input;
        this.attributeValues = attributeValues;
        this.handleFocus = handleFocus;
        this.handlePaste = handlePaste;
        this.element = this.input;
        this.removeInputShowClassNames = () => {
            this.input.classList.remove(this.attributeValues.inputShowClassName);
            if (this.attributeValues.inputShowAdditionalClassNames) {
                for (const name of this.attributeValues.inputShowAdditionalClassNames) {
                    this.input.classList.remove(name);
                }
            }
        };
        this.addInputShowClassNames = () => {
            this.input.classList.add(this.attributeValues.inputShowClassName);
            if (this.attributeValues.inputShowAdditionalClassNames) {
                for (const name of this.attributeValues.inputShowAdditionalClassNames) {
                    this.input.classList.add(name);
                }
            }
        };
        this.hasMinimumCharacters = () => {
            var _a, _b;
            var minimumCharacters = (_b = (_a = this.attributeValues.options) === null || _a === void 0 ? void 0 : _a.minimum_characters) !== null && _b !== void 0 ? _b : 2;
            return this.input.value.length >= minimumCharacters;
        };
        this.setSelectionRange = () => {
            this.input.setSelectionRange(this.input.value.length, this.input.value.length + 1);
        };
        this.build();
    }
    build() {
        this.input.classList.add(this.attributeValues.inputClassName);
        if (this.attributeValues.inputAdditionalClassNames) {
            for (const name of this.attributeValues.inputAdditionalClassNames) {
                this.input.classList.add(name);
            }
        }
        this.input.setAttribute('aria-expanded', 'false');
        this.input.setAttribute('autocomplete', 'off');
        this.input.setAttribute('aria-autocomplete', 'list');
        this.input.setAttribute('role', 'combobox');
        this.input.setAttribute('aria-owns', `${this.attributeValues.listId}`);
        this.input.addEventListener('focus', this.handleFocus);
        this.input.addEventListener('paste', this.handlePaste);
    }
    destroy() {
        this.input.classList.remove(this.attributeValues.inputClassName);
        if (this.attributeValues.inputAdditionalClassNames) {
            for (const name of this.attributeValues.inputAdditionalClassNames) {
                this.input.classList.remove(name);
            }
        }
        this.removeInputShowClassNames();
        this.input.removeAttribute('aria-expanded');
        this.input.removeAttribute('autocomplete');
        this.input.removeAttribute('aria-autocomplete');
        this.input.removeAttribute('role');
        this.input.removeAttribute('aria-owns');
        this.input.removeEventListener('focus', this.handleFocus);
        this.input.removeEventListener('paste', this.handlePaste);
    }
}
//# sourceMappingURL=Input.js.map