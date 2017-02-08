import 'babel-polyfill';
//require('../less/main.less');

var React = require('react');
var ReactDOM = require('react-dom');
import { render, } from 'react-dom'
// import { render, } from 'react-dom'
import configureStore from './store/store.dev.js';
import Root from './containers/Root/index.js'
import HTML5Backend from 'react-dnd-html5-backend'
import { DragDropContext } from 'react-dnd';


var Entry = React.createClass({
    render: function(){
        return (
            <div className="myDiv">
                Hello Electron!
            </div>
        )
    },
    componentDidMount:function () {
        console.log('emtry mount');
    }
});

const DraggableRoot = DragDropContext(HTML5Backend)(Root)

 render(
     <DraggableRoot store={configureStore} />,
     document.getElementById('root')
 )
//



//ReactDOM.render( <DraggableRoot store={configureStore} />, document.getElementById('root'));
