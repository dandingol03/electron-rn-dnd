/**
 * Created by danding on 17/2/8.
 */
'use strict'

import WindowConstants from '../../../web/src/constants/ipc/WindowConstants'
const {
    OPEN_PROJECT_DIALOG,
    SAVE_AS_DIALOG,
    OPEN_PATH_CHOOSER_DIALOG,
} = WindowConstants

export const openProjectDialog = (path) => {
    return {
        type: OPEN_PROJECT_DIALOG,
        path: path,
    }
}

export const saveAsDialog = (path) => {
    return {
        type: SAVE_AS_DIALOG,
        path: path,
    }
}

export const openPathChooserDialog = (path) => {
    return {
        type: OPEN_PATH_CHOOSER_DIALOG,
        path: path,
    }
}
