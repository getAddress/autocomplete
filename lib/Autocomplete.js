var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { AddressSelectedEvent, AddressSelectedFailedEvent, SuggestionsEvent, SuggestionsFailedEvent } from "./Events";
import { Options } from "./Options";
export default class Autocomplete {
    constructor(input, client, output_fields, attributeValues) {
        this.input = input;
        this.client = client;
        this.output_fields = output_fields;
        this.attributeValues = attributeValues;
        this.container = undefined;
        this.list = undefined;
        this.selectedIndex = -1;
        this.showAllClicked = false;
        this.onInputFocus = (event) => {
            this.addContainerFocusedClassNames();
            if (this.attributeValues.options.select_on_focus) {
                this.input.select();
            }
            this.selectedIndex = -1;
        };
        this.onInputPaste = (event) => {
            setTimeout(() => { this.populateList(false); }, 100);
        };
        this.onContainerKeyUp = (event) => {
            this.debug(event);
            this.handleKeyUp(event);
        };
        this.onContainerKeyDown = (event) => {
            this.debug(event);
            this.keyDownHandler(event);
        };
        this.onContainerFocusOut = (event) => {
            this.handleComponentBlur(event, false);
        };
        this.debug = (data) => {
            if (this.attributeValues.options.debug) {
                console.log(data);
            }
        };
        this.keyDownHandler = (event) => {
            switch (event.code) {
                case "ArrowUp":
                    this.handleUpKey(event);
                    break;
                case "ArrowDown":
                    this.handleDownKey(event);
                    break;
                case "End":
                    this.handleEndKey(event);
                    break;
                case "Home":
                    this.handleHomeKey(event);
                    break;
                case "Enter":
                    this.handleEnterKey(event);
                    break;
                case "PageUp":
                    this.handlePageUpKey(event);
                    break;
                case "PageDown":
                    this.handlePageDownKey(event);
                    break;
                case "Escape":
                    this.handleComponentBlur(event, true);
                    break;
                default:
                    this.handleKeyDownDefault(event);
                    break;
            }
        };
        this.handlePageUpKey = (event) => {
            if (this.list !== undefined && !this.list.hidden) {
                event.preventDefault();
                this.setSuggestionFocus(event, 0);
            }
        };
        this.handlePageDownKey = (event) => {
            if (this.list !== undefined && !this.list.hidden) {
                event.preventDefault();
                this.setSuggestionFocus(event, this.list.children.length - 1);
            }
        };
        this.handleHomeKey = (event) => {
            if (this.list !== undefined && !this.list.hidden && event.target !== this.input) {
                event.preventDefault();
                this.setSuggestionFocus(event, 0);
            }
        };
        this.handleComponentBlur = (event, force = false) => {
            clearTimeout(this.blurTimer);
            const delay = force ? 0 : 100;
            this.blurTimer = setTimeout(() => {
                const activeElem = document.activeElement;
                if (!force &&
                    activeElem &&
                    this.container !== undefined &&
                    this.container.contains(activeElem)) {
                    return;
                }
                if (!this.showAllClicked) {
                    this.clearList();
                    this.removeContainerFocusedClassNames();
                }
                this.showAllClicked = false;
            }, delay);
        };
        this.handleEndKey = (event) => {
            if (this.list !== undefined && !this.list.hidden) {
                const suggestions = this.list.children;
                if (suggestions.length) {
                    event.preventDefault();
                    this.setSuggestionFocus(event, suggestions.length - 1);
                }
            }
        };
        this.handleEnterKey = (event) => {
            if (this.list !== undefined && !this.list.hidden) {
                event.preventDefault();
                if (this.selectedIndex > -1) {
                    this.handleSuggestionSelected(event, this.selectedIndex);
                }
            }
        };
        this.handleSuggestionSelected = (event, indexNumber) => __awaiter(this, void 0, void 0, function* () {
            this.setSuggestionFocus(event, indexNumber);
            this.showAllClicked = false;
            if (this.selectedIndex > -1 && this.list !== undefined) {
                const suggestions = this.list.children;
                const suggestion = suggestions[this.selectedIndex];
                if (suggestion.innerText === this.attributeValues.options.show_all_for_postcode_text) {
                    this.showAllClicked = true;
                    this.populateList(true);
                    this.input.focus();
                }
                else if (!this.attributeValues.options.enable_get) {
                    this.clearList();
                }
                else {
                    if (this.attributeValues.options.clear_list_on_select) {
                        this.clearList();
                    }
                    const id = suggestion.dataset.id;
                    const addressResult = yield this.client.get(id, {
                        remember: this.attributeValues.options.remember_last_search
                    });
                    if (addressResult.isSuccess) {
                        let success = addressResult.toSuccess();
                        this.bind(success.address);
                        AddressSelectedEvent.dispatch(this.input, id, success.address);
                        if (this.attributeValues.options.input_focus_on_select) {
                            this.input.focus();
                            this.input.setSelectionRange(this.input.value.length, this.input.value.length + 1);
                        }
                    }
                    else {
                        const failed = addressResult.toFailed();
                        AddressSelectedFailedEvent.dispatch(this.input, id, failed.status, failed.message);
                    }
                }
            }
        });
        this.bind = (address) => {
            if (address && this.attributeValues.options.bind_output_fields) {
                this.setOutputfield(this.output_fields.building_name, address.building_name);
                this.setOutputfield(this.output_fields.building_number, address.building_number);
                this.setOutputfield(this.output_fields.latitude, address.latitude.toString());
                this.setOutputfield(this.output_fields.longitude, address.longitude.toString());
                this.setOutputfield(this.output_fields.line_1, address.line_1);
                this.setOutputfield(this.output_fields.line_2, address.line_2);
                this.setOutputfield(this.output_fields.line_3, address.line_3);
                this.setOutputfield(this.output_fields.line_4, address.line_4);
                this.setOutputfield(this.output_fields.country, address.country);
                this.setOutputfield(this.output_fields.county, address.county);
                this.setOutputfield(this.output_fields.formatted_address_0, address.formatted_address[0]);
                this.setOutputfield(this.output_fields.formatted_address_1, address.formatted_address[1]);
                this.setOutputfield(this.output_fields.formatted_address_2, address.formatted_address[2]);
                this.setOutputfield(this.output_fields.formatted_address_3, address.formatted_address[3]);
                this.setOutputfield(this.output_fields.formatted_address_4, address.formatted_address[4]);
                this.setOutputfield(this.output_fields.town_or_city, address.town_or_city);
                this.setOutputfield(this.output_fields.locality, address.locality);
                this.setOutputfield(this.output_fields.district, address.district);
                this.setOutputfield(this.output_fields.residential, address.residential.toString());
                this.setOutputfield(this.output_fields.sub_building_name, address.sub_building_name);
                this.setOutputfield(this.output_fields.sub_building_number, address.sub_building_number);
                this.setOutputfield(this.output_fields.thoroughfare, address.thoroughfare);
                this.setOutputfield(this.output_fields.postcode, address.postcode);
            }
        };
        this.setOutputfield = (fieldName, fieldValue) => {
            if (!fieldName) {
                return;
            }
            let element = document.getElementById(fieldName);
            if (!element) {
                element = document.querySelector(fieldName);
            }
            if (element) {
                if (element instanceof HTMLInputElement) {
                    element.value = fieldValue;
                }
                else {
                    element.innerText = fieldValue;
                }
            }
            return element;
        };
        this.handleKeyDownDefault = (event) => {
            let isPrintableKey = event.key.length === 1 || event.key === 'Unidentified';
            if (isPrintableKey) {
                clearTimeout(this.filterTimer);
                this.filterTimer = setTimeout(() => {
                    if (this.attributeValues.options.minimum_characters && this.input.value.length >= this.attributeValues.options.minimum_characters) {
                        this.populateList();
                    }
                    else {
                        this.clearList();
                    }
                }, this.attributeValues.options.delay);
            }
            else if (this.attributeValues.options.minimum_characters && this.list !== undefined && !this.list.hidden && this.input.value.length < this.attributeValues.options.minimum_characters) {
                this.clearList();
            }
        };
        this.handleKeyUp = (event) => {
            if (event.code === 'Backspace' || event.code === 'Delete') {
                if (event) {
                    const target = event.target;
                    if (target == this.input) {
                        if (this.attributeValues.options.minimum_characters && this.input.value.length < this.attributeValues.options.minimum_characters) {
                            this.clearList();
                        }
                        else {
                            this.populateList();
                        }
                    }
                    else if (this.container !== undefined && this.container.contains(target)) {
                        this.input.focus();
                        this.input.setSelectionRange(this.input.value.length, this.input.value.length + 1);
                    }
                }
            }
        };
        this.handleDownKey = (event) => {
            event.preventDefault();
            if (this.list !== undefined && !this.list.hidden) {
                if (this.selectedIndex < 0) {
                    this.setSuggestionFocus(event, 0);
                }
                else {
                    this.setSuggestionFocus(event, this.selectedIndex + 1);
                }
            }
        };
        this.setSuggestionFocus = (event, index) => {
            if (this.list !== undefined) {
                const suggestions = this.list.children;
                this.removeSuggestionFocusedClassName(suggestions);
                if (index < 0 || !suggestions.length) {
                    this.selectedIndex = -1;
                    if (event && event.target !== this.input) {
                        this.input.focus();
                    }
                    return;
                }
                if (index >= suggestions.length) {
                    this.selectedIndex = suggestions.length - 1;
                    this.setSuggestionFocus(event, this.selectedIndex);
                    return;
                }
                const focusedSuggestion = suggestions[index];
                if (focusedSuggestion) {
                    this.selectedIndex = index;
                    this.addSuggestionFocusedClassName(focusedSuggestion);
                    focusedSuggestion.focus();
                    return;
                }
            }
            this.selectedIndex = -1;
        };
        this.addSuggestionFocusedClassName = (suggestion) => {
            suggestion.classList.add(this.attributeValues.suggestionFocusedClassName);
        };
        this.removeSuggestionFocusedClassName = (suggestions) => {
            for (let i = 0; i < suggestions.length; i++) {
                suggestions[i].classList.remove(this.attributeValues.suggestionFocusedClassName);
            }
        };
        this.populateList = (show_all) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            if (show_all === void 0) { show_all = (_a = this.attributeValues.options.show_all_for_postcode) !== null && _a !== void 0 ? _a : Options.show_all_for_postcode_defaut; }
            const autocompleteOptions = {
                all: show_all,
                top: this.attributeValues.options.suggestion_count,
                template: this.attributeValues.options.suggestion_template
            };
            if (this.attributeValues.options.filter) {
                autocompleteOptions.filter = this.attributeValues.options.filter;
            }
            const query = (_b = this.input.value) === null || _b === void 0 ? void 0 : _b.trim();
            const result = yield this.client.autocomplete(query, autocompleteOptions);
            if (result.isSuccess && this.list !== undefined) {
                if (this.attributeValues.options.auto_calc_list_height && this.list !== undefined) {
                    this.list.style.removeProperty('max-height');
                }
                //const computedListHeight = this.list.offsetHeight;
                const listChildCount = this.list.children.length;
                const success = result.toSuccess();
                const newItems = [];
                if (success.suggestions.length) {
                    const showAllOption = !show_all && this.isPostcode(query);
                    const totalLength = showAllOption ? success.suggestions.length + 1 : success.suggestions.length;
                    for (let i = 0; i < success.suggestions.length; i++) {
                        const li = this.getListItem(i, success.suggestions[i], totalLength);
                        newItems.push(li);
                    }
                    if (showAllOption
                        && success.suggestions.length
                        && (success.suggestions.length) === autocompleteOptions.top) {
                        const li = this.getShowAllListItem(this.list.children.length, totalLength);
                        newItems.push(li);
                    }
                    this.list.replaceChildren(...newItems);
                    const toFocus = this.list.children[0];
                    if (toFocus) {
                        this.selectedIndex = 0;
                        toFocus.classList.add(this.attributeValues.suggestionFocusedClassName);
                    }
                    this.addInputShowClassNames();
                    this.list.hidden = false;
                    this.input.setAttribute('aria-expanded', 'true');
                    this.list.setAttribute('aria-hidden', 'false');
                    if (show_all) {
                        this.addListShowAllClassNames();
                    }
                    if (show_all &&
                        this.attributeValues.options.auto_calc_list_height
                        && this.list.offsetHeight > 0
                        && listChildCount < this.list.children.length) {
                        this.list.style.maxHeight = `${this.list.offsetHeight}px`;
                    }
                    document.addEventListener('click', this.documentClick);
                }
                else {
                    this.clearList();
                }
                SuggestionsEvent.dispatch(this.input, query, success.suggestions);
            }
            else {
                const failed = result.toFailed();
                SuggestionsFailedEvent.dispatch(this.input, query, failed.status, failed.message);
            }
        });
        this.addContainerFocusedClassNames = () => {
            if (this.container !== undefined) {
                this.container.classList.add(this.attributeValues.containerFocusedClassName);
                if (this.attributeValues.containerFocusedAdditionalClassNames) {
                    for (const name of this.attributeValues.containerFocusedAdditionalClassNames) {
                        this.container.classList.add(name);
                    }
                }
            }
        };
        this.removeContainerFocusedClassNames = () => {
            if (this.container !== undefined) {
                this.container.classList.remove(this.attributeValues.containerFocusedClassName);
                if (this.attributeValues.containerFocusedAdditionalClassNames) {
                    for (const name of this.attributeValues.containerFocusedAdditionalClassNames) {
                        this.container.classList.remove(name);
                    }
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
        this.removeInputShowClassNames = () => {
            this.input.classList.remove(this.attributeValues.inputShowClassName);
            if (this.attributeValues.inputShowAdditionalClassNames) {
                for (const name of this.attributeValues.inputShowAdditionalClassNames) {
                    this.input.classList.remove(name);
                }
            }
        };
        this.removeListShowAllClassNames = () => {
            if (this.list !== undefined) {
                this.list.classList.remove(this.attributeValues.listShowAllClassName);
                if (this.attributeValues.listShowAllAdditionalClassNames) {
                    for (const name of this.attributeValues.listShowAllAdditionalClassNames) {
                        this.list.classList.remove(name);
                    }
                }
            }
        };
        this.addListShowAllClassNames = () => {
            if (this.list !== undefined) {
                this.list.classList.add(this.attributeValues.listShowAllClassName);
                if (this.attributeValues.listShowAllAdditionalClassNames) {
                    for (const name of this.attributeValues.listShowAllAdditionalClassNames) {
                        this.list.classList.add(name);
                    }
                }
            }
        };
        this.clearList = () => {
            if (this.list !== undefined) {
                this.list.replaceChildren(...[]);
                this.list.hidden = true;
                this.list.setAttribute('aria-hidden', 'true');
            }
            this.input.setAttribute('aria-expanded', 'false');
            this.selectedIndex = -1;
            this.removeInputShowClassNames();
            this.removeListShowAllClassNames();
            document.removeEventListener('click', this.documentClick);
        };
        this.getListItem = (index, suggestion, length) => {
            const li = document.createElement('LI');
            li.tabIndex = -1;
            li.className = this.attributeValues.suggestionClassName;
            if (this.attributeValues.suggestionAdditionalClassNames) {
                for (const name of this.attributeValues.suggestionAdditionalClassNames) {
                    li.classList.add(name);
                }
            }
            li.id = this.attributeValues.getSuggestionId(index);
            let address = suggestion.address;
            if (this.attributeValues.options.highlight_suggestion) {
                let regexvalue = this.input.value.trim().replace(/ /g, ',* +');
                const regexp = new RegExp(`\\b(${regexvalue})`, "gi");
                address = address.replace(regexp, `${this.attributeValues.options.highlight_suggestion_start_tag}$1${this.attributeValues.options.highlight_suggestion_end_tag}`);
                li.innerHTML = address;
            }
            else {
                li.innerText = address;
            }
            li.dataset.id = suggestion.id;
            li.setAttribute('role', 'option');
            li.setAttribute('aria-posinset', `${index + 1}`);
            li.setAttribute('aria-setsize', `${length}`);
            return li;
        };
        this.getShowAllListItem = (index, length) => {
            var _a;
            const li = document.createElement('LI');
            li.tabIndex = -1;
            li.className = this.attributeValues.suggestionClassName;
            li.classList.add(this.attributeValues.suggestionShowAllClassName);
            if (this.attributeValues.suggestionShowAllAdditionalClassNames) {
                for (const name of this.attributeValues.suggestionShowAllAdditionalClassNames) {
                    li.classList.add(name);
                }
            }
            if (this.attributeValues.suggestionAdditionalClassNames) {
                for (const name of this.attributeValues.suggestionAdditionalClassNames) {
                    li.classList.add(name);
                }
            }
            li.id = this.attributeValues.getSuggestionId(index);
            li.innerText = (_a = this.attributeValues.options.show_all_for_postcode_text) !== null && _a !== void 0 ? _a : Options.show_all_for_postcode_text_default;
            li.setAttribute('role', 'option');
            li.setAttribute('aria-posinset', `${index + 1}`);
            li.setAttribute('aria-setsize', `${length}`);
            return li;
        };
        this.isPostcode = (text) => {
            const pattern = '^(GIR ?0AA|[A-PR-UWYZ]([0-9]{1,2}|([A-HK-Y][0-9]([0-9ABEHMNPRV-Y])?)|[0-9][A-HJKPS-UW]) ?[0-9][ABD-HJLNP-UW-Z]{2})$';
            const patt = new RegExp(pattern, 'gi');
            return patt.test(text.trim());
        };
    }
    destroy() {
        this.destroyContainer();
        this.destroyInput();
        this.destroyList();
    }
    destroyList() {
        if (this.list !== undefined) {
            this.list.remove();
        }
    }
    destroyContainer() {
        if (this.container !== undefined) {
            this.container.removeEventListener('keydown', this.onContainerKeyDown);
            this.container.removeEventListener('keyup', this.onContainerKeyUp);
            this.container.removeEventListener('focusout', this.onContainerFocusOut);
            const children = Array.from(this.container.childNodes);
            this.container.replaceWith(...children);
        }
    }
    destroyInput() {
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
        this.input.removeEventListener('focus', this.onInputFocus);
        this.input.removeEventListener('paste', this.onInputPaste);
    }
    build() {
        var _a;
        this.documentClick = this.handleComponentBlur.bind(this);
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
        this.container = document.createElement('DIV');
        this.container.id = this.attributeValues.containerId;
        this.container.className = this.attributeValues.containerClassName;
        if (this.attributeValues.containerAdditionalClassNames) {
            for (const name of this.attributeValues.containerAdditionalClassNames) {
                this.container.classList.add(name);
            }
        }
        if (((_a = this.input) === null || _a === void 0 ? void 0 : _a.parentNode) != null) {
            this.input.parentNode.insertBefore(this.container, this.input);
            this.input.addEventListener('focus', this.onInputFocus);
            this.input.addEventListener('paste', this.onInputPaste);
        }
        this.container.addEventListener('focusout', this.onContainerFocusOut);
        this.container.appendChild(this.input);
        this.list = document.createElement('UL');
        this.list.id = this.attributeValues.listId;
        this.list.hidden = true;
        this.list.className = this.attributeValues.listClassName;
        if (this.attributeValues.listAdditionalClassNames) {
            for (const name of this.attributeValues.listAdditionalClassNames) {
                this.list.classList.add(name);
            }
        }
        this.list.setAttribute('role', 'listbox');
        this.list.setAttribute('aria-hidden', 'true');
        this.list.addEventListener('mouseenter', (event) => {
            if (this.list !== undefined) {
                const suggestions = this.list.children;
                this.removeSuggestionFocusedClassName(suggestions);
            }
        });
        this.list.addEventListener('click', (event) => {
            if (this.list !== undefined && event.target !== this.list) {
                const suggestions = Array.from(this.list.children);
                if (suggestions.length) {
                    var element = event.target;
                    while (element instanceof HTMLElement && element.tagName !== "LI") {
                        element = element.parentElement;
                    }
                    const suggestionIndex = suggestions.indexOf(element);
                    this.handleSuggestionSelected(event, suggestionIndex);
                }
            }
        });
        this.container.addEventListener('keydown', this.onContainerKeyDown);
        this.container.addEventListener('keyup', this.onContainerKeyUp);
        this.container.appendChild(this.list);
    }
    handleUpKey(event) {
        event.preventDefault();
        if (this.list !== undefined && !this.list.hidden) {
            this.setSuggestionFocus(event, this.selectedIndex - 1);
        }
    }
}
//# sourceMappingURL=Autocomplete.js.map