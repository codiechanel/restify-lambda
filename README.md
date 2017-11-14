Lambda Restify
--

Allows the use of the Restify framework on AWS Lambda.

## Example

```javascript
const restify = require('restify')
const proxy = require('@benswinburne/restify-lambda')

const server = restify.createServer()

server.get('/', function (req, res, next) {
  res.send('Routed / using Restify')
  return next()
})

module.exports.handler = (event, context, callback) => {
  proxy(server, event, context, callback)
}
```

## Next Steps

 - [ ] Error handling
 - [ ] Configuration
 - [ ] Base64 encoded responses
 - [ ] Headers with same name support for API gateway
 - [ ] Make callback more universal
 - [ ] Document
 - [ ] Tests
