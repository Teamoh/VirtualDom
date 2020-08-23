import { isString } from '../util/Util';
import VElement from './VElement';
import VNode from './VNode';

export default class VDocument extends VNode {

    //#region Public Properties
    //#endregion

    //#region Constructor

    constructor() {
        super();
    }

    //#endregion

    //#region Public Methods

    createElement(elementName: string): VElement {
        if (!isString(elementName)) {
            throw new TypeError('elementName must be a string');
        }

        return new VElement(elementName);
    }

    //#endregion

}
