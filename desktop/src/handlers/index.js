/**
 * Created by danding on 17/2/8.
 */

import _ from 'lodash'
import windowHandler from '../handlers/windowHandler'
import  fileHandler from '../handlers/fileHandler';
import  projectHandler from '../handlers/projectHandler';
import preferenceHandler from '../handlers/preferenceHandler';
import componentHandler from '../handlers/componentHandler';

const handlers = [
    windowHandler,
    fileHandler,
    projectHandler,
    preferenceHandler,
    componentHandler
]

export const registerHandlers = () => {
    _.each(handlers, (handler) => {
        handler.register()
    })
}
