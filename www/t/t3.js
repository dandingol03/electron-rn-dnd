var _=require('lodash');

function toCelsius(degrees) {
    return (degrees - 32) * 5 / 9;
}

function toFahrenheit(degrees) {
    return degrees * 9 / 5 + 32;
}

//根据indicator,F或C选择相应的方法
function convertTemp(degrees, indicator){
    return indicator.toUpperCase() === 'C' ?
    toCelsius(degrees).toFixed(2) + ' C' :
    toFahrenheit(degrees).toFixed(2) + ' F';
}

//缓存
var convert = _.memoize(convertTemp, function(degrees, indicator){
    return degrees + indicator;
});

//192.20 F
console.log(convert(89, 'F'));
