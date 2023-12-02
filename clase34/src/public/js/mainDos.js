
const addProduct = document.getElementById('addProduct');
const errorElement = document.getElementById('error-message');

addProductToCart = async (pid) => {

    const cart = document.getElementById("carrito");
    const cid = cart.value;
    const options = {
     method:"POST",
     body:JSON.stringify({ product_id: pid }),
     headers:{
         "Content-Type":"application/json"
     }
    };
 
    const response = await fetch(
        `http://localhost:3000/api/carts/${cid}/products/${pid}`,
        options
       )
   
       if (response.ok) {
           const responseData = await response.json();
           localStorage.setItem('authToken', responseData.token);
           // Redirigir a la vista /api/views/products
           location.assign("/api/views/products");
           
       } else {
           // Si la respuesta no es exitosa (por ejemplo, error de autenticación)
           const errorData = await response.json(); // Parsear la respuesta como un objeto JSON si hay un mensaje de error
           errorElement.innerText = `Error: ${response.status} - ${errorData.error}`;
       }
 }

 deleteProductFromCart = async (pid) => {

    const cart = document.getElementById("carrito");
    cid = cart.value;
    const options = {
     method:"DELETE",
     body:JSON.stringify({ product_id: pid }),
     headers:{
         "Content-Type":"application/json"
     }
    };
 
    await fetch(
     `http://localhost:3000/api/carts/${cid}/products/${pid}`,
     options
    )
 }

 purchase = async () => {
    const cart = document.getElementById("carrito");
    const cid = cart.value;
    const options = {
        method:"POST",
        body:'',
        headers:{
            "Content-Type":"application/json"
        }
        
    }
    const response = await fetch(
        `http://localhost:3000/api/carts/${cid}/purchase`,
        options
       )
    if (response.ok) {
        const responseData = await response.json();
        localStorage.setItem('authToken', responseData.token);
        // Redirigir a la vista /api/views/products
        location.assign("/api/views/products");
        
    } else {
        // Si la respuesta no es exitosa (por ejemplo, error de autenticación)
        const errorData = await response.json(); // Parsear la respuesta como un objeto JSON si hay un mensaje de error
        errorElement.innerText = `Error: ${response.status} - ${errorData.error}`;
    }
};