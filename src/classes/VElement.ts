import AttributeStore from './AttributeStore';
import VClassList from './VClassList';
import VNode from './VNode';
import VStyle from './VStyle';

export default class VElement extends VNode {

    //#region Public Properties

    tagName: string;
    classList: VClassList;
    style: VStyle;

    //#region Id

    get id(): string {
        return this.attributes.getAttribute('id');
    }

    set id(id: string) {
        this.attributes.setAttribute('id', id);
    }

    //#endregion

    //#endregion

    //#region Private Properties

    private attributes: AttributeStore;

    //#endregion

    //#region Constructor

    constructor(tagName: string) {
        super();

        this.tagName = tagName;
        this.classList = new VClassList();
        this.style = new VStyle();
        this.attributes = new AttributeStore();
    }

    //#endregion

    //#region Public Methods

    /**
     * Sets an attribute
     * @param attributeName - The name of the attribute
     * @param attributeValue - The value of the attribute
     */
    setAttribute(attributeName: string, attributeValue: string): void {
        this.attributes.setAttribute(attributeName, attributeValue);
    }

    /**
     * Reads an attribute.
     * If the attribute does not exist,
     * null is returned.
     * @param attributeName - The name of the attribute
     */
    getAttribute(attributeName: string): string {
        return this.attributes.getAttribute(attributeName);
    }

    /**
     * Checks if the given attribute
     * is present
     * @param attributeName - The name of the attribute
     */
    hasAttribute(attributeName: string): boolean {
        return this.attributes.hasAttribute(attributeName);
    }

    /**
     * Removes the given attribute
     * @param attributeName - The name of the attribute
     */
    removeAttribute(attributeName: string): void {
        this.attributes.removeAttribute(attributeName);
    }

    //#endregion

    //#region Private Methods

    //#endregion
}
