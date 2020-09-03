import { isString, isFunction } from '../util/Util';
import VElement from './elements/VElement';
import VNode from './VNode';
import VTextNode from './VTextNode';

export default class VRoot extends VNode {

    //#region Public Properties

    //#endregion

    //#region Constructor

    constructor() {
        super();
    }

    //#endregion

    //#region Public Methods

    /**
     * Creates a new element with the given element name
     * @param elementName - The name of the element
     */
    createElement(elementName: string): VElement {
        if (!elementName || !isString(elementName)) {
            throw new TypeError('elementName must be a string');
        }

        return new VElement(elementName);
    }

    toString(): string {
        let resultHtml = '';

        this.childNodes.forEach((childNode: VNode) => {
            resultHtml += childNode.toString();
        });

        return resultHtml;
    }

    /**
     * Searches an element with the given ID recursively.
     * If no element can be found, null is returned.
     * @param id - The ID to search
     */
    getElementById(id: string): VElement | null {
        if (!id) {
            return null;
        }

        let result = null;

        this.iterate((node: VNode) => {
            if (!(node instanceof VElement)) {
                return;
            }

            if (node.id === id) {
                result = node;
                // node with the given id
                // was found so stop iteration
                return true;
            }

            return false;
        });

        return result;
    }

    /**
     * Converts the VRoot to
     * a document fragment
     */
    toDocumentFragment(): DocumentFragment {
        if (!document) {
            throw new ReferenceError('Method toDocumentFragment requires a browser environment');
        }

        const documentFragment = document.createDocumentFragment();

        this.childNodes.forEach(childNode => {
            documentFragment.appendChild((childNode as (VElement | VTextNode)).toNode());
        });

        return documentFragment;
    }

    getNodeByVId(vid: string): VNode | null {
        if (!vid) {
            return null;
        }

        let result = null;

        this.iterate((node: VNode) => {
            if (!(node instanceof VElement)) {
                return;
            }

            if (node._vid === vid) {
                result = node;
                // node with the given vid
                // was found so stop iteration
                return true;
            }

            return false;
        });

        return result;
    }

    //#endregion

    //#region Private Methods

    /**
     * Iterates over the complete tree
     * recursively and executes the given
     * callback foreach node.
     * @param callback - The callback which
     * is executed for each node. If the callback
     * returns a truthy value, the iteration
     * process will be stopped.
     */
    private iterate(callback: (node: VNode) => boolean): void {
        if (!isFunction(callback)) {
            return;
        }

        // local helper function which is executed recursively
        const iterateChildren = (childNodes: Array<VNode>): VElement | null => {
            if (!childNodes || !childNodes.length) {
                return null;
            }

            for (let i = 0, iLen = childNodes.length; i < iLen; i++) {
                const currentNode = childNodes[i];
                const result = callback.call(currentNode, currentNode);

                if (result) {
                    // callback returned a truthy
                    // result so iteration is stopped
                    return;
                }

                iterateChildren(currentNode.childNodes);
            }

            return null;
        };

        iterateChildren(this.childNodes);
    }

    //#endregion

}
