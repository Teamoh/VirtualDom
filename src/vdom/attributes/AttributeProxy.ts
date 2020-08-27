import { classAttributeName, dataAttributePrefix } from '../../config/config';
import { isFunction, startsWith, toString } from '../../util/Util';
import VClassList from '../VClassList';
import VDataSet from '../VDataSet';
import AttributeStore from './AttributeStore';
import { AttributeType } from './AttributeType';

export default class AttributProxy {

    //#region Private Properties

    private classList: VClassList;
    private dataset: VDataSet;
    private attributeStore: AttributeStore;

    //#endregion

    //#region Constructor

    constructor(classList: VClassList, dataset: VDataSet) {
        this.classList = classList;
        this.dataset = dataset;
        this.attributeStore = new AttributeStore();
    }

    //#endregion

    //#region Public Methods

    /**
     * Sets an attribute
     * @param attributeName - The name of the attribute
     * @param attributeValue - The value of the attribute
     */
    setAttribute(attributeName: string, attributeValue: string): void {
        const normalizedAttributeName = this.normalizeAttributeName(attributeName);
        const attributeType = this.getAttributeType(normalizedAttributeName);

        this.setAttributeByType(attributeType, attributeName, attributeValue);
    }

    /**
     * Reads an attribute.
     * If the attribute does not exist,
     * null is returned.
     * @param attributeName - The name of the attribute
     */
    getAttribute(attributeName: string): string {
        const normalizedAttributeName = this.normalizeAttributeName(attributeName);
        const attributeType = this.getAttributeType(normalizedAttributeName);

        return toString(this.getAttributeByType(attributeType, normalizedAttributeName), null);
    }

    /**
     * Checks if the given attribute
     * is present
     * @param attributeName - The name of the attribute
     */
    hasAttribute(attributeName: string): boolean {
        const normalizedAttributeName = this.normalizeAttributeName(attributeName);
        const attributeType = this.getAttributeType(normalizedAttributeName);

        return this.hasAttributeByType(attributeType, normalizedAttributeName);
    }

    /**
     * Removes the given attribute
     * @param attributeName - The name of the attribute
     */
    removeAttribute(attributeName: string): void {
        const normalizedAttributeName = this.normalizeAttributeName(attributeName);
        const attributeType = this.getAttributeType(normalizedAttributeName);

        this.removeAttributeByType(attributeType, normalizedAttributeName);
    }

    /**
     * Executes the given callback
     * for each attribute
     * @param callback - The callback function to execute
     */
    forEach(callback: (attributeName: string, attributeValue: string) => void): void {
        if (!isFunction(callback)) {
            throw new TypeError('callback must be a function');
        }

        if (this.classList.any()) {
            callback.call(classAttributeName, classAttributeName, this.classList.toString());
        }

        this.attributeStore.forEach(callback);
        this.dataset.forEach(callback);
    }

    //#region

    //#region Private Methods

    /**
     * Normalizes the given attribute name
     */
    private normalizeAttributeName(attributeName: string): string {
        if (!attributeName) {
            return '';
        }

        return attributeName.trim();
    }

    private getAttributeType(attributeName: string): AttributeType {
        if (attributeName === classAttributeName) {
            return AttributeType.Class;
        } else if (startsWith(attributeName, dataAttributePrefix)) {
            return AttributeType.Data;
        } else {
            return AttributeType.Standard;
        }
    }

    /**
     * Sets an attribute respecting the given attribute type
     * @param attributeType - The type of the attribute
     * @param attributeName - The name of the attribute
     * @param attributeValue - The value of the attribute
     */
    private setAttributeByType(attributeType: AttributeType, attributeName: string, attributeValue: string): void {
        switch (attributeType) {
            case AttributeType.Class:
                // set a class
                this.classList.add(attributeValue);
                break;
            case AttributeType.Data:
                // set a data attribute
                this.dataset.set(attributeName, attributeValue);
                break;
            default:
                // set a standard attribute
                this.attributeStore.setAttribute(attributeName, attributeValue);
        }
    }

    /**
     * Retreives an attribute value respecting the given attribute type
     * @param attributeType - The type of the attribute
     * @param attributeName - The name of the attribute
     */
    private getAttributeByType(attributeType: AttributeType, attributeName: string): string {
        switch (attributeType) {
            case AttributeType.Class:
                // get class attribute
                return this.classList.toString();
            case AttributeType.Data:
                // get a data attribute
                return this.dataset.get(attributeName);
            default:
                // get a standard attribute
                return this.attributeStore.getAttribute(attributeName);
        }
    }

    /**
     * Checks if an attribute exists respecting the given attribute type
     * @param attributeType - The type of the attribute
     * @param attributeName - The name of the attribute
     */
    private hasAttributeByType(attributeType: AttributeType, attributeName: string): boolean {
        switch (attributeType) {
            case AttributeType.Class:
                // get class attribute
                return this.classList.any();
            case AttributeType.Data:
                // get a data attribute
                return this.dataset.has(attributeName);
            default:
                // get a standard attribute
                return this.attributeStore.hasAttribute(attributeName);
        }
    }

    /**
     * Removes a an attribute respecting the given attribute type
     * @param attributeType - The type of the attribute
     * @param attributeName - The name of the attribute
     */
    private removeAttributeByType(attributeType: AttributeType, attributeName: string): void {
        switch (attributeType) {
            case AttributeType.Class:
                // remove class attribute
                this.classList.clear();
            case AttributeType.Data:
                // remove data attribute
                this.dataset.remove(attributeName);
            default:
                // remove standard attribute
                this.attributeStore.removeAttribute(attributeName);
        }
    }

    //#endregion
}
