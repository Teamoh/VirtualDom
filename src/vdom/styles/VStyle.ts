import ILooseObject from '../../common/LooseObject';
import { camelCase, isFunction, toString, unCamelCase } from '../../util/Util';
import CssTextParser from './CssTextParser';

export default class VStyle implements ILooseObject {

    //#region Public Properties

    get length(): number {
        let length = 0;

        this.forEach(() => {
            length++;
        });

        return length;
    }

    //#endregion

    //#region Public Properties

    get cssText(): string {
        return this.toString();
    }

    set cssText(cssText: string) {
        const parser = new CssTextParser(cssText);
        const result = parser.parse();

        this.clear();

        result.forEach(([property, value]) => {
            const camelCasedProperty = camelCase(property);
            this[camelCasedProperty] = value;
        });
    }

    //#endregion

    //#region Public Methods

    /**
     * Executes the given callback
     * for each style property
     * @param callback - The callback function to execute
     */
    forEach(callback: (propertyName: string, propertyValue: string) => void): void {
        if (!isFunction(callback)) {
            throw new TypeError('callback must be a function');
        }

        Object.keys(this).forEach((key: string) => {
            callback.call(key, key, this[key]);
        });
    }

    /**
     * Sets the given style property
     * @param name - The name of the property
     * @param value - The value of the property
     */
    set(name: string, value: string): void {
        const propertyName = this.normalizeCssPropertyName(name);
        this[propertyName] = toString(value);
    }

    /**
     * Returns the value fo the given style property
     * @param name - The name of the property
     */
    get(name: string): string {
        const propertyName = this.normalizeCssPropertyName(name);
        return toString(this[propertyName]);
    }

    /**
     * Checks if the given style property exists
     * @param name - The name of the propery
     */
    has(name: string): boolean {
        const propertyName = this.normalizeCssPropertyName(name);
        return this.hasOwnProperty(propertyName);
    }

    /**
     * Returns the value fo the given style property
     * @param name - The name of the property
     */
    remove(name: string): void {
        const propertyName = this.normalizeCssPropertyName(name);
        delete this[propertyName];
    }

    /**
     * Removes all style properties
     */
    clear(): void {
        this.forEach(propertyName => {
            delete this[propertyName];
        });
    }

    /**
     * Checks if any style
     * property is set
     */
    any(): boolean {
        return !!this.length;
    }

    /**
     * Serializes the css properties
     */
    toString(): string {
        const properties = [];

        this.forEach((propertyName: string, propertyValue: string) => {
            const unCamelCasedPropertyName = unCamelCase(propertyName);
            properties.push(`${unCamelCasedPropertyName}: ${propertyValue}`);
        });

        return properties.join('; ') + (properties.length ? ';' : '');
    }

    //#endregion

    //#region Private Methods

    /**
     * Creates the css property name based on
     * the given property name
     * @param attributeName - The attribute name
     */
    private normalizeCssPropertyName(propertyName: string): string {
        return camelCase(propertyName);
    }

    //#endregion

}
