export default class ElementComparisonResult {

    //#region Public Properties

    addedAttributes: Set<string>;
    changedAttributes: Set<string>;
    removedAttributes: Set<string>;

    //#endregion

    //#region Constructor

    constructor() {
        this.addedAttributes = new Set();
        this.changedAttributes = new Set();
        this.removedAttributes = new Set();
    }

    //#endregion
}
