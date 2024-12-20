import AttributeValues from "./AttributeValues";
import  {Client, AutocompleteOptions, Suggestion } from '../node_modules/getaddress-api/lib/Index.js';
import { AddressSelectedEvent, AddressSelectedFailedEvent, SuggestionsEvent, SuggestionsFailedEvent } from "./Events";
import { Options } from "./Options";
import Input from "./Input";
import List from "./List";
import Container from "./Container";

export default class Autocomplete
{

    private filterTimer: ReturnType<typeof setTimeout> | undefined;
    private blurTimer: ReturnType<typeof setTimeout> | undefined;
    private selectedIndex = -1;
    private showAllClicked:boolean = false;
    private documentClick: any | undefined;
    private readonly input:Input;
    private readonly list:List;
    private readonly container:Container;

    constructor(inputElement:HTMLInputElement ,readonly client:Client, readonly attributeValues:AttributeValues)
    {
        this.input = new Input(inputElement,attributeValues,this.onInputFocus,this.onInputPaste);

        this.list = new List(attributeValues,this.onListMouseEnter,this.onListClick);
        
        this.container = new Container(attributeValues,this.onContainerKeyDown,this.onContainerKeyUp,this.onContainerFocusOut);

        this.build();
    }

    public destroy(){
        this.container.destroy();
        this.input.destroy();
        this.list.destroy();
    }

    private onInputFocus =  (event:any) => {
        this.container.addFocusedClassNames();
        
        if(this.attributeValues.options.select_on_focus){
            this.input.element.select();
        }
        this.selectedIndex = -1;
    };

    private onInputPaste = (event:any) => {
        setTimeout(()=>{this.populateList(false);},100);
    };

    private onContainerKeyUp = (event:KeyboardEvent) => {
        this.debug(event);
        this.handleKeyUp(event);
    };

    private onContainerKeyDown = (event:KeyboardEvent) => 
    {
        this.debug(event);
        this.keyDownHandler(event);
    };

    private onContainerFocusOut = (event:any) => 
    {
        this.handleComponentBlur(event, false);
    }

    private build()
    {
        this.documentClick = this.handleComponentBlur.bind(this);

        if(this.input.element.parentNode != null)
        {
            this.input.element.parentNode.insertBefore(this.container.element,this.input.element);
        }

        this.container.element.appendChild(this.input.element);

        this.container.element.appendChild(this.list.element);
    }

    private onListClick = (event:any) => {

        if (event.target !== this.list.element) 
        {
            const suggestions = Array.from(this.list.element.children);
            if (suggestions.length) 
            {
                    var element = event.target
                    
                    while(element instanceof HTMLElement && element.tagName !== "LI")
                    {
                        element = element.parentElement;
                    }

                    const suggestionIndex = suggestions.indexOf(element as HTMLElement);
                    this.handleSuggestionSelected(event, suggestionIndex);
            }
        }
    }

    private onListMouseEnter = (event:any) => {
        const suggestions = this.list.element.children;
        this.removeSuggestionFocusedClassName(suggestions);
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
        if (!this.list.element.hidden) {
            event.preventDefault();
            this.setSuggestionFocus(event, 0);
        }
    }

    handlePageDownKey = (event: KeyboardEvent) => {
        if (!this.list.element.hidden) {
            event.preventDefault();
            this.setSuggestionFocus(event, this.list.element.children.length -1);
        }
    }

    handleHomeKey = (event: KeyboardEvent) => {
        if (!this.list.element.hidden && event.target !== this.input.element) {
            event.preventDefault();
            this.setSuggestionFocus(event, 0);
        }
    }

    handleComponentBlur = (event: Event, force: boolean = false) =>{
        
        clearTimeout(this.blurTimer);

        const delay: number = force ? 0 : 100;
        this.blurTimer = setTimeout(() => {
            const activeElem = document.activeElement;

            if (!force &&
                activeElem &&
                this.container.element.contains(activeElem)
            ) {
                return;
            }
            
            if(!this.showAllClicked){
                this.clearList();
                this.container.removeFocusedClassNames();
                
            }
            this.showAllClicked = false;
            
        }, delay);
    }


    handleEndKey = (event: KeyboardEvent) => {
        if (!this.list.element.hidden) {
            const suggestions = this.list.element.children;
            if (suggestions.length) {
                event.preventDefault();
                this.setSuggestionFocus(event, suggestions.length - 1);
            }
        }
    }

