const winston = require('winston');



/* import config from './public/js/config.js';

console.log(config); */
/* const environment = config.ENVIRONMENT === "development" ? "debug" : "info";

const customLevelsOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5,
    },
    colors: {
        fatal: "red",
        error: "magenta",
        warning: "yellow",
        info: "blue",
        http: "green",
        debug: "white",
    }
} */

const winstonLogger = winston.createLogger({
    // levels: customLevelsOptions.levels,
    transports:[
        /*new winston.transports.Console({
            level: environment,
            format:winston.format.combine(
                winston.format.colorize({colors:customLevelsOptions.colors}),
                winston.format.simple()
            ),
        }), */
        new winston.transports.Console({
            level:"http"
        }), 
        new winston.transports.File({
            filename: './errors.log', 
            level: "warn",
            format: winston.format.simple()
        }),
        new winston.transports.File({
            filename: './debug.log', 
            level: "debug",
            format: winston.format.simple()
        })
    ]
})

 

module.exports = winstonLogger;