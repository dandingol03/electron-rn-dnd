/**
 * Created by danding on 17/2/10.
 */

import fs from 'fs'
import path from 'path'
import child_process from 'child_process'
import Logger from '../logger/gulpLogger';

import {
    app,
} from 'electron'

import {
    APP_SUPPORT,
} from '../constants/DecoPaths';



import bridge from '../bridge'
import {
    upgradeStatus,
} from '../../../web/src/actions/uiActions'




const UPGRADE_FILE = global.__DEV__ ? path.join(__dirname, '../Scripts/postinstall') : path.join(__dirname, '../../app.asar.unpacked/Scripts/postinstall')
const DECO_SUDO = path.join(APP_SUPPORT, '/libs/binaries/Deco')
const VERSION_FILE_PATH = path.join(APP_SUPPORT, '.deco.version')

class UpgradeHandler {
    needsUpgrade() {
        try {
            const lastVersion = fs.readFileSync(VERSION_FILE_PATH).toString();
            return lastVersion != app.getVersion()
        } catch (e) {
            //this behavior is mostly expected, but we'll keep it in local logs for debugging
            Logger.info('err='+e);
            return true
        }
    }
    _upgrade(resolve, reject) {
        const opts = global.__DEV__ ? `dev ${path.join(__dirname, '../deco_unpack_lib')}` : 'upgrade'
        const command = `\"${UPGRADE_FILE}\" ${opts}`
        const execString = `do shell script \\\"${command}\\\" with administrator privileges`
        child_process.exec(`\"${DECO_SUDO}\" -e "${execString}"`, {env: process.env}, (err, stdout, stderr) => {
            if (err !== null) {
                Logger.error(`upgrade stderr: ${stderr}`)
                Logger.error(`upgrade error: ${err}`)
                bridge.send(upgradeStatus('failed'))
                reject()
                return
            }
            try {
                bridge.send(upgradeStatus('success'))
                resolve()
            } catch (e) {
                Logger.error(e)
                bridge.send(upgradeStatus('failed'))
                reject()
            }
        })
    }
    upgrade() {
        return new Promise(this._upgrade.bind(this))
    }
}

const handler = new UpgradeHandler()
export default handler