    handleEnterKey = (event: KeyboardEvent) =>{
        if (!this.list.element.hidden) {
            event.preventDefault();
            if (this.selectedIndex > -1) {
                this.handleSuggestionSelected(event, this.selectedIndex);
            }
        }
    }

    handleSuggestionSelected = async (event: Event,  indexNumber:number)=>{
        
        this.setSuggestionFocus(event,indexNumber);
        this.showAllClicked = false;

        if(this.selectedIndex > -1 && this.list !== undefined )
        {
            const suggestions = this.list.element.children;
            const suggestion = suggestions[this.selectedIndex] as HTMLElement;
            
            if(suggestion.innerText === this.attributeValues.options.show_all_for_postcode_text)
            {
                this.showAllClicked = true;
                this.populateList(true);
                this.input.element.focus();
            }
            else if(!this.attributeValues.options.enable_get){
                this.clearList();
            }
            else
            {
                if(this.attributeValues.options.clear_list_on_select){
                    this.clearList();
                }

                const id = suggestion.dataset.id as string;
                const addressResult = await this.client.get(id,
                { 
                    remember : this.attributeValues.options.remember_last_search  
                });
                
                if(addressResult.isSuccess){
                    let success = addressResult.toSuccess();
                    
                    AddressSelectedEvent.dispatch(this.input.element,id,success.address);
                    
                    if(this.attributeValues.options.input_focus_on_select){
                        this.input.element.focus();
                        this.input.setSelectionRange();
                    }
                }
                else{
                    const failed = addressResult.toFailed();
                    AddressSelectedFailedEvent.dispatch(this.input.element,id,failed.status,failed.message);
                }
            } 
        }
    };

    

    

    handleKeyDownDefault = (event: KeyboardEvent)=>
    {
        let isPrintableKey = event.key.length === 1 || event.key === 'Unidentified';
        if(isPrintableKey){
            clearTimeout(this.filterTimer);
            
            this.filterTimer = setTimeout(() => 
            {
                if(this.attributeValues.options.minimum_characters && this.input.hasMinimumCharacters()){
                    this.populateList();
                }
                else{
                    this.clearList(); 
                }
            },this.attributeValues.options.delay);
        }
        else if(this.attributeValues.options.minimum_characters && !this.list.element.hidden && !this.input.hasMinimumCharacters())
        {
            this.clearList(); 
        }
    };

    handleKeyUp = (event: KeyboardEvent)=>
    {
        if(event.code === 'Backspace' || event.code === 'Delete')
        {

            const target =(event as Event).target
            if (target == this.input.element)
            {
                clearTimeout(this.filterTimer);

                this.filterTimer = setTimeout(() => 
                {
                    if(this.attributeValues.options.minimum_characters && !this.input.hasMinimumCharacters())
                    {
                        this.clearList(); 
                    }
                    else 
                    {
                        this.populateList();
                    }
                },this.attributeValues.options.delay);

            }
            else if(this.container.element.contains(target as HTMLElement))
            {
                this.input.element.focus();
                this.input.setSelectionRange();
            }
            
        }
    };


    handleUpKey(event: KeyboardEvent) {
        event.preventDefault();
        if (!this.list.element.hidden) {
            this.setSuggestionFocus(event, this.selectedIndex - 1);
        }
    }

    handleDownKey = (event: KeyboardEvent) => {
        event.preventDefault();

        if (!this.list.element.hidden) 
        {
            if (this.selectedIndex < 0) {
                this.setSuggestionFocus(event, 0);
            } 
            else {
                this.setSuggestionFocus(event, this.selectedIndex + 1);
            }
        }
    }

    setSuggestionFocus = (event:Event, index:number) => 
    {
        const suggestions = this.list.element.children;
    
        this.removeSuggestionFocusedClassName(suggestions);

        if (index < 0 || !suggestions.length) {
            this.selectedIndex = -1;
            if (event && (event as Event).target !== this.input.element) {
                this.input.element.focus();
            }
            return;
        }

        if (index >= suggestions.length) {
            this.selectedIndex = suggestions.length - 1;
            this.setSuggestionFocus(event, this.selectedIndex);
            return;
        }

        const focusedSuggestion = suggestions[index] as HTMLElement;
        if (focusedSuggestion) {
            this.selectedIndex = index;
            this.addSuggestionFocusedClassName(focusedSuggestion);
            focusedSuggestion.focus();
            return;
        }
        
        this.selectedIndex = -1;
    }

