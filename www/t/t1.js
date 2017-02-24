/**
 * Created by danding on 17/2/10.
 */
var store={
    name:'danding'
};
function applyActionEmitters(store) {
    return function (emitters) {
        // var emitterAPI = {
        //     getState: store.getState,
        //     dispatch: (action) => store.dispatch(action)
        // }
        //
        // actionEmitters.forEach(actionEmitter => {
        //     actionEmitter(emitterAPI)
        // })
        console.log('...');
    }
}
applyActionEmitters(store)(
    'dw',
    'zz',
    'q'
)