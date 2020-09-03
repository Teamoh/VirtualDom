import { toBoolean } from '../util/Util';

export default class NodeComparisonResult {

    //#region Public Properties

    get needsUpdate(): boolean {
        if (this.forceUpdate) {
            return true;
        }

        return toBoolean(
            this.addedAttributes.size
            || this.changedAttributes.size
            || this.removedAttributes.size
            || this.addedChildNodes.size
            || this.removedChildNodes.size);
    }

    addedAttributes: Set<string>;
    changedAttributes: Set<string>;
    removedAttributes: Set<string>;
    addedChildNodes: Set<string>;
    removedChildNodes: Set<string>;

    //#endregion

    //#region Private Properties

    private forceUpdate: boolean;

    //#endregion

    //#region Constructor

    constructor(forceUpdate?: boolean) {
        this.forceUpdate = toBoolean(forceUpdate);

        this.addedAttributes = new Set();
        this.changedAttributes = new Set();
        this.removedAttributes = new Set();
        this.addedChildNodes = new Set();
        this.removedChildNodes = new Set();
    }

    //#endregion
}
