
const addProduct = document.getElementById('addProduct');


addProductToCart = async (pid) => {

    const cart = document.getElementById("carrito");
    console.log('hago clic')
    const cid = cart.value;
    const options = {
     method:"POST",
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
    await fetch(
        `http://localhost:3000/api/carts/${cid}/purchase`,
        options
       )
};