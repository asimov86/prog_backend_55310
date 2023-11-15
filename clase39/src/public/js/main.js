const socket = io.connect();
const addProduct = document.getElementById('addProduct');

addProduct.addEventListener('submit', e => {
    e.preventDefault()
    const producto = {
        title: addProduct[0].value,
        description: addProduct[1].value,
        category: addProduct[2].value,
        price: parseFloat(addProduct[3].value),
        thumbnail: addProduct[4].value,
        code: addProduct[5].value,
        stock: parseFloat(addProduct[6].value)
    }
    socket.emit('update', producto);
    addProduct.reset()
});

// ------------ Renderizamos --------------------
// --------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------
const tabla = document.getElementById('tabla');
//const nav = document.getElementById('nav');
socket.on('products', initialProducts => {
    makeHtmlTable(initialProducts);
    //makeHtmlNav(initialProducts);
});
// En el socket.on para el evento 'productDeleted'
socket.on('productDeleted', newProducts => {
    makeHtmlTable(newProducts);
});

// --------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------

function addDeleteButtonListeners() {
    const deleteButtons = document.querySelectorAll('.btnDelete');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            const productData = JSON.parse(this.getAttribute('data-product-data'));
            deleteProducts(productId, productData);
        });
    });
}

function addButtonListeners() {
    const addButtons = document.querySelectorAll('.btnAddtoCart');
    addButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            const productData = JSON.parse(this.getAttribute('data-product-data'));
            addProducts(productId, productData);
        });
    });
}

function makeHtmlTable(initialProducts) {
    const tabla = document.getElementById('tabla');
    let conjunto = ''
    const products = initialProducts.docs;
    //console.log(products);
    if (products.length > 0) {
        products.map((e)=> {
            conjunto += 
            
            `
                <tr id="${e._id}">
                <th scope="row">${e._id}</th>
                <td>${e.title}</td>
                <td>${e.description}</td>
                <td>$${e.price}</td>
                <td colspan="2">${e.stock}</td>
                <td>
                    <img style="height: 54px;" src="${e.thumbnail}" >
                </td>
                <td>
                <button type="button" class="btn btn-danger btn-sm btnDelete" data-product-id="${e._id}" data-product-data='${JSON.stringify(products)}'>Eliminar</button>
                </td>
                <td>
                <button type="button" class="btn btn-primary btn-sm btnAddtoCart" data-product-id="${e._id}" data-product-data='${JSON.stringify(products)}'>Agregar</button>
                </td>
                </tr> 
            `
        })
    }else{
        conjunto = `<tr><td colspan="8"><h3>No hay productos</h3></td></tr>` 
    }
    tabla.innerHTML = conjunto
    // Agrega oyentes de eventos después de renderizar
    addDeleteButtonListeners();
}

function deleteProducts(productId, productData) {
    socket.emit('delete', productId);
}
// Agregar al carrito
function addProducts(productId, productData) {
    socket.emit('add', productId);
}



addProductToCart = async (pid) => {

    const cart = document.getElementById("carrito");
    cid = cart.value;
    const options = {
     method:"POST",
     body:"",
     headers:{
         "Content-Type":"application/json"
     }
    };
 
    await fetch(
     `http://localhost:3000/api/carts/${cid}/products/${pid}`,
     options
    )
 }

 deleteProductFromCart = async (pid) => {

    const cart = document.getElementById("carrito");
    cid = cart.value;
    const options = {
     method:"DELETE",
     body:"",
     headers:{
         "Content-Type":"application/json"
     }
    };
 
    await fetch(
     `http://localhost:3000/api/carts/${cid}/products/${pid}`,
     options
    )
 }