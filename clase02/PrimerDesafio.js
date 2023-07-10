/**Consigna */
/**Declarar una clase ProductManager */

class ProductManager {
    
    constructor(){
            this.id = 0;
            this.products = [];
            this.getProducts();
    }

    addProduct(title,description, productN, price, thumbnail, code, stock){
        // Si está vacío el array product, id = 0 sino id = id++;
        if (this.products.length === 0) {
            this.id = 0;
        }else{
            this.id = this.id + 1;
        }
        // Se verifica si el producto agregado ya existe, verificando su código.
        
        if (this.getProductByCode(code) === false) {
        this.products.push({
            id: this.id, 
            title: title, 
            description: description, 
            productN: productN, 
            price: price, 
            thumbnail: thumbnail, 
            code:code, 
            stock: stock
        });  
        }else {
            // Si existe product.code en el array product, se indica por consola que el producto existe. 
            console.log(`The product with code: ${code} ` + `exists.`);
        }
        
    }

    getProductByCode(code) {
        const resultado = this.products.find((product) => product.code === code);
        if (resultado === undefined) {
            return false;
        }
    }

    getProductById(id) {
        const resultado = this.products.find((product) => product.id === id);
        if (resultado === undefined) {
            return "Product Not Found";
        } else {
            return resultado;
        }
    }

    getProducts(){
        return this.products;
    }

  
}

/**Instancia */

const product = new ProductManager();
console.log(product);


// Se agregan los productos al array products
product.addProduct("Prueba0", "Producto prueba0", "Producto prueba0", 24, "prueba0", "2A32F3212", 32); 
product.addProduct("Prueba1", "Producto prueba1", "Producto prueba1", 24, "prueba1", "2A32F3213", 34); 
product.addProduct("Prueba2", "Producto prueba2", "Producto prueba2", 24, "prueba2", "2A32F3215", 36); 
product.addProduct("Prueba3", "Producto prueba3", "Producto prueba3", 24, "prueba3", "2A32F3217", 38); 



// En la prueba, si se quiere agregar un producto más de una vez. Se notifica que el producto ya existe. 
product.addProduct("Prueba1", "Producto prueba1", "Producto prueba1", 24, "prueba1", "2A32F3213", 34); 
//


// Trae todos los productos existentes en el array product
console.log(product.getProducts());


// Trae el producto por id, si existe en el array sino devuelve "Not found".
// Trae producto con id = 3
console.log(product.getProductById(3));
// No trae producto ya que el producto con id = 4, no existe. Por lo tanto, devuelve "Not found"
console.log(product.getProductById(4));
