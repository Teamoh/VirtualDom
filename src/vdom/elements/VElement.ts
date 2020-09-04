import { voidElementNames } from '../../config/config';
import { escapeAttributeValue } from '../../util/Util';
import AttributeProxy from '../attributes/AttributeProxy';
import NodeComparisonResult from '../NodeComparisonResult';
import VStyle from '../styles/VStyle';
import VClassList from '../VClassList';
import VDataSet from '../VDataSet';
import VNode from '../VNode';
import VTextNode from '../VTextNode';
import { elementRegistry } from './ElementRegistry';

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
    // private instances: Array<HTMLElement>;

    //#endregion

    //#region Constructor

    constructor(tagName: string) {
        super();

        this.tagName = tagName;
        this.classList = new VClassList();
        this.style = new VStyle();
        this.dataset = new VDataSet();
        this.attributeProxy = new AttributeProxy(this.classList, this.style, this.dataset);
        // this.instances = [];
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

    /**
     * Converts the virtual element
     * to an actual HTMLElement
     */
    toNode(): HTMLElement {
        if (!document) {
            throw new ReferenceError('Method toNode requires a browser environment');
        }

        const element = document.createElement(this.tagName);

        // set elements attributes
        this.attributeProxy.forEach((attributeName: string, attributeValue: string) => {
            element.setAttribute(attributeName, attributeValue);
        });

        // append child elements
        this.childNodes.forEach(childNode => {
            element.appendChild((childNode as (VElement | VTextNode)).toNode());
        });

        // set _vid so the node can be identified
        (element as any)._vid = this._vid;

        // store the element in the element registry
        elementRegistry.register(this._vid, element);

        // store the create element as an instance of the virtual element
        // this.instances.push(element);

        return element;
    }

    /**
     * Compares the virtual element
     * with a given html element
     * and returns an ElementComparisonResult
     * @param element - The HTML element
     */
    compare(element: HTMLElement): NodeComparisonResult {
        if (!element) {
            return null;
        }

        const comparisonResult = new NodeComparisonResult();

        this.compareAttributes(element, comparisonResult);
        this.compareChildNodes(element, comparisonResult);

        return comparisonResult;
    }

    patch(element: HTMLElement): void {
        const comparisonResult = this.compare(element);

        // patch added attributes
        comparisonResult.addedAttributes.forEach((addedAttribute: string) => {
            element.setAttribute(addedAttribute, this.getAttribute(addedAttribute));
        });

        // patch changed attributes
        comparisonResult.changedAttributes.forEach((changedAttribute: string) => {
            element.setAttribute(changedAttribute, this.getAttribute(changedAttribute));
        });

        // patch removed attributes
        comparisonResult.removedAttributes.forEach((removedAttribute: string) => {
            element.removeAttribute(removedAttribute);
        });

        // patch child nodes
        for (let i = 0; i < element.childNodes.length; i++) {
            const currentChildNode = element.childNodes[i];

            if (!this.childNodes[i]) {
                // there is no node at the current index
                // in the virtual DOM so remove the element
                // in the real DOM
                currentChildNode.parentNode.removeChild(currentChildNode);
                i--;
                continue;
            }

            const currentChildNodeVId = (currentChildNode as any)._vid;

            if (currentChildNodeVId === this.childNodes[i]._vid) {
                // current DOM node and vDOM node match
                // so keep it as it is
                continue;
            }

            // at this point the elements position
            // is not matching the position in the vDOM
            // so the element is removed from the DOM

            // TODO: remove element form DOM

            const instance = elementRegistry.getElement(currentChildNodeVId);

            // TODO update element order
        }
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

    /**
     * Compares the elements
     * attributes with the given HTMLElement
     * and fills the comparison result
     * @param element - The HTMLElement
     * @param comparisonResult - The comparison result
     */
    private compareAttributes(element: HTMLElement, comparisonResult: NodeComparisonResult) {
        // iterate over the virtual attributes
        // to get the added and changed attributes
        this.attributeProxy.forEach((attributeName: string, attributeValue: string) => {
            if (!element.hasAttribute(attributeName)) {
                comparisonResult.addedAttributes.add(attributeName);
                return;
            }

            const domAttributeValue = element.getAttribute(attributeName);
            const isSameValue = domAttributeValue === attributeValue;

            if (!isSameValue) {
                comparisonResult.changedAttributes.add(attributeName);
            }
        });

        // iterate over the DOM attributes
        // to get the removed attributes
        for (let i = 0, iLen = element.attributes.length; i < iLen; i++) {
            const currentAttributeName = element.attributes[i].name;

            if (!this.hasAttribute(currentAttributeName)) {
                comparisonResult.removedAttributes.add(currentAttributeName);
            }
        }
    }

    /**
     * Compares the elements
     * child nodes with the given HTMLElement
     * and fills the comparison result
     * @param element - The HTMLElement
     * @param comparisonResult - The comparison result
     */
    private compareChildNodes(element: HTMLElement, comparisonResult: NodeComparisonResult) {
        const htmlElementChildNodeVIds: Array<string> = [];
        const vElementChildNodeVIds: Array<string> = [];

        element.childNodes.forEach(childNode => {
            htmlElementChildNodeVIds.push((childNode as any)._vid);
        });

        this.childNodes.forEach(childNode => {
            const vId = childNode._vid;

            vElementChildNodeVIds.push(vId);

            // Check if the vId is already a childNode of the HTMLElement.
            // If not, the node is new in the virtual DOM.

            if (htmlElementChildNodeVIds.indexOf(vId) === -1) {
                comparisonResult.addedChildNodes.add(vId);
            }
        });

        htmlElementChildNodeVIds.forEach(vId => {
            // check if the HTMLElement has a child node
            // which is not available in the virtual DOM.
            // If so, this node was removed in the virtual DOM.

            if (vElementChildNodeVIds.indexOf(vId) === -1) {
                comparisonResult.removedChildNodes.add(vId);
            }
        });
    }

    //#endregion
}
