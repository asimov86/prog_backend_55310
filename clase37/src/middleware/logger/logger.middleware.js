const winstonLogger = require("../../utils/winston/logger");

const addLogger = (req, res, next) =>{
    let today = new Date();
    let date = today.toLocaleDateString();
    let time = today.toLocaleTimeString();
    let dateAndTime = date + ' - ' + time;
    req.logger = winstonLogger;
    req.logger.http(`Method: ${req.method} en ${JSON.stringify(req.url)} - Headers: ${JSON.stringify(req.headers)}  - Params: ${JSON.stringify(req.params)} - Query: ${JSON.stringify(req.query)} - Body: ${JSON.stringify(req.body)} - ${dateAndTime}`);
    next();
}

module.exports = addLogger;