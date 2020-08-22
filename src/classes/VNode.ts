export default class VNode {
    //#region Properties

    children: Array<VNode>;

    //#endregion

    //#region Constructor

    constructor() {
        this.children = [];
    }

    //#endregion

    //#region Public Methods

    appendChild(node: VNode) {
        this.children.push(node);
    }

    //#endregion
}
