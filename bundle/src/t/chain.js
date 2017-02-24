'use strict';

/**
 * Created by danding on 17/2/15.
 */
var _ = require('lodash');
var users = [{ 'user': 'barney', 'age': 36 }, { 'user': 'fred', 'age': 40 }, { 'user': 'pebbles', 'age': 1 }];

var youngest = _.chain(users);

console.log('...');