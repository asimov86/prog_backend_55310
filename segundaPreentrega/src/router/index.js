const usersController = require('../controllers/controller.users');
//const productsController = require('../controllers/controller.file.products');
const productsController = require('../controllers/controller.products');
const cartsController = require('../controllers/controller.carts');
const messagesController = require('../controllers/controller.messages');
const viewsController = require('../controllers/controller.views');

const router = app =>{
    app.use('/users', usersController);
    app.use('/api/products', productsController);
    app.use('/api/carts', cartsController);
    app.use('/api/chats',messagesController);
    app.use('/api/views', viewsController);
};

module.exports = router;