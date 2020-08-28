import { trim } from '../../util/Util';

export default class CssTextParser {

    //#region Private Properties

    private cssText: string;

    //#endregion

    //#region Constructor

    constructor(cssText: string) {
        this.cssText = cssText;
    }

    //#endregion

    //#region Public Methods

    /**
     * Parses the cssText and returns an array
     * of key-value-pairs
     */
    parse(): Array<[string, string]> {
        const trimmedCssText = trim(this.cssText);

        if (!trimmedCssText) {
            return [];
        }

        const splittedCssText = trimmedCssText.split(';');
        const styleMap = new Map<string, string>();

        splittedCssText.forEach(part => {
            const trimmedPart = trim(part);

            if (!trimmedPart) {
                return;
            }

            const keyValue = trimmedPart.split(':');
            const property = trim(keyValue[0]);
            const value = trim(keyValue[1]);

            if (!property || !value) {
                return;
            }

            styleMap.set(property, value);
        });

        const result = [];

        styleMap.forEach((value: string, key: string) => {
            result.push([key, value]);
        });

        return result;
    }

    //#endregion
}
