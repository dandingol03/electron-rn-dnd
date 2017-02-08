/**
 * Created by danding on 17/2/6.
 */


const Logger = require('../logger/gulpLogger')

import ErrorConstants from '../../../web/src/constants/ipc/ErrorConstants'
const { ERROR, } = ErrorConstants

export const onError = (error) => {
    if (typeof error != 'object') {
        error = {
            message: error,
        }
    }
    return Object.assign({}, error, {
        type: ERROR,
    })
}

export const onSuccess = (type) => {
    return {
        type,
    }
}
