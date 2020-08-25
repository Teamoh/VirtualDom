import { isUndefined, toString } from '../util/Util';
import AttributeStore from './AttributeStore';

export default class VClassList {

    //#region Public Properties

    //#endregion

    //#region Private Properties

    private attributes: AttributeStore;

    //#endregion

    //#region Constructor

    constructor(attributes: AttributeStore) {
        this.attributes = attributes;
    }

    //#endregion

    //#region Public Methods

    /**
     * Adds the specified class names to the class list
     * @param classNames - The class names to add
     */
    add(...classNames: Array<string>): void {
        classNames.forEach(className => {
            if (!className) {
                return;
            }

            const trimmedClassName = className.trim();

            if (!trimmedClassName) {
                return;
            }

            if (this.contains(trimmedClassName)) {
                return;
            }

            this.attributes.transformAttribute('class', (oldValue: string) => oldValue + ' ' + trimmedClassName);
        });
    }

    /**
     * Removes the specified class names from the class list
     * @param classNames - The class names to remove
     */
    remove(...classNames: Array<string>): void {
        classNames.forEach(className => {
            if (!className) {
                return;
            }

            const trimmedClassName = className.trim();

            if (!trimmedClassName) {
                return;
            }

            if (!this.contains(trimmedClassName)) {
                return;
            }

            this.attributes.transformAttribute('class', (oldValue: string) => {
                let newValue = ' ' + oldValue + ' ';
                let index = newValue.indexOf(' ' + trimmedClassName + ' ');

                while (index !== -1) {
                    newValue = newValue.replace(trimmedClassName, '');
                    index = newValue.indexOf(' ' + trimmedClassName + ' ');
                }

                return newValue.trim();
            });
        });
    }

    /**
     * Checks if the class list contains the given class name
     * @param className -  The class name to check
     */
    contains(className: string): boolean {
        const classNames = this.getTrimmedClassNames();

        const index = (' ' + classNames + ' ').indexOf(' ' + className + ' ');
        const hasClass = index !== -1;

        return hasClass;
    }

    /**
     * Toggles the given class
     * @param className - The class name to toggle
     * @param force - If true the class is added, if false the class is removed
     */
    toggle(className: string, force?: boolean): void {
        if (!isUndefined(force) && force || !this.contains(className)) {
            this.add(className);
        } else {
            this.remove(className);
        }
    }

    /**
     * Replaces the given class name with a new class name
     * @param className - The class name that should be replaced
     * @param newClassName - The replacement class name
     */
    replace(className: string, newClassName: string): void {
        if (this.contains(className)) {
            this.remove(className);
            this.add(newClassName);
        }
    }

    //#endregion

    //#region Private Methods

    private getTrimmedClassNames() {
        const classAttr = this.attributes.getAttribute('class');

        if (!classAttr) {
            return '';
        }

        return classAttr.trim();
    }

    //#endregion

}
