'use strict'

const http = require('http')

const sock = '/tmp/server.sock'

function start (server) {
  return server.listen(sock)
}

function mapRequest (event, context) {
  const options = {
    method: event.httpMethod,
    path: event.path,
    headers: event.headers || {},
    socketPath: sock
  }

  const request = http.request(options, (response, body) => {
    return mapResponse(response, context)
  })

  if (event.body) {
    if (event.isBase64Encoded) {
      event.body = Buffer.from(event.body, 'base64')
    }

    request.write(event.body)
  }

  request.end()
}

function mapResponse (response, context) {
  let buf = []
  response
    .on('data', chunk => buf.push(chunk))
    .on('end', () => {
      context.callback({
        statusCode: response.statusCode,
        headers: response.headers,
        body: Buffer.concat(buf).toString('utf8')
      })
    })
}

function proxy (server, event, context, callback) {
  // context.callbackWaitsForEmptyEventLoop = false
  context.callback = (response) => {
    callback(null, response)
    server.close()
  }

  try {
    start(server).on('listening', () => {
      mapRequest(event, context)
    })
  } catch (e) {
    console.error(e)
  }
}

module.exports = proxy
