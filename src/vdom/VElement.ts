import { dataAttributePrefix, voidElementNames } from '../config/config';
import { camelCase, escapeAttributeValue, isUndefined, startsWith, unCamelCase } from '../util/Util';
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

    private attributes: AttributeStore;
    private _textContent: string;

    //#endregion

    //#region Constructor

    constructor(tagName: string) {
        super();

        this.tagName = tagName;
        this.attributes = new AttributeStore();
        this.classList = new VClassList(this.attributes);
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
        this.addDatasetProperty(attributeName, attributeValue);
        this.attributes.setAttribute(attributeName, attributeValue);
    }

    /**
     * Reads an attribute.
     * If the attribute does not exist,
     * null is returned.
     * @param attributeName - The name of the attribute
     */
    getAttribute(attributeName: string): string {
        const dataAttributeValue = this.getDatasetProperty(attributeName);

        if (!isUndefined(dataAttributeValue)) {
            return dataAttributeValue;
        }

        return this.attributes.getAttribute(attributeName);
    }

    /**
     * Checks if the given attribute
     * is present
     * @param attributeName - The name of the attribute
     */
    hasAttribute(attributeName: string): boolean {
        const hasDataAttribute = this.hasDatasetProperty(attributeName);

        if (hasDataAttribute) {
            return true;
        }

        return this.attributes.hasAttribute(attributeName);
    }

    /**
     * Removes the given attribute
     * @param attributeName - The name of the attribute
     */
    removeAttribute(attributeName: string): void {
        this.removeDatasetProperty(attributeName);
        this.attributes.removeAttribute(attributeName);
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

    private addDatasetProperty(attributeName: string, attributeValue: string): void {
        if (!this.isDataAttributeName(attributeName)) {
            return;
        }

        // if the attribute is a data-attribute
        // add it to the dataset with
        // the camelcased name
        const datasetPropertyName = this.createDatasetPropertyNameFromAttributeName(attributeName);
        this.dataset[datasetPropertyName] = attributeValue;
    }

    private getDatasetProperty(attributeName: string): string {
        if (!this.isDataAttributeName(attributeName)) {
            return;
        }

        // if the attribute is a data-attribute
        // read it from the dataset with
        // the camelcased property name
        const datasetPropertyName = this.createDatasetPropertyNameFromAttributeName(attributeName);
        return this.dataset[datasetPropertyName];
    }

    private hasDatasetProperty(attributeName: string): boolean {
        if (!this.isDataAttributeName(attributeName)) {
            return false;
        }

        const datasetPropertyName = this.createDatasetPropertyNameFromAttributeName(attributeName);
        return this.dataset.hasOwnProperty(datasetPropertyName);
    }

    private removeDatasetProperty(attributeName: string): void {
        if (!this.isDataAttributeName(attributeName) || !this.hasDatasetProperty(attributeName)) {
            return;
        }

        const datasetPropertyName = this.createDatasetPropertyNameFromAttributeName(attributeName);
        delete this.dataset[datasetPropertyName];
    }

    /**
     * Takes an attribute name and converts it
     * to a camelcased property name which may
     * be used inside the dataset
     * @param attributeName - The attribute name
     */
    private createDatasetPropertyNameFromAttributeName(attributeName: string): string {
        let datasetPropertyName = attributeName;

        if (this.isDataAttributeName(datasetPropertyName)) {
            // if the given attribute name is a data attribute
            // cut off the prefix
            datasetPropertyName = attributeName.slice(dataAttributePrefix.length);
        }

        return camelCase(datasetPropertyName);
    }

    /**
     * Checks if the given attributeName
     * starts with 'data-'
     * @param attributeName - The attribute name to check
     */
    private isDataAttributeName(attributeName: string): boolean {
        return startsWith(attributeName, dataAttributePrefix);
    }

    /**
     * Returns the elements attributes
     * as a string
     */
    private serializeAttributes(): string {
        const attributeMap = new Map<string, string>();

        this.attributes.forEach((attributeName: string, attributeValue: string) => {
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
