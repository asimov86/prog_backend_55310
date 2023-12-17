const chai = require('chai');
const supertest = require('supertest');
const { v4: uuidv4 } = require('uuid');

const expect = chai.expect;
const requester = supertest('http://localhost:3000');

describe('Pruebas con supertest', () => {
    describe('Pruebas para el router de sessions.', () => {
        let cookie;
        // Register
        it('POST - Debe crear un usuario desde /api/sessions/register. ', async () => {
            const name = uuidv4();
            const mockUser = {
                name: `User${name}`,
                lastname: "TestUser410",
                email: `testuser${name}@datos.com`,
                age: 21,
                password: "4321"
            };
            const {_body} = await requester.post('/api/sessions/register').send(mockUser);
            expect(_body.message).to.be.equal('User successfully registered.');     
        }).timeout(3000);
        // Login
        it('POST - Debe loguear correctamente a un usuario. ', async () => {
            const mockUser = {
                email: "hsimpson@mail.com",
                password: "1234"
            };
            const res = await requester.post('/api/sessions/login').send(mockUser);
            expect(res.body.payload).to.be.equal('New session initialized');  
            const cookieResult = res.header['set-cookie'][0];
            expect(cookieResult).to.be.ok;
            cookie = {
                name: cookieResult.split('=')[0],
                value: cookieResult.split('=')[1]
            }
            expect(cookie.name).to.be.ok.and.equal('authCookie');
            expect(cookie.value).to.be.ok;
        })
        // Current
        it('GET  - Debe enviar la cookie que contiene el usuario y destructurar a éste correctamente desde /api/session/current. ', async () => {
            const {_body} = await requester.get('/api/sessions/current').set('Cookie', [`${cookie.name}=${cookie.value}`]);
            expect(_body.user.user).to.be.equal('65628c7c1ab02e6db7613bb1');

        })
        
    });

    describe('Pruebas para el router de products', ()=>{
        let cookie;
        let pid;
        let ownerId;
        //-- Esto lo agregué para simular el login del usuario que va a crear el producto
        // Login
        it('POST - Debe loguear correctamente a un usuario. ', async () => {
            const mockUser = {
                email: "hsimpson@mail.com",
                password: "1234"
            };
            const res = await requester.post('/api/sessions/login').send(mockUser);
            expect(res.body.payload).to.be.equal('New session initialized');  
            const cookieResult = res.header['set-cookie'][0];
            expect(cookieResult).to.be.ok;
            cookie = {
                name: cookieResult.split('=')[0],
                value: cookieResult.split('=')[1]
            }
            expect(cookie.name).to.be.ok.and.equal('authCookie');
            expect(cookie.value).to.be.ok;
        })
        // Current
        it('GET  - Debe enviar la cookie que contiene el usuario y destructurar a éste correctamente desde /api/session/current. ', async () => {
            const {_body} = await requester.get('/api/sessions/current').set('Cookie', [`${cookie.name}=${cookie.value}`]);
            expect(_body.user.user).to.be.equal('65628c7c1ab02e6db7613bb1');

        })
        // ----------------------------------------------------------------------------------
        it('GET - Debe traer todos los productos y tener la estructura apropiada para renderizar correctamente los productos y sus propiedades.', async ()=>{
            const array = await requester.get('/api/products');
            const _body = array.body;
            expect(_body.messages).to.have.property('docs').and.to.be.an('array');
            expect(_body.messages).to.have.property('hasPrevPage').and.to.be.a('boolean');
            expect(_body.messages).to.have.property('hasNextPage').and.to.be.a('boolean');
            expect(_body.messages).to.have.property('prevPage').and.to.be.a('null');
            expect(_body.messages).to.have.property('nextPage').and.to.be.a('number');
            expect(_body.messages).to.have.property('totalPages').and.to.be.a('number');
            expect(_body.messages).to.have.property('limitValue').and.to.be.a('number');
            expect(_body.messages).to.have.property('sort');
            expect(_body.messages).to.have.property('customQuery');
        })

        it('GET - Debe traer por id el array de un producto.', async ()=>{
            pid = '64e3b60cb4ebc3a17601871a';
            const {_body} = await requester.get(`/api/products/${pid}`);;
            const { messages } = _body;
            expect(messages).to.have.property('_id').and.to.be.a('string');
            expect(messages).to.have.property('title').and.to.be.a('string');
            expect(messages).to.have.property('description').and.to.be.a('string');
            expect(messages).to.have.property('category').and.to.be.a('string');
            expect(messages).to.have.property('price').and.to.be.a('number');
            expect(messages).to.have.property('thumbnail').and.to.be.a('string');
            expect(messages).to.have.property('code').and.to.be.a('string');
            expect(messages).to.have.property('stock').and.to.be.a('number');
            expect(messages).to.have.property('modifyTimestamp').and.to.be.a('string');
            expect(messages).to.have.property('createTimestamp').and.to.be.a('string');
        })

        it('POST - Debe loguear correctamente a un usuario. ', async () => {
            const mockUser = {
                email: "hsimpson@mail.com",
                password: "1234"
            };
            const res = await requester.post('/api/sessions/login').send(mockUser);
            expect(res.body.payload).to.be.equal('New session initialized');  
            const cookieResult = res.header['set-cookie'][0];
            expect(cookieResult).to.be.ok;
            cookie = {
                name: cookieResult.split('=')[0],
                value: cookieResult.split('=')[1]
            }
            expect(cookie.name).to.be.ok.and.equal('authCookie');
            expect(cookie.value).to.be.ok;
        })
        // Current
        it('GET  - Debe enviar la cookie que contiene el usuario y destructurar a éste correctamente desde /api/session/current. ', async () => {
            const {_body} = await requester.get('/api/sessions/current').set('Cookie', [`${cookie.name}=${cookie.value}`]);
            expect(_body.user.user).to.be.equal('65628c7c1ab02e6db7613bb1');
        })
        it('POST - Debe crear un nuevo producto.', async () => {
            const mockProduct = {
                title: "Producto de prueba Test Create",
                description: "Producto de prueba Test Create",
                category: "comida",
                price: 6980,
                thumbnail: "https://st4.depositphotos.com/1328914/20814/i/600/depositphotos_208145482-stock-photo-double-cheeseburger-with-lettuce-tomato.jpg",
                code: "2AD2D3224",
                stock: 81,
                owner: "65628c7c1ab02e6db7613bb1"
            };
            ownerId = mockProduct.owner;
            const res = await requester.post('/api/products').send(mockProduct);
            expect(res._body.status).to.be.equal('success');
            expect(res._body.message).to.be.contain('The product has been created with ID:');  
            pid = res._body.productId;
        }).timeout(5000);

        it('DELETE - Un usuario no debe eliminar un producto si no es su owner.', async () => {
            noOwnerId = '656b386da5b0268f4c15157a';
            const {_body} = await requester.delete(`/api/products/${pid}`).send({ ownerId: noOwnerId });
            expect(_body.status).to.be.equal('error');
            expect(_body.message).to.be.contain('El usuario actual no es owner del producto, no se puede eliminar.');  
        }).timeout(5000);

        it('DELETE - Debe eliminar un producto.', async () => {
            const {_body} = await requester.delete(`/api/products/${pid}`).send({ ownerId: ownerId });
            expect(_body.status).to.be.equal('success');
            expect(_body.message.deletedCount).to.be.equal(1);
        }).timeout(3000);
    })


    describe('Pruebas para el router carts.', ()=>{
        it('POST - No debe agregar el producto a un carrito si el usuario es owner del producto.', async ()=>{
            const cid = '65628c7c1ab02e6db7613bae';
            const pid = '657641393c048b1aa4365c78';
            const {_body} = await requester.post(`/api/carts/${cid}/products/${pid}`);
            expect(_body.status).to.be.equal('error');
            expect(_body.message).to.be.contain('El producto ya le pertenece al usuario.');
        }).timeout(3000);

        it('POST - Debe agregar el producto a un carrito.', async ()=>{
            const cid = '65628c7c1ab02e6db7613bae';
            const pid = '657633f6111571a8ff0aada0';
            const res = await requester.post(`/api/carts/${cid}/products/${pid}`);
            expect(res._body.status).to.be.equal('success');
            expect(res._body.message.acknowledged).to.be.equal(true);
        }).timeout(3000);

        it('DELETE - Eliminar producto de un carrito.', async ()=>{
            const cid = '65628c7c1ab02e6db7613bae';
            const pid = '657633f6111571a8ff0aada0';
            const res = await requester.delete(`/api/carts/${cid}/products/${pid}`);
            expect(res._body.message.acknowledged).to.be.equal(true);
        }).timeout(3000);
    })
});