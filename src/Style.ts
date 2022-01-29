import AttributeValues from "./AttributeValues";

export default class Style{

    constructor(readonly attributeValues:AttributeValues){

    }

    css= `
    .${this.attributeValues.containerClassName}
    {
        position: relative;
        outline: 0;
    }
    
    
    .${this.attributeValues.inputClassName} {
        
        width: 100%;
        box-sizing: border-box;
    }
    
    .${this.attributeValues.listClassName}
    {
        list-style: none;
        z-index: 99999;
        padding: 3px;
        border: 1px solid #606060;
        margin: 0;
        margin-top: -1px;
        overflow-y:auto;
        box-sizing: border-box;
        background-color: #fff;
    }

    .${this.attributeValues.listClassName}:focus {
        border: none;
        outline: none;
        box-shadow: none;
     }

    .${this.attributeValues.suggestionClassName}:hover,
    .${this.attributeValues.suggestionFocusedClassName} {
         background: #f3f3f3; 
         cursor: pointer;
         outline:0;
    }
    .${this.attributeValues.suggestionShowAllClassName}{
       
    }

    `;
    cssNoListWidth = 
    `
    .${this.attributeValues.containerFocusedClassName}{
       
    }
    .${this.attributeValues.inputShowClassName} {
        
        outline: 0;
        border: 1px solid #606060;
        border-bottom: none;
    }
    .${this.attributeValues.listClassName}
    {
        border-top: 1px dotted #ccc;
        position: absolute;
        left: 0px;
        right: 0px
    }
    `;
    cssWithListWidth = 
    `
    .${this.attributeValues.listClassName}
    {
        width:${this.attributeValues.options.list_width};
        margin-top: 1px;
    }
    `;

    inject = ()=> 
    {
        if (typeof document === 'undefined') return
      
        const head = document.head || document.getElementsByTagName('head')[0]
        const style = document.createElement('style')

        const allCss = this.getCss();

        style.appendChild(document.createTextNode(allCss))
      
        if (head.firstChild) 
        {
            head.insertBefore(style, head.firstChild)
        } 
        else 
        {
        head.appendChild(style)
        }
    }

    private getCss(){
        if(!this.attributeValues.options.list_width){
            return `${this.css} \n ${this.cssNoListWidth}`;
        }
        return `${this.css} \n ${this.cssWithListWidth}`;
    }
}