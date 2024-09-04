export default class List {
    constructor(attributeValues, handleMouseEnter, handleClick) {
        this.attributeValues = attributeValues;
        this.handleMouseEnter = handleMouseEnter;
        this.handleClick = handleClick;
        this.list = document.createElement('UL');
        this.element = this.list;
        this.clear = () => {
            this.list.replaceChildren(...[]);
            this.list.hidden = true;
            this.list.setAttribute('aria-hidden', 'true');
            this.removeShowAllClassNames();
        };
        this.removeShowAllClassNames = () => {
            this.list.classList.remove(this.attributeValues.listShowAllClassName);
            if (this.attributeValues.listShowAllAdditionalClassNames) {
                for (const name of this.attributeValues.listShowAllAdditionalClassNames) {
                    this.list.classList.remove(name);
                }
            }
        };
        this.addShowAllClassNames = () => {
            this.list.classList.add(this.attributeValues.listShowAllClassName);
            if (this.attributeValues.listShowAllAdditionalClassNames) {
                for (const name of this.attributeValues.listShowAllAdditionalClassNames) {
                    this.list.classList.add(name);
                }
            }
        };
        this.build();
    }
    build() {
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
        this.list.addEventListener('mouseenter', this.handleMouseEnter);
        this.list.addEventListener('click', this.handleClick);
    }
    destroy() {
        this.list.remove();
        this.list.removeEventListener('mouseenter', this.handleMouseEnter);
        this.list.removeEventListener('click', this.handleClick);
    }
}
//# sourceMappingURL=List.js.map