    addSuggestionFocusedClassName = (suggestion:HTMLElement)=> {
        suggestion.classList.add(this.attributeValues.suggestionFocusedClassName);
    }

    removeSuggestionFocusedClassName = (suggestions: HTMLCollection)=> {
        
        for (let i = 0; i < suggestions.length; i++) {
            suggestions[i].classList.remove(this.attributeValues.suggestionFocusedClassName);
        }
    }

    
    populateList = async (show_all:boolean = this.attributeValues.options.show_all_for_postcode ?? Options.show_all_for_postcode_defaut)=>{
            
            const autocompleteOptions:Partial<AutocompleteOptions> = {
                    all:show_all,
                    top:this.attributeValues.options.suggestion_count,
                    template:this.attributeValues.options.suggestion_template,
                    show_postcode:this.attributeValues.options.show_postcode
            };

            if(this.attributeValues.options.filter){
                autocompleteOptions.filter = this.attributeValues.options.filter;
            }
            
            const query = this.input.element.value?.trim();
            const result = await this.client.autocomplete(query, autocompleteOptions);
            if(result.isSuccess){

                if(this.attributeValues.options.auto_calc_list_height){
                    this.list.element.style.removeProperty('max-height');
                }

                const listChildCount = this.list.element.children.length;

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
                    
                    if(showAllOption 
                        && success.suggestions.length 
                        && (success.suggestions.length) === autocompleteOptions.top)
                    {
                        const li = this.getShowAllListItem(this.list.element.children.length,totalLength);
                        newItems.push(li);
                    }

                    this.list.element.replaceChildren(...newItems);
                    
                    const toFocus = this.list.element.children[0] as HTMLElement;
                    if (toFocus) {
                        this.selectedIndex = 0;
                        toFocus.classList.add(this.attributeValues.suggestionFocusedClassName);
                    }

                    this.input.addInputShowClassNames();
                        
                    this.list.element.hidden = false;
                    this.input.element.setAttribute('aria-expanded', 'true');
                    this.list.element.setAttribute('aria-hidden', 'false');
                    
                    if(show_all)
                    {
                        this.list.addShowAllClassNames();
                    }

                    if(show_all && 
                        this.attributeValues.options.auto_calc_list_height 
                        && this.list.element.offsetHeight > 0
                        && listChildCount<this.list.element.children.length)
                    {
                        this.list.element.style.maxHeight = `${this.list.element.offsetHeight}px`;
                    }

                    document.addEventListener('click', this.documentClick);
                }
                else
                {
                    this.clearList(); 
                }

                SuggestionsEvent.dispatch(this.input.element,query, success.suggestions);
            }
            else
            {
                const failed = result.toFailed();
                SuggestionsFailedEvent.dispatch(this.input.element,query,failed.status,failed.message);
            }
    };

    

    clearList = ()=>{

        this.list.clear();

        this.input.element.setAttribute('aria-expanded', 'false');
        this.selectedIndex = -1;

        this.input.removeInputShowClassNames();

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
            let regexvalue = this.input.element.value.trim().replace(/ /g,',* +')
            const regexp = new RegExp(`\\b(${regexvalue})`,"gi");
            address = address.replace(regexp, `${this.attributeValues.options.highlight_suggestion_start_tag}$1${this.attributeValues.options.highlight_suggestion_end_tag}`);
            li.innerHTML = address;
        }
        else
        {
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
        
        li.classList.add(this.attributeValues.suggestionShowAllClassName);
        
        if(this.attributeValues.suggestionShowAllAdditionalClassNames){
            for(const name of this.attributeValues.suggestionShowAllAdditionalClassNames){
                li.classList.add(name);
            }
        }

        if(this.attributeValues.suggestionAdditionalClassNames){
            for(const name of this.attributeValues.suggestionAdditionalClassNames){
                li.classList.add(name);
            }
        }

        li.id = this.attributeValues.getSuggestionId(index);
        li.innerText = this.attributeValues.options.show_all_for_postcode_text ?? Options.show_all_for_postcode_text_default;
      
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