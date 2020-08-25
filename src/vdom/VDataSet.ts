import ILooseObject from '../common/LooseObject';
import { isFunction } from '../util/Util';
import AttributeStore from './AttributeStore';

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

    //#endregion

}
