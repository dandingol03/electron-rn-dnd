/**
 * Created by danding on 17/2/5.
 */

const ipc = Electron.ipcRenderer;

const requestMap = {}

let messageId = 1
const generateMessageId = (channel) => channel + messageId++


//so there is a process,client use ipcRenderer to send('request',....);
//main process get the message,and because the response is asynchronised, client generate a messageId to store the callback
//util the client get response,and it will invoke the callback
//and the main process use bridge to make response and get request

const _request = (channel, body) => {
    if (typeof channel !== 'string' || channel.length === 0) {
        throw new Error(`Invalid message channel: ${channel}`)
    }

    const messageId = generateMessageId(channel)
    console.log('registering ' + messageId)

    ipc.send('request', messageId, channel, body)

    //this writing seem to be unclear for me
    return new Promise((resolve, reject) => {

        requestMap[messageId] = (err, data) => {
            console.log(messageId + ' => ' + (err ? 'rejected' : 'resolved'))
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        }

    })

}

ipc.on('response', (evt, messageId, err, data) => {
    if (! requestMap[messageId]) {
        throw new Error(`No registered request was available for the response with id: ${messageId}`)
    }

    const handler = requestMap[messageId]
    delete requestMap[messageId]
    handler(err, data)
})

const request = (req) => {
    return _request(req.type, req)
}

export default request
