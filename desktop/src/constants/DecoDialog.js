/**
 * Created by danding on 17/2/10.
 */


import path from 'path'
import { nativeImage, } from 'electron';

const DecoIcon = nativeImage.createFromPath(path.join(__dirname, '../../public/images/logo.png'))

export const INFO = {
    noUpdateIsAvailable: {
        type: 'info',
        message: 'No update is available',
        detail: 'You are using the latest version of Deco',
        buttons: ['Ok', ],
        icon: DecoIcon,
    },
}

export const QUESTION = {
    shouldRestartAndUpdate: {
        type: 'question',
        message: 'A new version of Deco is available!',
        detail: 'Update and restart Deco? Any unsaved changes will be lost.',
        buttons: ['Update and Restart', 'Later', ],
        icon: DecoIcon,
    },
    shouldLoseTemporaryDirectory: {
        type: 'question',
        message: 'Quit without saving?',
        detail: 'This project has not yet been saved. ' +
        'New projects are temporary until saved for the first time. ' +
        'To save this project, first click Cancel, then go to File > Save Project.',
        buttons: ['Quit', 'Cancel',],
        icon: DecoIcon,
    },
    shouldLoseUnsavedProgress: {
        type: 'question',
        message: 'Quit without saving?',
        detail: 'Files have been changed since last save. Quit anyway?',
        buttons: ['Quit', 'Cancel',],
        icon: DecoIcon,
    },
}
