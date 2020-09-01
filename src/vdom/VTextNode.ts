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
        return textNode;
    }

    //#endregion
}
