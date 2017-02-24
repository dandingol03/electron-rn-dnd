/**
 * Created by danding on 17/2/11.
 */



// TODO consolidate with router
export const getRootPath = (state) => {
    const match = state.routing.location.pathname.match(/\/workspace\/(.*)?/)
    if (match && match[1]) {
        const hexString = new Buffer(match[1], 'hex')
        const path = hexString.toString('utf8')
        return path
    }
    return null
}