/**
 * Created by danding on 17/2/11.
 */


import uuid from 'uuid'

export default (prefix = '') => {
    return prefix + uuid.v4().replace(/-/g, '')
}
