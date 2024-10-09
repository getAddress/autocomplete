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
import Input from "./Input";
import List from "./List";
import Container from "./Container";
export default class Autocomplete {
    constructor(inputElement, client, output_fields, attributeValues) {
        this.client = client;
        this.output_fields = output_fields;
        this.attributeValues = attributeValues;
        this.selectedIndex = -1;
        this.showAllClicked = false;
        this.onInputFocus = (event) => {
            this.container.addFocusedClassNames();
            if (this.attributeValues.options.select_on_focus) {
                this.input.element.select();
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
        this.onListClick = (event) => {
            if (event.target !== this.list.element) {
                const suggestions = Array.from(this.list.element.children);
                if (suggestions.length) {
                    var element = event.target;
                    while (element instanceof HTMLElement && element.tagName !== "LI") {
                        element = element.parentElement;
                    }
                    const suggestionIndex = suggestions.indexOf(element);
                    this.handleSuggestionSelected(event, suggestionIndex);
                }
            }
        };
        this.onListMouseEnter = (event) => {
            const suggestions = this.list.element.children;
            this.removeSuggestionFocusedClassName(suggestions);
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
            if (!this.list.element.hidden) {
                event.preventDefault();
                this.setSuggestionFocus(event, 0);
            }
        };
        this.handlePageDownKey = (event) => {
            if (!this.list.element.hidden) {
                event.preventDefault();
                this.setSuggestionFocus(event, this.list.element.children.length - 1);
            }
        };
        this.handleHomeKey = (event) => {
            if (!this.list.element.hidden && event.target !== this.input.element) {
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
                    this.container.element.contains(activeElem)) {
                    return;
                }
                if (!this.showAllClicked) {
                    this.clearList();
                    this.container.removeFocusedClassNames();
                }
                this.showAllClicked = false;
            }, delay);
        };
        this.handleEndKey = (event) => {
            if (!this.list.element.hidden) {
                const suggestions = this.list.element.children;
                if (suggestions.length) {
                    event.preventDefault();
                    this.setSuggestionFocus(event, suggestions.length - 1);
                }
            }
        };
        this.handleEnterKey = (event) => {
            if (!this.list.element.hidden) {
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
                const suggestions = this.list.element.children;
                const suggestion = suggestions[this.selectedIndex];
                if (suggestion.innerText === this.attributeValues.options.show_all_for_postcode_text) {
                    this.showAllClicked = true;
                    this.populateList(true);
                    this.input.element.focus();
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
                        AddressSelectedEvent.dispatch(this.input.element, id, success.address);
                        if (this.attributeValues.options.input_focus_on_select) {
                            this.input.element.focus();
                            this.input.setSelectionRange();
                        }
                    }
                    else {
                        const failed = addressResult.toFailed();
                        AddressSelectedFailedEvent.dispatch(this.input.element, id, failed.status, failed.message);
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
                    if (this.attributeValues.options.minimum_characters && this.input.hasMinimumCharacters()) {
                        this.populateList();
                    }
                    else {
                        this.clearList();
                    }
                }, this.attributeValues.options.delay);
            }
            else if (this.attributeValues.options.minimum_characters && !this.list.element.hidden && !this.input.hasMinimumCharacters()) {
                this.clearList();
            }
        };
        this.handleKeyUp = (event) => {
            if (event.code === 'Backspace' || event.code === 'Delete') {
                const target = event.target;
                if (target == this.input.element) {
                    clearTimeout(this.filterTimer);
                    this.filterTimer = setTimeout(() => {
                        if (this.attributeValues.options.minimum_characters && !this.input.hasMinimumCharacters()) {
                            this.clearList();
                        }
                        else {
                            this.populateList();
                        }
                    }, this.attributeValues.options.delay);
                }
                else if (this.container.element.contains(target)) {
                    this.input.element.focus();
                    this.input.setSelectionRange();
                }
            }
        };
        this.handleDownKey = (event) => {
            event.preventDefault();
            if (!this.list.element.hidden) {
                if (this.selectedIndex < 0) {
                    this.setSuggestionFocus(event, 0);
                }
                else {
                    this.setSuggestionFocus(event, this.selectedIndex + 1);
                }
            }
        };
        this.setSuggestionFocus = (event, index) => {
            const suggestions = this.list.element.children;
            this.removeSuggestionFocusedClassName(suggestions);
            if (index < 0 || !suggestions.length) {
                this.selectedIndex = -1;
                if (event && event.target !== this.input.element) {
                    this.input.element.focus();
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
            const query = (_b = this.input.element.value) === null || _b === void 0 ? void 0 : _b.trim();
            const result = yield this.client.autocomplete(query, autocompleteOptions);
            if (result.isSuccess) {
                if (this.attributeValues.options.auto_calc_list_height) {
                    this.list.element.style.removeProperty('max-height');
                }
                const listChildCount = this.list.element.children.length;
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
                        const li = this.getShowAllListItem(this.list.element.children.length, totalLength);
                        newItems.push(li);
                    }
                    this.list.element.replaceChildren(...newItems);
                    const toFocus = this.list.element.children[0];
                    if (toFocus) {
                        this.selectedIndex = 0;
                        toFocus.classList.add(this.attributeValues.suggestionFocusedClassName);
                    }
                    this.input.addInputShowClassNames();
                    this.list.element.hidden = false;
                    this.input.element.setAttribute('aria-expanded', 'true');
                    this.list.element.setAttribute('aria-hidden', 'false');
                    if (show_all) {
                        this.list.addShowAllClassNames();
                    }
                    if (show_all &&
                        this.attributeValues.options.auto_calc_list_height
                        && this.list.element.offsetHeight > 0
                        && listChildCount < this.list.element.children.length) {
                        this.list.element.style.maxHeight = `${this.list.element.offsetHeight}px`;
                    }
                    document.addEventListener('click', this.documentClick);
                }
                else {
                    this.clearList();
                }
                SuggestionsEvent.dispatch(this.input.element, query, success.suggestions);
            }
            else {
                const failed = result.toFailed();
                SuggestionsFailedEvent.dispatch(this.input.element, query, failed.status, failed.message);
            }
        });
        this.clearList = () => {
            this.list.clear();
            this.input.element.setAttribute('aria-expanded', 'false');
            this.selectedIndex = -1;
            this.input.removeInputShowClassNames();
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
                let regexvalue = this.input.element.value.trim().replace(/ /g, ',* +');
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
        this.input = new Input(inputElement, attributeValues, this.onInputFocus, this.onInputPaste);
        this.list = new List(attributeValues, this.onListMouseEnter, this.onListClick);
        this.container = new Container(attributeValues, this.onContainerKeyDown, this.onContainerKeyUp, this.onContainerFocusOut);
        this.build();
    }
    destroy() {
        this.container.destroy();
        this.input.destroy();
        this.list.destroy();
    }
    build() {
        this.documentClick = this.handleComponentBlur.bind(this);
        if (this.input.element.parentNode != null) {
            this.input.element.parentNode.insertBefore(this.container.element, this.input.element);
        }
        this.container.element.appendChild(this.input.element);
        this.container.element.appendChild(this.list.element);
    }
    handleUpKey(event) {
        event.preventDefault();
        if (!this.list.element.hidden) {
            this.setSuggestionFocus(event, this.selectedIndex - 1);
        }
    }
}
//# sourceMappingURL=Autocomplete.js.map