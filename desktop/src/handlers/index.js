/**
 * Created by danding on 17/2/8.
 */

import _ from 'lodash'

import windowHandler from '../handlers/windowHandler'

const handlers = [
    windowHandler
]

export const registerHandlers = () => {
    _.each(handlers, (handler) => {
        handler.register()
    })
}
