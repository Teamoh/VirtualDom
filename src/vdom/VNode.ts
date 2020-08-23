export default class VNode {
    //#region Properties

    parentNode: VNode;
    children: Array<VNode>;

    //#endregion

    //#region Constructor

    constructor() {
        this.parentNode = null;
        this.children = [];
    }

    //#endregion

    //#region Public Methods

    appendChild(node: VNode): void {
        this.setParentNodeToThisNode(node);
        this.children.push(node);
    }

    removeChild(childNode: VNode): void {
        const index = this.children.indexOf(childNode);

        if (index === -1) {
            return;
        }

        this.children.splice(index, 1);
    }

    insertBefore(newNode: VNode, referenceNode: VNode): void {
        if (!referenceNode) {
            return this.appendChild(newNode);
        }

        const referenceNodeIndex = this.children.indexOf(referenceNode);

        if (referenceNodeIndex === -1) {
            return;
        }

        this.setParentNodeToThisNode(newNode);
        this.children.splice(referenceNodeIndex - 1, 0, newNode);
    }

    //#endregion

    //#region Private Methods

    private setParentNodeToThisNode(node: VNode): void {
        node.parentNode = this;
    }

    //#endregion
}
