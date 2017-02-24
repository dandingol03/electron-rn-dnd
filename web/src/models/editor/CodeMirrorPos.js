/**
 * Created by danding on 17/2/11.
 */


import CodeMirror from 'codemirror'

const Pos = CodeMirror.Pos

Pos.MAX_LINE = 1000000000
Pos.MAX_CH = 10000000

Pos.MIN = new Pos(0, 0)
Pos.MAX = new Pos(Pos.MAX_LINE, 0)

export default Pos
