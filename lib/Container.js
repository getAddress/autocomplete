export default class Container {
    constructor(attributeValues, handleKeyDown, handleKeyUp, handleFocusOut) {
        this.attributeValues = attributeValues;
        this.handleKeyDown = handleKeyDown;
        this.handleKeyUp = handleKeyUp;
        this.handleFocusOut = handleFocusOut;
        this.container = document.createElement('DIV');
        this.element = this.container;
        this.addFocusedClassNames = () => {
            this.container.classList.add(this.attributeValues.containerFocusedClassName);
            if (this.attributeValues.containerFocusedAdditionalClassNames) {
                for (const name of this.attributeValues.containerFocusedAdditionalClassNames) {
                    this.container.classList.add(name);
                }
            }
        };
        this.removeFocusedClassNames = () => {
            this.container.classList.remove(this.attributeValues.containerFocusedClassName);
            if (this.attributeValues.containerFocusedAdditionalClassNames) {
                for (const name of this.attributeValues.containerFocusedAdditionalClassNames) {
                    this.container.classList.remove(name);
                }
            }
        };
        this.build();
    }
    destroy() {
        this.container.removeEventListener('keydown', this.handleKeyDown);
        this.container.removeEventListener('keyup', this.handleKeyUp);
        this.container.removeEventListener('focusout', this.handleFocusOut);
        const children = Array.from(this.container.childNodes);
        this.container.replaceWith(...children);
    }
    build() {
        this.container.id = this.attributeValues.containerId;
        this.container.className = this.attributeValues.containerClassName;
        if (this.attributeValues.containerAdditionalClassNames) {
            for (const name of this.attributeValues.containerAdditionalClassNames) {
                this.container.classList.add(name);
            }
        }
        this.container.addEventListener('focusout', this.handleFocusOut);
        this.container.addEventListener('keydown', this.handleKeyDown);
        this.container.addEventListener('keyup', this.handleKeyUp);
    }
}
//# sourceMappingURL=Container.js.map