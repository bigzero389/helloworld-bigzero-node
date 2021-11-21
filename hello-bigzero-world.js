const HTTP = require("http")
const WINSTON = require("winston")
const WINSTON_DAILY = require("winston-daily-rotate-file")
const version = process.env.HELLOWORLD_VERSION

const OPTIONS = {
    file: {
        level: 'info',
        name: 'file.info',
        datePattern: 'YYYY-MM-DD',
        filename: `./logs/app-%DATE%.log`,
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 30,
        colorize: true,
        zippedArchive: true
    },
    errorFile: {
        level: 'error',
        name: 'file.error',
        datePattern: 'YYYY-MM-DD',
        filename: `./logs/error-%DATE%.log`,
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 30,
        colorize: true,
        zippedArchive: true
    },
    console: {
        level: 'debug',
        handleExceptions: true,
        json: false,
        colorize: true,
    },
};

const LOGGER = WINSTON.createLogger({
  transports: [
      new (WINSTON.transports.Console)(OPTIONS.console),
      //new (winston.transports.File)(options.errorFile),
      new WINSTON_DAILY(OPTIONS.file),
      //new (WINSTON.transports.File)(OPTIONS.file)
      new WINSTON_DAILY(OPTIONS.errorFile),
  ],
    exitOnError: false,
});

HTTP.createServer(function (request, response) {
    let isoDate = new Date().toISOString()
    LOGGER.info("Hello bigzero world version "+ version +" is called at " + isoDate);
   // Send the HTTP header
   // HTTP Status: 200 : OK
   // Content Type: text/plain
   response.writeHead(200, {'Content-Type': 'text/plain'})
   // Send the response body as "Hello World"
   response.end('Hello bigzero world !!! \n')
}).listen(3000)

// Console will print the message
//console.log('Server running')
LOGGER.info("Server is Running ==> port:3000, version:" + version)
