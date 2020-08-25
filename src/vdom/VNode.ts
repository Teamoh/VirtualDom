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

    /**
     * Appends the given node
     * to the end of the child nodes
     * @param node - The node to append
     */
    appendChild(node: VNode): void {
        this.setParentNode(node, this);
        this.childNodes.push(node);
    }

    /**
     * Removes the given node from the child nodes
     * @param childNode - The child node to remove
     */
    removeChild(childNode: VNode): void {
        const index = this.childNodes.indexOf(childNode);

        if (index === -1) {
            return;
        }

        this.setParentNode(childNode, null);
        this.childNodes.splice(index, 1);
    }

    /**
     * Inserts the new node before the reference node
     * @param newNode - The new node to insert
     * @param referenceNode - The optional reference node.
     * If not provided the element is appended to the end.
     */
    insertBefore(newNode: VNode, referenceNode: VNode = null): void {
        if (!referenceNode) {
            return this.appendChild(newNode);
        }

        const referenceNodeIndex = this.childNodes.indexOf(referenceNode);

        if (referenceNodeIndex === -1) {
            return;
        }

        this.setParentNode(newNode, this);
        this.childNodes.splice(referenceNodeIndex - 1, 0, newNode);
    }

    /**
     * Returns an array of elements
     * which have the given class
     * assigned.
     * @param className - The class name to search
     */
    getElementsByClassName(className: string): Array<VNode> {
        const elements = [];

        this.childNodes.forEach(node => {
            // TODO: fix conversion of node to any

            if (!(node as any).classList) {
                return;
            }

            if ((node as any).classList.contains(className)) {
                elements.push(node);
            }

            const matchingChildNodes = node.getElementsByClassName(className);
            Array.prototype.push.apply(elements, matchingChildNodes);
        });

        return elements;
    }

    //#endregion

    //#region Private Methods

    /**
     * Sets the parent node of the given node to the
     * given value.
     * @param node - The node whose parent node should be set
     * @param parentNode - The parent node to use
     */
    private setParentNode(node: VNode, parentNode: VNode | null): void {
        node.parentNode = parentNode;
    }

    //#endregion
}
