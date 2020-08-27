import ILooseObject from '../common/LooseObject';
import { dataAttributePrefix } from '../config/config';
import { camelCase, isFunction, startsWith, toString } from '../util/Util';

export default class VDataSet implements ILooseObject {

    //#region Public Methods

    /**
     * Executes the given callback
     * for each attribute
     * @param callback - The callback function to execute
     */
    forEach(callback: (attributeName: string, attributeValue: string) => void): void {
        if (!isFunction(callback)) {
            throw new TypeError('callback must be a function');
        }

        Object.keys(this).forEach((key: string) => {
            callback.call(key, key, this[key]);
        });
    }

    /**
     * Sets the given data attribute
     * @param name - The name of the property
     * @param value - The value
     */
    set(name: string, value: string): void {
        const propertyName = this.createPropertyNameFromAttributeName(name);
        this[propertyName] = toString(value);
    }

    /**
     * Returns the value fo the given data attribute
     * @param name - The name of the property
     */
    get(name: string): string {
        const propertyName = this.createPropertyNameFromAttributeName(name);
        return toString(this[propertyName]);
    }

    /**
     * Checks if the given data set
     * property exists
     * @param name - The name of the propert
     */
    has(name: string): boolean {
        const propertyName = this.createPropertyNameFromAttributeName(name);
        return this.hasOwnProperty(propertyName);
    }

    /**
     * Returns the value fo the given data attribute
     * @param name - The name of the property
     */
    remove(name: string): void {
        const propertyName = this.createPropertyNameFromAttributeName(name);
        delete this[propertyName];
    }

    //#endregion

    //#region Private Methods

    /**
     * Takes an attribute name and converts it
     * to a camelcased property name which may
     * be used inside the dataset
     * @param attributeName - The attribute name
     */
    private createPropertyNameFromAttributeName(attributeName: string): string {
        let datasetPropertyName = attributeName;

        if (this.isDataAttributeName(datasetPropertyName)) {
            // if the given attribute name is a data attribute
            // cut off the prefix
            datasetPropertyName = attributeName.slice(dataAttributePrefix.length);
        }

        return camelCase(datasetPropertyName);
    }

    /**
     * Checks if the given attributeName
     * starts with 'data-'
     * @param attributeName - The attribute name to check
     */
    private isDataAttributeName(attributeName: string): boolean {
        return startsWith(attributeName, dataAttributePrefix);
    }

    //#endregion

}
