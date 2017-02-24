/**
 * Created by danding on 17/2/11.
 */


import Enum from '../../utils/Enum.js'

class DecoChange {

    invert() {
        throw new Error('invert not implemented by subclass')
    }

}

export const CHANGE_TYPE=Enum(
    'TEXT',
    'RANGE',
    'COMPOSITE'
)

DecoChange.CHANGE_TYPE = Enum(
    'TEXT',
    'RANGE',
    'COMPOSITE'
)

export default DecoChange
