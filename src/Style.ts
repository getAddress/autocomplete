import AttributeValues from "./AttributeValues";

export default class Style{

    constructor(readonly attributeValues:AttributeValues){

    }

    css= `
    .${this.attributeValues.containerClassName}
    {
        display: flex;
        flex-direction: column;
    }
    
    .${this.attributeValues.containerFocusedClassName}{
        outline: -webkit-focus-ring-color auto 1px;
    }

    .${this.attributeValues.inputClassName} {
        outline:0;
    }
    
    .${this.attributeValues.inputShowClassName} {
        border: 2px solid transparent;
        border-bottom: none;
    }

    .${this.attributeValues.listClassName}
    {
        list-style: none;
        z-index: 99999;
        padding: 3px;
        border: 1px solid #606060;
        border-top: 1px dotted #ccc;
        margin: 0;
        margin-top: -1px;
        max-height:${this.attributeValues.options.max_list_height};
        overflow-y:auto;
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
    `;
    inject = ()=> 
    {
        if (typeof document === 'undefined') return
      
        const head = document.head || document.getElementsByTagName('head')[0]
        const style = document.createElement('style')
        style.appendChild(document.createTextNode(this.css))
      
        if (head.firstChild) 
        {
            head.insertBefore(style, head.firstChild)
        } 
        else 
        {
        head.appendChild(style)
        }
      }
}