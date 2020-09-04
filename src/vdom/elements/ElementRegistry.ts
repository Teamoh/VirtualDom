class ElementRegistry {
    //#region Private Properties

    private elements: Map<string, HTMLElement>;

    //#endregion

    //#region Constructor

    constructor() {
        this.elements = new Map<string, HTMLElement>();
    }

    //#endregion

    //#region Public Methods

    /**
     * Registers a new element
     * @param vId - The vId of the element
     * @param element - The element
     */
    register(vId: string, element: HTMLElement): void {
        this.elements.set(vId, element);
    }

    /**
     * Retreives an element by the given vId
     * @param vId - The vId to lookup
     */
    getElement(vId: string): HTMLElement | null {
        return this.elements.get(vId);
    }

    //#endregion
}

export const elementRegistry = new ElementRegistry();
