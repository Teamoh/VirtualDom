import { dataAttributePrefix, voidElementNames } from '../config/config';
import { escapeAttributeValue, unCamelCase } from '../util/Util';
import AttributeProxy from './attributes/AttributeProxy';
import VStyle from './styles/VStyle';
import VClassList from './VClassList';
import VDataSet from './VDataSet';
import VNode from './VNode';
import VTextNode from './VTextNode';

export default class VElement extends VNode {

    //#region Public Properties

    tagName: string;
    classList: VClassList;
    dataset: VDataSet;
    style: VStyle;

    //#region Id

    get id(): string {
        return this.attributeProxy.getAttribute('id');
    }

    set id(id: string) {
        this.attributeProxy.setAttribute('id', id);
    }

    get innerHTML(): string {
        return this.stringifyChildren();
    }

    get outerHTML(): string {
        return this.toString();
    }

    get textContent(): string {
        return this._textContent;
    }

    set textContent(textContent: string) {
        this.childNodes.forEach((childNode: VNode) => {
            this.removeChild(childNode);
        });

        this.appendChild(new VTextNode(textContent));
    }

    //#endregion

    //#endregion

    //#region Private Properties

    private attributeProxy: AttributeProxy;
    private _textContent: string;

    //#endregion

    //#region Constructor

    constructor(tagName: string) {
        super();

        this.tagName = tagName;
        this.classList = new VClassList();
        this.dataset = new VDataSet();
        this.attributeProxy = new AttributeProxy(this.classList, this.dataset);
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
        this.attributeProxy.setAttribute(attributeName, attributeValue);
    }

    /**
     * Reads an attribute.
     * If the attribute does not exist,
     * null is returned.
     * @param attributeName - The name of the attribute
     */
    getAttribute(attributeName: string): string {
        return this.attributeProxy.getAttribute(attributeName);
    }

    /**
     * Checks if the given attribute
     * is present
     * @param attributeName - The name of the attribute
     */
    hasAttribute(attributeName: string): boolean {
        return this.attributeProxy.hasAttribute(attributeName);
    }

    /**
     * Removes the given attribute
     * @param attributeName - The name of the attribute
     */
    removeAttribute(attributeName: string): void {
        return this.attributeProxy.removeAttribute(attributeName);
    }

    /**
     * Renders the element and its children as HTML
     */
    toString(): string {
        let html = `<${this.tagName}${this.serializeAttributes()}>`;

        if (!this.isVoidElement()) {
            html += `${this._textContent ? this._textContent : this.stringifyChildren()}</${this.tagName}>`;
        }

        return html;
    }

    /**
     * Checks if the element is a void element
     * (self closing element)
     */
    isVoidElement(): boolean {
        return voidElementNames.indexOf(this.tagName) !== -1;
    }

    //#endregion

    //#region Private Methods

    /**
     * Returns the elements attributes
     * as a string
     */
    private serializeAttributes(): string {
        const attributeMap = new Map<string, string>();

        this.attributeProxy.forEach((attributeName: string, attributeValue: string) => {
            attributeMap.set(attributeName, attributeValue);
        });

        /**
         * Override the normal attributes with the data attributes.
         * Because the data attributes are stored within a loose object
         * they should take priority over the normal attributes
         * which are controlled by methods which will always synchronize
         * the dataset.
         */
        this.dataset.forEach((dataAttributeName: string, dataAttributeValue: string) => {
            // un-camelcase the property name
            const unCamelCasedName = unCamelCase(dataAttributeName);
            const prefixedName = dataAttributePrefix + unCamelCasedName;
            attributeMap.set(prefixedName, dataAttributeValue);
        });

        const attributesList = [];

        attributeMap.forEach((attributeValue: string, attributeName: string) => {
            const escapedAttributeValue = escapeAttributeValue(attributeValue);
            attributesList.push(`${attributeName}="${escapedAttributeValue}"`);
        });

        return attributesList.length ? (' ' + attributesList.join(' ')) : '';
    }

    /**
     * Returns the elements children
     * as a string
     */
    private stringifyChildren(): string {
        const stringifiedChildren = [];

        this.childNodes.forEach((node: VNode) => {
            stringifiedChildren.push(node.toString());
        });

        return stringifiedChildren.join('');
    }

    //#endregion
}
