const socket = io.connect();
const addProduct = document.getElementById('addProduct');

addProduct.addEventListener('submit', e => {
    e.preventDefault()
    const producto = {
        title: addProduct[0].value,
        description: addProduct[1].value,
        price: addProduct[2].value,
        stock: addProduct[3].value,
        thumbnail: addProduct[4].value
    }
    socket.emit('update', producto);
    addProduct.reset()
});


// ------------ Renderizamos --------------------
// --------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------
const tabla = document.getElementById('tabla');
socket.on('products', productos => {
    makeHtmlTable(productos);
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

function makeHtmlTable(products) {
    const tabla = document.getElementById('tabla');
    let conjunto = ''
    if (products.length > 0) {
    products.map((e)=> {
        conjunto += 
        
        `
            <tr id="${e.id}">
              <th scope="row">${e.id}</th>
              <td>${e.title}</td>
              <td>${e.description}</td>
              <td>$${e.price}</td>
              <td colspan="2">${e.stock}</td>
              <td>
                <img style="height: 54px;" src="${e.thumbnail}" >
              </td>
              <td>
              <button type="button" class="btn btn-danger btn-sm btnDelete" data-product-id="${e.id}" data-product-data='${JSON.stringify(products)}'>Eliminar</button>
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
    console.log(productId);
    console.log(productData);
    const newProducts = productData.filter(p => p.id !== parseInt(productId));
    console.log(newProducts)
    makeHtmlTable(newProducts);
}

