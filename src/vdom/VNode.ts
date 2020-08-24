import VElement from './VElement';

export default class VNode {

    //#region Public Properties

    parentNode: VNode;
    children: Array<VNode>;

    get firstChild(): VNode | null {
        return this.children[0] || null;
    }

    get lastChild(): VNode | null {
        return this.children[this.children.length - 1] || null;
    }

    get firstElementChild(): VNode | null {
        for (let i = 0, iLen = this.children.length; i < iLen; i++) {
            const currentChild = this.children[i];

            if (currentChild instanceof VElement) {
                return currentChild;
            }
        }

        return null;
    }

    get lastElementChild(): VNode | null {
        for (let i = this.children.length - 1; i > -1; i--) {
            const currentChild = this.children[i];

            if (currentChild instanceof VElement) {
                return currentChild;
            }
        }

        return null;
    }

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
