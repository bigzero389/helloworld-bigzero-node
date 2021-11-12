var http = require("http")
var winston = require("winston")

var options = {
    file: {
        level: 'info',
        name: 'file.info',
        filename: `./logs/app.log`,
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 100,
        colorize: true,
    },
    errorFile: {
        level: 'error',
        name: 'file.error',
        filename: `./logs/error.log`,
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 100,
        colorize: true,
    },
    console: {
        level: 'debug',
        handleExceptions: true,
        json: false,
        colorize: true,
    },
};

var logger = winston.createLogger({
  transports: [
      new (winston.transports.Console)(options.console),
      new (winston.transports.File)(options.errorFile),
      new (winston.transports.File)(options.file)
  ],
    exitOnError: false,
});

//logger.rewriters.push(function(level, msg, meta) {
//  meta.version = version
//  return meta
//})

http.createServer(function (request, response) {
   // Send the HTTP header
   // HTTP Status: 200 : OK
   // Content Type: text/plain
   response.writeHead(200, {'Content-Type': 'text/plain'})

   // Send the response body as "Hello World"
   response.end('DYHEO Hello World\n')
}).listen(3000)

// Console will print the message
//console.log('Server running')
logger.info("Server Runnning on port 3000\n")
