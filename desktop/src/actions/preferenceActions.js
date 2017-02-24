/**
 * Created by danding on 17/2/10.
 */


import ApplicationConstants from '../../../web/src/constants/ipc/ApplicationConstants'
const { GET_SYSTEM_PATHS, } = ApplicationConstants

export const sendSystemPaths = (payload) => {
    return {
        type: GET_SYSTEM_PATHS,
        payload,
    }
}
