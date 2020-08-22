import { isString } from '../util/Util';
import VHTMLElement from './VHTMLElement';
import VNode from './VNode';

export default class VDocument extends VNode {

    //#region Public Properties
    //#endregion

    //#region Constructor

    constructor() {
        super();

        this.children = [];
    }

    //#endregion

    //#region Public Methods

    createElement(elementName: string): VHTMLElement {
        if (!isString(elementName)) {
            throw new TypeError('elementName must be a string');
        }

        return new VHTMLElement(elementName);
    }

    //#endregion

}
