import { AttributeStore } from './AttributeStore';
import { VClassList } from './VClassList';

export class VHTMLElement {

    // #region Public Properties

    classList: VClassList;

    // #region Id

    get id(): string {
        return this.attributes.getAttribute('id');
    }

    set id(id: string) {
        this.attributes.setAttribute('id', id);
    }

    // #endregion

    // #endregion

    // #region Private Properties

    private attributes: AttributeStore;

    // #endregion

    // #region Constructor

    constructor() {
        this.classList = new VClassList();
        this.attributes = new AttributeStore();
    }

    // #endregion

    // #region Public Methods

    // #endregion

    // #region Private Methods

    // #endregion
}
