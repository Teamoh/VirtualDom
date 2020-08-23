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

    toString() {
        return this.text;
    }

    //#endregion
}
