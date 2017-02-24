/**
 * Created by danding on 17/2/14.
 */
var _ = require('lodash');
_.forEach({ 'a': 1, 'b': 2 }, function(val, key) {
    console.log(val, key);
});


var object = { 'a': [{ 'b': { 'c': 3 } }] };

_.get(object, 'a[0].b.c');
