import { isString } from '../util/Util';
import { VHTMLElement } from './VHTMLElement';

export class VDocument {

    // #region Public Methods

    createElement(elementName: string): VHTMLElement {
        if (!isString(elementName)) {
            throw new TypeError('elementName must be a string');
        }

        return new VHTMLElement(elementName);
    }

    // #endregion
}
