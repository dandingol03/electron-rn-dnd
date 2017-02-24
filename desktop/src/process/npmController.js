/**
 * Created by danding on 17/2/14.
 */


import once from 'once'
import { fork } from 'child_process'
import path from 'path'

class npm {
    static run(cmd = [], opts = {}, cb, progress) {
        cb = once(cb)

        var execPath = path.join(__dirname, '../node_modules/npm/bin/npm-cli.js')

        var child = fork(execPath, cmd, opts)

        child.on('error', cb)

        child.on('close', function (code) {
            cb(null, code)
        })

        if (progress) {
            child.on('message', function(response) {
                if (response) {
                    progress(response.progress)
                }
            })
        }

        return child
    }
}

export default npm
