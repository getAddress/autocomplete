import AttributeValues from "./AttributeValues";

export default class Container{

    private readonly container: HTMLElement = document.createElement('DIV');
    public element:HTMLElement = this.container;

    constructor(readonly attributeValues:AttributeValues, 
    readonly handleKeyDown : ((event:KeyboardEvent)=>void),
    readonly handleKeyUp : ((event:KeyboardEvent)=>void),
    readonly handleFocusOut : ((event:any)=>void))
    {
       this.build();
    }

    public destroy()
    {
        this.container.removeEventListener('keydown',this.handleKeyDown);
        this.container.removeEventListener('keyup',this.handleKeyUp);
        this.container.removeEventListener('focusout',this.handleFocusOut);

        const children = Array.from(this.container.childNodes);
        this.container.replaceWith(...children);
    }

    

    private  build()
    {
        this.container.id = this.attributeValues.containerId;
        this.container.className = this.attributeValues.containerClassName;
        
        if(this.attributeValues.containerAdditionalClassNames){
            for(const name of this.attributeValues.containerAdditionalClassNames){
                this.container.classList.add(name);
            }
        }

        this.container.addEventListener('focusout', this.handleFocusOut);
        this.container.addEventListener('keydown', this.handleKeyDown);
        this.container.addEventListener('keyup', this.handleKeyUp);
    }

    public addFocusedClassNames = () =>
    {
        this.container.classList.add(this.attributeValues.containerFocusedClassName);
        
        if(this.attributeValues.containerFocusedAdditionalClassNames){
            for(const name of this.attributeValues.containerFocusedAdditionalClassNames){
                this.container.classList.add(name);
            }
        }
    }

    public removeFocusedClassNames = () =>
    {
        this.container.classList.remove(this.attributeValues.containerFocusedClassName);
        if(this.attributeValues.containerFocusedAdditionalClassNames){
            for(const name of this.attributeValues.containerFocusedAdditionalClassNames){
                this.container.classList.remove(name);
            }
        }
    };
}