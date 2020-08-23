import { isVoidElement } from '../elements/VoidElements';
import { camelCase, escapeAttributeValue, startsWith } from '../util/Util';
import AttributeStore from './AttributeStore';
import VClassList from './VClassList';
import VDataSet from './VDataSet';
import VNode from './VNode';
import VStyle from './VStyle';
import VTextNode from './VTextNode';

export default class VElement extends VNode {

    //#region Public Properties

    tagName: string;
    classList: VClassList;
    dataset: VDataSet;
    style: VStyle;

    //#region Id

    get id(): string {
        return this.attributes.getAttribute('id');
    }

    set id(id: string) {
        this.attributes.setAttribute('id', id);
    }

    get innerHTML(): string {
        return this.stringifyChildren();
    }

    get textContent(): string {
        return this._textContent;
    }

    set textContent(textContent: string) {
        this.children.forEach((childNode: VNode) => {
            this.removeChild(childNode);
        });

        this.appendChild(new VTextNode(textContent));
    }

    //#endregion

    //#endregion

    //#region Private Properties

    private attributes: AttributeStore;
    private _textContent: string;

    //#endregion

    //#region Constructor

    constructor(tagName: string) {
        super();

        this.tagName = tagName;
        this.classList = new VClassList();
        this.attributes = new AttributeStore();
        this.dataset = new VDataSet();
        this.style = new VStyle();
    }

    //#endregion

    //#region Public Methods

    /**
     * Sets an attribute
     * @param attributeName - The name of the attribute
     * @param attributeValue - The value of the attribute
     */
    setAttribute(attributeName: string, attributeValue: string): void {
        const dataAttributePrefix = 'data-';

        if (startsWith(attributeName, dataAttributePrefix)) {
            // if the attribute is a data-attribute
            // add it to the dataset object with the camelcased
            // name
            const dataAttributeName = attributeName.slice(dataAttributePrefix.length);
            const camelCasedDataAttributeName = camelCase(dataAttributeName);
            this.dataset[camelCasedDataAttributeName] = attributeValue;
        }

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

    toString() {
        let html = `<${this.tagName}${this.stringifyAttributes()}>`;

        if (!isVoidElement(this.tagName)) {
            html += `${this._textContent ? this._textContent : this.stringifyChildren()}</${this.tagName}>`;
        }

        return html;
    }

    //#endregion

    //#region Private Methods

    private stringifyAttributes() {
        const attributeList = [];

        this.attributes.foreach((attributeName: string, attributeValue: string) => {
            const escapedAttributeValue = escapeAttributeValue(attributeValue);
            attributeList.push(`${attributeName}="${escapedAttributeValue}"`);
        });

        return attributeList.length ? (' ' + attributeList.join(' ')) : '';
    }

    private stringifyChildren() {
        const stringifiedChildren = [];

        this.children.forEach((node: VNode) => {
            stringifiedChildren.push(node.toString());
        });

        return stringifiedChildren.join('');
    }

    //#endregion
}
