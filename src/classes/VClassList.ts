import { isUndefined, toString } from '../util/Util';

export default class VClassList {

    //#region Public Properties

    //#endregion

    //#region Private Properties

    private classNames = new Set<string>();

    //#endregion

    //#region Constructor

    //#endregion

    //#region Public Methods

    /**
     * Adds the specified class names to the class list
     * @param classNames - The class names to add
     */
    add(...classNames: Array<string>): void {
        classNames.forEach(className => this.classNames.add(toString(className)));
    }

    /**
     * Removes the specified class names from the class list
     * @param classNames - The class names to remove
     */
    remove(...classNames: Array<string>): void {
        classNames.forEach(className => this.classNames.delete(toString(className)));
    }

    /**
     * Checks if the class list contains the given class name
     * @param className -  The class name to check
     */
    contains(className: string): boolean {
        return this.classNames.has(toString(className));
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

    //#endregion

}
