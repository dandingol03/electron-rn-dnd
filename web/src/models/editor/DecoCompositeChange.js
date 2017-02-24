/**
 * Created by danding on 17/2/11.
 */


import _ from 'lodash'

import DecoChange, {CHANGE_TYPE, } from './DecoChange.js'
import DecoChangeFactory from '../../factories/editor/DecoChangeFactory.js'
import DecoChangeTransformer from '../../utils/editor/DecoChangeTransformer.js'

class DecoCompositeChange extends DecoChange {

    constructor(subChanges) {
        super()
        this._subChanges = DecoChangeTransformer.flattenChanges(subChanges)
    }

    get type() {
        return CHANGE_TYPE.COMPOSITE
    }

    get subChanges() {
        return this._subChanges
    }

    invert() {
        const invertedChanges = _.invokeMap(this._subChanges, 'invert')
        return new DecoCompositeChange(invertedChanges.reverse())
    }

    /*** SERIALIZATION ***/

    toJSON() {
        return {
            type: this.type,
            subChanges: _.invokeMap(this.subChanges, 'toJSON'),
        }
    }

    static fromJSON(json) {
        const subChanges = _.map(json.subChanges, DecoChangeFactory.createChangeFromJSON)
        return new DecoCompositeChange(subChanges)
    }

    clone() {
        return DecoCompositeChange.fromJSON(this.toJSON())
    }

}

export default DecoCompositeChange
