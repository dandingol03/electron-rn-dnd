/**
 * Created by danding on 17/2/5.
 */
/**
 * Created by danding on 16/11/13.
 */
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducers from '../reducers/index.js';
import DevTools from '../containers/DevTools.jsx'

const middlewares = [thunk];
const createLogger = require('redux-logger');

if (process.env.NODE_ENV === 'development') {
    const logger = createLogger();
    middlewares.push(logger);
}
const createStoreWithMiddleware = applyMiddleware(...middlewares)(createStore);

let store = createStoreWithMiddleware(reducers,DevTools.instrument());
module.exports= store;


