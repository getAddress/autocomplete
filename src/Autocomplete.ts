import AttributeValues from "./AttributeValues";
import Client, { AutocompleteAddress, AutocompleteOptions, Suggestion } from 'getaddress-api';
import { OutputFields } from "./OutputFields";
import { AddressSelectedEvent, AddressSelectedFailedEvent, SuggestionsEvent, SuggestionsFailedEvent } from "./Events";


//todo: autocomplete filter
//todo: aria

export default class Autocomplete
{

    private filterTimer: ReturnType<typeof setTimeout>
    private blurTimer: ReturnType<typeof setTimeout>
    private container:HTMLElement;
    private list: HTMLElement;
    private selectedIndex = -1;
    private showAllClicked:boolean;
    
    private documentClick: EventListenerObject;

    constructor(readonly input:HTMLInputElement,readonly client:Client,
        readonly output_fields:OutputFields, readonly attributeValues:AttributeValues)
    {
        if(!output_fields.formatted_address_0){
            output_fields.formatted_address_0 = this.input.id;
        }
    }

    public build()
    {
        this.documentClick = this.handleComponentBlur.bind(this);

        this.input.classList.add(this.attributeValues.inputClassName);
        if(this.attributeValues.inputAdditionalClassNames){
            for(const name of this.attributeValues.inputAdditionalClassNames){
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
        if(this.attributeValues.containerAdditionalClassNames){
            for(const name of this.attributeValues.containerAdditionalClassNames){
                this.container.classList.add(name);
            }
        }

        this.input.parentNode.insertBefore(this.container,this.input);
        
        this.input.addEventListener('focus', (event) => {
            this.container.classList.add(this.attributeValues.containerFocusedClassName);
            if(this.attributeValues.options.select_on_focus){
                this.input.select();
            }
            this.selectedIndex = -1;
        });
        
        this.container.addEventListener('focusout', (event) => {
          
           this.handleComponentBlur(event, false);
        });

        this.container.appendChild(this.input);

        this.list = document.createElement('UL');
        this.list.id = this.attributeValues.listId;
        this.list.hidden = true;
        this.list.className = this.attributeValues.listClassName;
        if(this.attributeValues.listAdditionalClassNames){
            for(const name of this.attributeValues.listAdditionalClassNames){
                this.list.classList.add(name);
            }
        }
        this.list.setAttribute('role', 'listbox');
        this.list.setAttribute('aria-hidden', 'true');


        this.list.addEventListener('mouseenter', (event) => {
            const suggestions = this.list.children;
            this.removeSuggestionFocusedClassName(suggestions);
        });
       
        this.list.addEventListener('click', (event) => {
            if (event.target !== this.list) 
            {
                const suggestions = Array.from(this.list.children);
                if (suggestions.length) 
                {
                    const suggestionIndex = suggestions.indexOf(event.target as HTMLElement);
                    this.handleSuggestionSelected(event, suggestionIndex);
                }
            }
        });

        this.container.addEventListener('keydown', (event:KeyboardEvent) => {
            this.debug(event);
            this.keyDownHandler(event);
        });
        this.container.addEventListener('keyup', (event:KeyboardEvent) => {
            this.debug(event);
            this.handleKeyUp(event);
        });
        
        this.container.appendChild(this.list);
    }

    private debug = (data:any)=>{
        if(this.attributeValues.options.debug){
            console.log(data);
        }
    };

    keyDownHandler = (event: KeyboardEvent)=>{
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

    handlePageUpKey = (event: KeyboardEvent) => {
        if (!this.list.hidden) {
            event.preventDefault();
            this.setSuggestionFocus(event, 0);
        }
    }
    handlePageDownKey = (event: KeyboardEvent) => {
        if (!this.list.hidden) {
            event.preventDefault();
            this.setSuggestionFocus(event, this.list.children.length -1);
        }
    }

    handleHomeKey = (event: KeyboardEvent) => {
        if (!this.list.hidden && event.target !== this.input) {
            event.preventDefault();
            this.setSuggestionFocus(event, 0);
        }
    }

    handleComponentBlur = (event: Event, force: boolean = false) =>{
        
        clearTimeout(this.blurTimer);

        const delay: number = force ? 0 : 100;
        this.blurTimer = setTimeout(() => {
            const activeElem: Element = document.activeElement;
            if (!force &&
                activeElem &&
                this.container.contains(activeElem)
            ) {
                return;
            }
            
            if(!this.showAllClicked){
                this.clearList();
                this.container.classList.remove(this.attributeValues.containerFocusedClassName);
            }
            this.showAllClicked = false;
            
        }, delay);
    }


    handleEndKey = (event: KeyboardEvent) => {
        if (!this.list.hidden) {
            const suggestions = this.list.children;
            if (suggestions.length) {
                event.preventDefault();
                this.setSuggestionFocus(event, suggestions.length - 1);
            }
        }
    }

    handleEnterKey = (event: KeyboardEvent) =>{
        if (!this.list.hidden) {
            event.preventDefault();
            if (this.selectedIndex > -1) {
                this.handleSuggestionSelected(event, this.selectedIndex);
            }
        }
    }

    handleSuggestionSelected = async (event: Event,  indexNumber:number)=>{
        
        this.setSuggestionFocus(event,indexNumber);
        this.showAllClicked = false;

        if(this.selectedIndex > -1)
        {
            const suggestions = this.list.children;
            const suggestion = suggestions[this.selectedIndex] as HTMLElement;
            
            if(suggestion.innerText === this.attributeValues.options.show_all_for_postcode_text)
            {
                this.showAllClicked = true;
                this.populateList(true);
                this.input.focus();
            }
            else
            {
                if(this.attributeValues.options.clear_list_on_select){
                    this.clearList();
                }

                const id = suggestion.dataset.id;
                const addressResult = await this.client.get(id);
                if(addressResult.isSuccess){
                    let success = addressResult.toSuccess();
                    
                    this.bind(success.address);
                    AddressSelectedEvent.dispatch(this.input,id,success.address);
                    
                    if(this.attributeValues.options.input_focus_on_select){
                        this.input.focus();
                        this.input.setSelectionRange(this.input.value.length,this.input.value.length+1);
                    }
                }
                else{
                    const failed = addressResult.toFailed();
                    AddressSelectedFailedEvent.dispatch(this.input,id,failed.status,failed.message);
                }
            }
            
        }
        
    };

    private bind = (address:AutocompleteAddress)=>
    {
        if(address && this.attributeValues.options.bind_output_fields)
        {
            this.setOutputfield(this.output_fields.building_name,address.building_name);
            this.setOutputfield(this.output_fields.building_number,address.building_number);

            this.setOutputfield(this.output_fields.latitude,address.latitude.toString());
            this.setOutputfield(this.output_fields.longitude,address.longitude.toString());

            this.setOutputfield(this.output_fields.line_1,address.line_1);
            this.setOutputfield(this.output_fields.line_2,address.line_2);
            this.setOutputfield(this.output_fields.line_3,address.line_3);
            this.setOutputfield(this.output_fields.line_4,address.line_4);

            this.setOutputfield(this.output_fields.country,address.country);
            this.setOutputfield(this.output_fields.county,address.county);

            this.setOutputfield(this.output_fields.formatted_address_0,address.formatted_address[0]);
            this.setOutputfield(this.output_fields.formatted_address_1,address.formatted_address[1]);
            this.setOutputfield(this.output_fields.formatted_address_2,address.formatted_address[2]);
            this.setOutputfield(this.output_fields.formatted_address_3,address.formatted_address[3]);
            this.setOutputfield(this.output_fields.formatted_address_4,address.formatted_address[4]);

            this.setOutputfield(this.output_fields.town_or_city,address.town_or_city);
            this.setOutputfield(this.output_fields.locality,address.locality);
            this.setOutputfield(this.output_fields.district,address.district);
            this.setOutputfield(this.output_fields.residential,address.residential.toString());

            this.setOutputfield(this.output_fields.sub_building_name,address.sub_building_name);
            this.setOutputfield(this.output_fields.sub_building_number,address.sub_building_number);

            this.setOutputfield(this.output_fields.thoroughfare,address.thoroughfare);
            this.setOutputfield(this.output_fields.postcode,address.postcode);
            
        }
    };

    private setOutputfield = (fieldName:string, fieldValue:string) =>
    {
            let element = document.getElementById(fieldName);
            if(element)
            {
               if(element instanceof HTMLInputElement){
                element.value = fieldValue;
               }
               else{
                element.innerText = fieldValue;
               }
            }
            return element;
    }

    handleKeyDownDefault = (event: KeyboardEvent)=>{
        
        let isPrintableKey = event.key.length === 1 || event.key === 'Unidentified';
        if(isPrintableKey){
            clearTimeout(this.filterTimer);
            
            this.filterTimer = setTimeout(() => 
            {
                if(this.input.value.length >= this.attributeValues.options.minimum_characters){
                    this.populateList();
                }
                else{
                    this.clearList(); 
                }
            },this.attributeValues.options.delay);
        }
        else if(!this.list.hidden && this.input.value.length < this.attributeValues.options.minimum_characters)
        {
            this.clearList(); 
        }
    };

    handleKeyUp = (event: KeyboardEvent)=>{
        
        if(event.code === 'Backspace' || event.code === 'Delete')
        {
            if(event){
            const target =(event as Event).target
            if (target == this.input)
            {
                if(this.input.value.length < this.attributeValues.options.minimum_characters)
                {
                    this.clearList(); 
                }
                else 
                {
                    this.populateList();
                }
            }
            else if(this.container.contains(target as HTMLElement)){
                this.input.focus();
                this.input.setSelectionRange(this.input.value.length,this.input.value.length+1);
            }
        }
        }
        
    };


    handleUpKey(event: KeyboardEvent) {
        event.preventDefault();
        if (!this.list.hidden) {
            this.setSuggestionFocus(event, this.selectedIndex - 1);
        }
    }

    handleDownKey = (event: KeyboardEvent) => {
        event.preventDefault();

        if (!this.list.hidden) 
        {
            if (this.selectedIndex < 0) {
                this.setSuggestionFocus(event, 0);
            } 
            else {
                this.setSuggestionFocus(event, this.selectedIndex + 1);
            }
        }
    }

    setSuggestionFocus = (event:Event, index:number) => {
       
        const suggestions = this.list.children;
       
        this.removeSuggestionFocusedClassName(suggestions);

        if (index < 0 || !suggestions.length) {
            this.selectedIndex = -1;
            if (event && (event as Event).target !== this.input) {
                this.input.focus();
            }
            return;
        }

        if (index >= suggestions.length) {
            this.selectedIndex = suggestions.length - 1;
            this.setSuggestionFocus(event, this.selectedIndex);
            return;
        }

        const toFocus = suggestions[index] as HTMLElement;
        if (toFocus) {
            this.selectedIndex = index;
            toFocus.classList.add(this.attributeValues.suggestionFocusedClassName);
            toFocus.focus();
            return;
        }

        this.selectedIndex = -1;

    }

    removeSuggestionFocusedClassName(suggestions: HTMLCollection) {
        
        for (let i = 0; i < suggestions.length; i++) {
            suggestions[i].classList.remove(this.attributeValues.suggestionFocusedClassName);
        }
        
    }

    
    populateList = async (show_all:boolean = this.attributeValues.options.show_all_for_postcode)=>{
            
        const autocompleteOptions = new AutocompleteOptions();
            autocompleteOptions.all = show_all;
            autocompleteOptions.top = this.attributeValues.options.suggestion_count;
            autocompleteOptions.template = this.attributeValues.options.suggestion_template;
            if(this.attributeValues.options.filter){
                autocompleteOptions.filter = this.attributeValues.options.filter;
            }

            const query = this.input.value?.trim();
            const result = await this.client.autocomplete(query, autocompleteOptions);
            if(result.isSuccess){

                if(this.attributeValues.options.auto_cal_list_height){
                    this.list.style.removeProperty('max-height');
                }

                const computedListHeight = this.list.offsetHeight;
                const listChildCount = this.list.children.length;

                const success = result.toSuccess();
                const newItems:Node[] = [];

                if(success.suggestions.length)
                {
                    const showAllOption = !show_all && this.isPostcode(query);
                    const totalLength = showAllOption? success.suggestions.length+1:success.suggestions.length;

                    for(let i = 0; i< success.suggestions.length; i++){
                        
                        const li = this.getListItem(i,success.suggestions[i],totalLength);
                        newItems.push(li);
                    }
                    
                    if(showAllOption && success.suggestions.length)
                    {
                        const li = this.getShowAllListItem(this.list.children.length,totalLength);
                        newItems.push(li);
                    }

                    this.list.replaceChildren(...newItems);
                    
                    const toFocus = this.list.children[0] as HTMLElement;
                    if (toFocus) {
                        this.selectedIndex = 0;
                        toFocus.classList.add(this.attributeValues.suggestionFocusedClassName);
                    }

                    this.input.classList.add(this.attributeValues.inputShowClassName); 
                        
                    this.list.hidden = false;
                    this.input.setAttribute('aria-expanded', 'true');
                    this.list.setAttribute('aria-hidden', 'false');
                    
                    if(show_all)
                    {
                        this.list.classList.add(this.attributeValues.listClassNameShowAll); 
                    }


                    if(show_all && 
                        this.attributeValues.options.auto_cal_list_height 
                        && computedListHeight> 0
                        && listChildCount<this.list.children.length)
                    {
                        this.list.style.maxHeight = `${computedListHeight}px`;
                    }
                   

                    document.addEventListener('click', this.documentClick);
                    

                }
                else
                {
                    this.clearList(); 
                }
                SuggestionsEvent.dispatch(this.list,query, success.suggestions);
            }
            else
            {
                const failed = result.toFailed();
                SuggestionsFailedEvent.dispatch(this.list,query,failed.status,failed.message);
            }
    };

    clearList = ()=>{
        this.list.replaceChildren(...[]);
        this.list.hidden = true;
        this.input.setAttribute('aria-expanded', 'false');
        this.list.setAttribute('aria-hidden', 'true');
        this.selectedIndex = -1;
        this.input.classList.remove(this.attributeValues.inputShowClassName); 
        this.list.classList.remove(this.attributeValues.listClassNameShowAll); 
        document.removeEventListener('click', this.documentClick);
    };

    getListItem = (index:number,suggestion:Suggestion,length:number)=>
    {
        const li = document.createElement('LI');
        li.tabIndex = -1;
        li.className = this.attributeValues.suggestionClassName;
        if(this.attributeValues.suggestionAdditionalClassNames){
            for(const name of this.attributeValues.suggestionAdditionalClassNames){
                li.classList.add(name);
            }
        }
        li.id = this.attributeValues.getSuggestionId(index);

        let address = suggestion.address;
        if(this.attributeValues.options.highlight_suggestion)
        {
            const regexp = new RegExp(`\\b(${this.input.value.trim()})\\b`,"gi");
            address = address.replace(regexp, `${this.attributeValues.options.highlight_suggestion_start_tag}$1${this.attributeValues.options.highlight_suggestion_end_tag}`);
            li.innerHTML = address;
        }
        else{
            li.innerText = address;
        }

        li.dataset.id =suggestion.id;
        li.setAttribute('role', 'option');
        li.setAttribute('aria-posinset', `${index + 1}`);
        li.setAttribute('aria-setsize', `${length}`);
        
        return li;
    };

    getShowAllListItem = (index:number,length:number)=>
    {
        const li = document.createElement('LI');
        li.tabIndex = -1;
        li.className = this.attributeValues.suggestionClassName;
        li.id = this.attributeValues.getSuggestionId(index);
        li.innerHTML = `${this.attributeValues.options.show_all_for_postcode_start_tag}${this.attributeValues.options.show_all_for_postcode_text}${this.attributeValues.options.show_all_for_postcode_end_tag}`;
      
        li.setAttribute('role', 'option');
        li.setAttribute('aria-posinset', `${index + 1}`);
        li.setAttribute('aria-setsize', `${length}`);

        return li;
    };

    private  isPostcode = (text:string)=>{
        const pattern = '^(GIR ?0AA|[A-PR-UWYZ]([0-9]{1,2}|([A-HK-Y][0-9]([0-9ABEHMNPRV-Y])?)|[0-9][A-HJKPS-UW]) ?[0-9][ABD-HJLNP-UW-Z]{2})$';
        const patt = new RegExp(pattern, 'gi');
        return patt.test(text.trim());
    }

}