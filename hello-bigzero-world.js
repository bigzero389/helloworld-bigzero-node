const HTTP = require("http")
const AWS = require("aws-sdk")
AWS.config.update({region: "ap-northeast-2"})
const WINSTON = require("winston")
const WINSTON_CLOUDWATCH = require('winston-cloudwatch')
const WINSTON_DAILY = require("winston-daily-rotate-file")
const WINSTON_FIREHOSE = require("winston-firehose")

const PORT = 3000
const HELLOWORLD_VERSION = process.env.HELLOWORLD_VERSION
const HOSTNAME = process.env.HOSTNAME

const hostFormat = WINSTON.format(info => {
    info.version = HELLOWORLD_VERSION
    info.hostname = HOSTNAME
    info.appname = "dy-helloworld"
    return info
})

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
    },
    firehose: {
        streamName: 'dy-kinesis-firehose-es',
        region: 'ap-northeast-2'
    }
};

let LOGGER;

if(process.env.NODE_ENV === 'production') {
    LOGGER = WINSTON.createLogger({
        transports: [
            new WINSTON.transports.Console(OPTIONS.console),
            new WINSTON_CLOUDWATCH(OPTIONS.cloudwatch),
            new WINSTON_FIREHOSE(OPTIONS.firehose),
            new WINSTON_DAILY(OPTIONS.file),
            new WINSTON_DAILY(OPTIONS.errorFile),
        ],
        format: WINSTON.format.combine(
            hostFormat(),
            WINSTON.format.json()
        ),
        exitOnError: false,
    });
} else {
    LOGGER = WINSTON.createLogger({
        transports: [
            new WINSTON.transports.Console(OPTIONS.console)
        ],
        exitOnError: false,
    });
}


const CW_EVENTS = new AWS.CloudWatchEvents({apiVersion: "2015-10-07"})
const CW = new AWS.CloudWatch({apiVersion: "2010-08-01"})

HTTP.createServer(function (request, response) {
    let event = {
        Entries: [{
            Detail: JSON.stringify(request.headers),
            DetailType: "hello-bigzero-world application access request",
            Source: "hello-bigzero-world.app"
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
    LOGGER.info("Hello bigzero world version " + HELLOWORLD_VERSION + " is called at " + isoDate);
    // Send the HTTP header
    // HTTP Status: 200 : OK
    // Content Type: text/plain
    response.writeHead(200, {'Content-Type': 'text/plain'})
    // Send the response body as "Hello World"
    response.end('Hello bigzero world !!!, HELLOWORLD_VERSION:' + HELLOWORLD_VERSION + ", DATE:" + isoDate + ' \n')

    CW_EVENTS.putEvents(event, function (err, data) {
        if (err) {
            LOGGER.error("error", "an error occurred when (createing an event", {error: err})
        } else {
            LOGGER.info("created event", {entries: data.Entries})
        }
    })
    CW.putMetricData(metric, function (err, data) {
        if (err) {
            LOGGER.error("an error occurred when createing a metric", {error: err})
        } else {
            LOGGER.info("created metric", {data: JSON.stringify(data)})
        }
    })
}).listen(3000)

// Console will print the message
//console.log('Server running')
LOGGER.info("Server is Running ==> env:"+process.env.NODE_ENV+", hostname:"+HOSTNAME+", port:"+PORT+", version:"+HELLOWORLD_VERSION)
