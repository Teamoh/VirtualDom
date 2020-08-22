import { isString } from '../util/Util';
import VHTMLElement from './VHTMLElement';

export default class VDocument {

    // #region Public Properties

    children: Array<VHTMLElement>;

    // #endregion

    // #region Constructor

    constructor() {
        this.children = [];
    }

    // #endregion

    // #region Public Methods

    createElement(elementName: string): VHTMLElement {
        if (!isString(elementName)) {
            throw new TypeError('elementName must be a string');
        }

        return new VHTMLElement(elementName);
    }

    appendChild(vElement: VHTMLElement) {
        this.children.push(vElement);
    }

    // #endregion

}
