/**
 * Created by danding on 17/2/11.
 */


// JS Numbers are 64-bit, so 1B should be safe.
// Will break on files with more than 1B lines :)
// http://ecma262-5.com/ELS5_HTML.htm#Section_8.5
const LINE_MULTIPLIER = 1000000000

export default (cmPos) => {
    return cmPos.line * LINE_MULTIPLIER + cmPos.ch
}
