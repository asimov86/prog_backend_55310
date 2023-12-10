const usersController = require('../controllers/controller.users');
//const productsController = require('../controllers/controller.file.products');
const productsController = require('../controllers/controller.products');
const cartsController = require('../controllers/controller.carts');
const messagesController = require('../controllers/controller.messages');
const viewsController = require('../controllers/controller.views');
const sessionsController = require('../controllers/controller.sessions');
const authController = require('../controllers/controller.auth');
const mailingRouter = require('../controllers/controller.mailing');
const mockingController = require('../controllers/controller.mocks');
const loggerController = require('../controllers/controller.logger');
const errorHandler = require('../middleware/errors');

const router = app =>{
    app.use('/loggerTest', loggerController);
    app.use('/api/users', usersController);
    app.use('/api/products', productsController);
    app.use('/api/carts', cartsController);
    app.use('/api/chats',messagesController);
    app.use('/api/views', viewsController);
    app.use('/api/sessions', sessionsController);
    app.use(errorHandler);
    app.use('/api/mocking', mockingController);
    app.use('/mail', mailingRouter);
    app.use('/auth', authController);
    
    app.use('*', (req, res) => {
        res.render('notFound.handlebars')
      })
      
};

module.exports = router;