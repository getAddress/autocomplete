import AttributeValues from "./AttributeValues";

export default class Input
{
    constructor(readonly input:HTMLInputElement,
    readonly attributeValues:AttributeValues,
    readonly handleFocus : ((event:any)=>void), 
    readonly handlePaste : ((event:any)=>void))
    {
        this.build();
    }

    private build()
    {
        
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
        
        this.input.addEventListener('focus', this.handleFocus);
        this.input.addEventListener('paste', this.handlePaste);

    }

    public destroy(){

        this.input.classList.remove(this.attributeValues.inputClassName);

        if(this.attributeValues.inputAdditionalClassNames){
            for(const name of this.attributeValues.inputAdditionalClassNames){
                this.input.classList.remove(name);
            }
        }

        this.removeInputShowClassNames();

        this.input.removeAttribute('aria-expanded');
        this.input.removeAttribute('autocomplete');
        this.input.removeAttribute('aria-autocomplete');
        this.input.removeAttribute('role');
        this.input.removeAttribute('aria-owns');

        this.input.removeEventListener('focus',this.handleFocus);
        this.input.removeEventListener('paste',this.handlePaste);
    }


    public element:HTMLInputElement = this.input;


    public removeInputShowClassNames =()=>{
        
        this.input.classList.remove(this.attributeValues.inputShowClassName); 
        
        if(this.attributeValues.inputShowAdditionalClassNames){
            for(const name of this.attributeValues.inputShowAdditionalClassNames){
                this.input.classList.remove(name);
            }
        }
    }

    public addInputShowClassNames =()=>{
        this.input.classList.add(this.attributeValues.inputShowClassName); 
        if(this.attributeValues.inputShowAdditionalClassNames){
            for(const name of this.attributeValues.inputShowAdditionalClassNames){
                this.input.classList.add(name);
            }
        }
    }

    public hasMinimumCharacters = ()=>{

        var minimumCharacters = this.attributeValues.options?.minimum_characters ?? 2;
        return this.input.value.length >= minimumCharacters;
    };
    
    public setSelectionRange = ()=>{
         this.input.setSelectionRange(this.input.value.length,this.input.value.length+1);
    }

}