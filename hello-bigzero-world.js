const HTTP = require("http")
const WINSTON = require("winston")
const WINSTON_DAILY = require("winston-daily-rotate-file")
const AWS = require("aws-sdk")
const WINSTON_CLOUDWATCH = require('winston-cloudwatch')

const HELLOWORLD_VERSION = process.env.HELLOWORLD_VERSION
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
    cloudwatch: {
        name: 'dy-helloworld-cloudwatch-log',
        level: 'info',
        logGroupName: '/aws/ecs/dy-helloworld',
        logStreamName: 'dy-helloworld',
        createLogGroup: true,
        createLogStream: true,
    }
};

  const LOGGER = WINSTON.createLogger({
    transports: [
        new (WINSTON.transports.Console)(OPTIONS.console),
        new WINSTON_CLOUDWATCH(OPTIONS.cloudwatch),
        new WINSTON_DAILY(OPTIONS.file),
        new WINSTON_DAILY(OPTIONS.errorFile),
    ],
    exitOnError: false,
  });

AWS.config.update({region:"ap-northeast-2"})
const CW_EVENTS = new AWS.CloudWatchEvents({apiVersion: "2015-10-07"})
const CW = new AWS.CloudWatch({apiVersion:"2010-08-01"})

HTTP.createServer(function (request, response) {
    let event = {
       Entries: [{
           Detail: JSON.stringify(request.headers),
           DetailType: "dy-helloworld application access request",
           Source: "dy-helloworld.app"
       }]
    }

    let metric = {
        MetricData: [{
            MetricName: "page_viewed",
            Dimensions: [{
                Name: "Version",
                Value: HELLOWORLD_VERSION
            }],
            Unit: "None",
            Value: 1.0
        }],
        Namespace: "HelloBigzeroWorld/traffic"
    }

    let isoDate = new Date().toISOString()
    LOGGER.info("Hello bigzero world version "+ HELLOWORLD_VERSION +" is called at " + isoDate);
   // Send the HTTP header
   // HTTP Status: 200 : OK
   // Content Type: text/plain
   response.writeHead(200, {'Content-Type': 'text/plain'})
   // Send the response body as "Hello World"
   response.end('Hello bigzero world !!!, HELLOWORLD_VERSION:'+ HELLOWORLD_VERSION + ", DATE:" + isoDate +' \n')
    CW_EVENTS.putEvents(event, function(err, data){
        if (err) {
            LOGGER.error("error", "an error occurred when (createing an event", {error: err})
        } else {
            LOGGER.info("created event", {entries: data.Entries})
        }
    })
    CW.putMetricData(metric, function(err, data) {
        if (err) {
            LOGGER.error("an error occurred when createing a metric", {error: err})
        } else {
            LOGGER.info("created metric", {data: JSON.stringify(data)})
        }
    })
}).listen(3000)

// Console will print the message
//console.log('Server running')
LOGGER.info("Server is Running ==> port:3000, version:" + HELLOWORLD_VERSION)
