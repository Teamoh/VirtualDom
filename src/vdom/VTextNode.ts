import NodeComparisonResult from './NodeComparisonResult';
import VNode from './VNode';

export default class VTextNode extends VNode {

    // #region Public Properties

    text: string;

    //#endregion

    //#region Constructor

    constructor(text: string) {
        super();

        this.text = text;
    }

    //#endregion

    //#region Public Methods

    /**
     * Returns the text content
     * of the text node
     */
    toString() {
        return this.text;
    }

    /**
     * Converts the text node
     * to an actual DOM Text node
     */
    toNode(): Text {
        if (!document) {
            throw new ReferenceError('Method toNode requires a browser environment');
        }

        const textNode = document.createTextNode(this.text);

        (textNode as any)._vid = this._vid;

        return textNode;
    }

    /**
     * Compares the DOM text node
     * with the virtual ndoe
     * @param textNode - The text node
     * to compare
     */
    compare(textNode: Text): NodeComparisonResult {
        if (this.text !== textNode.textContent) {
            return new NodeComparisonResult(true);
        }

        return new NodeComparisonResult();
    }

    //#endregion
}
