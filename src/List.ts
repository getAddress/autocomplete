import AttributeValues from "./AttributeValues";

export default class List
{
    private readonly list: HTMLElement = document.createElement('UL');
    public element:HTMLElement = this.list;

    constructor(readonly attributeValues:AttributeValues,
    readonly handleMouseEnter : ((event:any)=>void),
    readonly handleClick : ((event:any)=>void))
    {
       this.build();
    }

    private build()
    {
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

        this.list.addEventListener('mouseenter', this.handleMouseEnter);
       
        this.list.addEventListener('click', this.handleClick);
    }

    public destroy()
    {
       this.list.remove(); 

       this.list.removeEventListener('mouseenter',this.handleMouseEnter);
       this.list.removeEventListener('click',this.handleClick);
    }


    public clear = ()=>{

        this.list.replaceChildren(...[]);
        this.list.hidden = true;
        this.list.setAttribute('aria-hidden', 'true');

        this.removeShowAllClassNames();
    };

    public removeShowAllClassNames =()=>{

        this.list.classList.remove(this.attributeValues.listShowAllClassName); 
        if(this.attributeValues.listShowAllAdditionalClassNames){
            for(const name of this.attributeValues.listShowAllAdditionalClassNames){
                this.list.classList.remove(name);
            }
        }
    }

    public addShowAllClassNames =()=>{

            this.list.classList.add(this.attributeValues.listShowAllClassName); 
            if(this.attributeValues.listShowAllAdditionalClassNames){
                for(const name of this.attributeValues.listShowAllAdditionalClassNames){
                    this.list.classList.add(name);
                }
            }
    }
}