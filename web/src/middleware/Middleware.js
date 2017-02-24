/**
 * Created by danding on 17/2/11.
 */

/**
 * Middleware to interact with DecoDocs and CodeMirror events
 */
class Middleware {

    setDispatchFunction(dispatch) {
        this._dispatch = dispatch
    }

    get dispatch() {
        if (! this._dispatch) {
            throw new Error('Middleware not property initialized with dispatch function')
        }
        return this._dispatch
    }

    get eventListeners() {
        return {}
    }

    attach(/* decoDoc */) {
        throw new Error('Attach not implemented by subclass')
    }

    detach() {
        throw new Error('Detach not implemented by subclass')
    }

}

export default Middleware
