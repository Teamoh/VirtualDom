import { isString } from '../util/Util';
import VElement from './VElement';
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
        if (!elementName || !isString(elementName)) {
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

        // local helper function which is executed recursively
        const searchChildren = (childNodes: Array<VNode>, idToSearch: string): VElement | null => {
            if (!childNodes || !childNodes.length) {
                return null;
            }

            for (let i = 0, iLen = childNodes.length; i < iLen; i++) {
                const currentNode = childNodes[i];

                if (!(currentNode instanceof VElement)) {
                    continue;
                }

                if (currentNode.id === idToSearch) {
                    return currentNode;
                }

                const matchingChild = searchChildren(currentNode.childNodes, idToSearch);

                if (matchingChild) {
                    return matchingChild;
                }
            }

            return null;
        };

        const element = searchChildren(this.childNodes, id);

        return element;
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

    //#endregion

    //#region Private Methods

    private iterateTreeRecursively(rootNode: VNode, callback: (node: VNode) => void) {
        callback.call(this, rootNode);

        if (!rootNode.childNodes.length) {
            return;
        }

        rootNode.childNodes.forEach((childNode: VNode) => {
            callback.call(this, childNode);
            this.iterateTreeRecursively(childNode, callback);
        });
    }

    //#endregion

}
