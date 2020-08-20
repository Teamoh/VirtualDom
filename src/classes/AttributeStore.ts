import { toString } from '../util/Util';

export class AttributeStore {

    // #region Private Properties

    private attributes = new Map<string, string>();

    // #endregion

    // #region Public Properties

    // #endregion

    // #region Public Methods

    /**
     * Sets an attribute
     * @param attributeName - The name of the attribute
     * @param attributeValue - The value of the attribute
     */
    setAttribute(attributeName: string, attributeValue: string): void {
        this.attributes.set(attributeName, toString(attributeValue));
    }

    /**
     * Reads an attribute.
     * If the attribute does not exist,
     * null is returned.
     * @param attributeName - The name of the attribute
     */
    getAttribute(attributeName: string): string {
        return this.attributes.get(attributeName);
    }

    /**
     * Checks if the given attribute
     * is present
     * @param attributeName - The name of the attribute
     */
    hasAttribute(attributeName: string): boolean {
        return this.attributes.has(attributeName);
    }

    /**
     * Transforms the given attribute by applying
     * a callback function whose return value
     * is the new attribute value. The callback function
     * receives the old attribute value as the first
     * and the attribute name as the second parameter.
     */
    transformAttribute(attributeName: string, callback: (oldValue: string, attributeName: string) => {}): string {
        const oldAttributeValue = this.getAttribute(attributeName);
        const newAttributeValue = callback.call(null, oldAttributeValue, attributeName);

        this.setAttribute(attributeName, newAttributeValue);

        return newAttributeValue;
    }

    // #endregion
}
