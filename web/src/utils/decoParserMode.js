

var CodeMirror = require('codemirror')

CodeMirror.defineMode("deco", function(config) {
    var jsxMode = CodeMirror.getMode(config, "jsx")

    function token(stream, state) {
        return jsxMode.token(stream, state)
    }

    return {
        startState: jsxMode.startState,
        copyState: jsxMode.copyState,
        token: token,
        indent: jsxMode.indent,
        innerMode: jsxMode.innerMode,
    }
}, "jsx")

CodeMirror.defineMIME("text/deco", "deco")
