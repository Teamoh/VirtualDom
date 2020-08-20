import { toString } from '../util/Util';
import { VAttributes } from './VAttributes';

export class VHTMLElement {

    // #region Private Properties

    private attributes = new VAttributes();

    // #endregion

    // #region Public Properties

    get id(): string {
        return this.attributes.getAttribute('id');
    }

    set id(id: string) {
        this.attributes.setAttribute('id', id);
    }

    // #endregion
    
}
