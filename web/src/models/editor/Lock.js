/**
 * Created by danding on 17/2/12.
 */


class Lock {

    constructor() {
        this._locked = false
    }

    get locked() {
        return this._locked
    }

    lock() {
        if (this._locked) {
            throw new Error('Lock already locked!')
        }
        this._locked = true
    }

    unlock() {
        if (! this._locked) {
            throw new Error('Lock wasnt locked!')
        }
        this._locked = false
    }

}

export default Lock
