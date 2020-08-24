import VElement from './VElement';

export default class VNode {

    //#region Public Properties

    parentNode: VNode;
    childNodes: Array<VNode>;

    get children(): Array<VElement> {
        return this.childNodes.filter(node => node instanceof VElement) as Array<VElement>;
    }

    get firstChild(): VNode | null {
        return this.childNodes[0] || null;
    }

    get lastChild(): VNode | null {
        return this.childNodes[this.childNodes.length - 1] || null;
    }

    get firstElementChild(): VNode | null {
        for (let i = 0, iLen = this.childNodes.length; i < iLen; i++) {
            const currentChild = this.childNodes[i];

            if (currentChild instanceof VElement) {
                return currentChild;
            }
        }

        return null;
    }

    get lastElementChild(): VNode | null {
        for (let i = this.childNodes.length - 1; i > -1; i--) {
            const currentChild = this.childNodes[i];

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
        this.childNodes = [];
    }

    //#endregion

    //#region Public Methods

    appendChild(node: VNode): void {
        this.setParentNodeToThisNode(node);
        this.childNodes.push(node);
    }

    removeChild(childNode: VNode): void {
        const index = this.childNodes.indexOf(childNode);

        if (index === -1) {
            return;
        }

        this.childNodes.splice(index, 1);
    }

    insertBefore(newNode: VNode, referenceNode: VNode): void {
        if (!referenceNode) {
            return this.appendChild(newNode);
        }

        const referenceNodeIndex = this.childNodes.indexOf(referenceNode);

        if (referenceNodeIndex === -1) {
            return;
        }

        this.setParentNodeToThisNode(newNode);
        this.childNodes.splice(referenceNodeIndex - 1, 0, newNode);
    }

    //#endregion

    //#region Private Methods

    private setParentNodeToThisNode(node: VNode): void {
        node.parentNode = this;
    }

    //#endregion
}
