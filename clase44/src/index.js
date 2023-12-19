const {app, server, io} = require('./app');
const SocketConfig = require('./socketConfig');
const logger = require('../src/utils/winston/prodLogger.winston')
const port = 3000;

server.listen(port,()=>{
    logger.info(`Server running at port ${port}`);
});
 // Instancia de SocketHandler para configurar WebSocket
const socketConfig = new SocketConfig(io);
