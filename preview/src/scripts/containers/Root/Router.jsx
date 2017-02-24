
import React, { Component, } from 'react'
import {
    Router,
    hashHistory,
    Route,
    IndexRoute,
} from 'react-router'

import App from '../App'
import Panel from '../Panel';
import Customizing from '../Customizing';

class AppRouter extends Component {

    componentWillMount() {


        // Fires regardless of whether the pathname differs. Necessary since
        // creating a new project will not change the pathname or fire onEnter
        // if we're already in a new project.
        //hashHistory listen,is used to listen the router change
        this._stopListening = hashHistory.listen((params) => {
            debugger
            const match = params.pathname.match(/\/workspace\/(.*)?/)
            if (match && match[1]) {
                const hexString = new Buffer(match[1], 'hex')
                const path = hexString.toString('utf8')
                this.props.store.dispatch(setTopDir(path))
                this.props.store.dispatch(scanLocalRegistries(path))
                this.props.store.dispatch(initializeProcessesForDir(path))
            }
        })
    }

    componentWillUnmount() {
        this._stopListening()
    }

    render() {
        return (
            <Router history={hashHistory}>
                <Route
                    path='/'
                    component={App}>
                    <IndexRoute
                        component={Panel}
                        onEnter={() => {

                        }}/>
                    <Route
                        path='customizing'
                        component={Customizing}
                        onEnter={() => {
                     }}/>

                </Route>
            </Router>
        )
    }
}

export default AppRouter
