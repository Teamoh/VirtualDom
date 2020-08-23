import { isString } from '../util/Util';
import VElement from './VElement';
import VNode from './VNode';

export default class VDocument extends VNode {

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

        this.children.forEach((childNode: VNode) => {
            resultHtml += childNode.toString();
        });

        return resultHtml;
    }

    //#endregion

    //#region Private Methods

    private iterateTreeRecursively(rootNode: VNode, callback: (node: VNode) => void) {
        callback.call(this, rootNode);

        if (!rootNode.children.length) {
            return;
        }

        rootNode.children.forEach((childNode: VNode) => {
            callback.call(this, childNode);
            this.iterateTreeRecursively(childNode, callback);
        });
    }

    //#endregion

}
