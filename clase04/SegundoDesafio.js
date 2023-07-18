const fs = require("fs");


//Objetos a utilizar para las pruebas
const itemUno =
    {
        title:"Hamburguesa Simple",
        description:"Hamburguesa simple con queso, tomate, cebolla, lechuga, pepinillos y papas fritas.",
        product:"Hamburguesa",
        price:980,
        thumbnail:"https://i0.wp.com/www.opportimes.com/wp-content/uploads/2016/04/haburguesa-dos.png?resize=500%2C387&ssl=1",
        code:"2A32F3212",
        stock:85       
    }
const itemDos =
    {   
        title:"Hamburguesa Doble",
        description:"Hamburguesa doble carne, doble queso, tomate, cebolla, lechuga, pepinillos y papas fritas.",
        product:"Hamburguesa",
        price:1080,
        thumbnail:"https://st4.depositphotos.com/1328914/20814/i/600/depositphotos_208145482-stock-photo-double-cheeseburger-with-lettuce-tomato.jpg",
        code:"2A32F3214",
        stock:18 
    }

const itemTres =
    {   
        title:"Coca Cola",
        description:"Bebida Coca Cola de lata 355 ml.",
        product:"Bebida",
        price:980,
        thumbnail:"https://i0.wp.com/www.opportimes.com/wp-content/uploads/2016/04/haburguesa-dos.png?resize=500%2C387&ssl=1",
        code:"2A32F3222",
        stock:120  
    }
///////////////////////////

class ProductManager{
    constructor(path){
        this.path = path;
        this.getProducts();
        this.products = [];
        
    }

    // -----------------------------------------------------------------------------------------------
    // Antes de agregar el producto al archivo se valida que llegan todas las props 
    // ejmeplo: if(title&& description&& price&& thumbnail&& code&& stock)
    // ---------------------------------------------------------------------------------------------
    async addProduct(title, description, product, price, thumbnail, code, stock){
        
        try {
            if(title && description && price && thumbnail && code && stock){
                //console.log("Llegó todo el producto");
                let item = { 
                    title: title, 
                    description: description, 
                    product: product,
                    price: price, 
                    thumbnail: thumbnail, 
                    code:code, 
                    stock: stock
                };
                let data = await fs.promises.readFile(`./${this.path}.txt`, 'utf-8');
                data = JSON.parse(data);
                if(data === '[]') {
                    data.push(item);
                } else {
                    item.id = data.length + 1;
                    data.push(item);
                }

                if (await this.getProductByCode(item.code) === false) {
                    //console.log("Se guarda el item");
                    await fs.promises.writeFile(`./${this.path}.txt`, JSON.stringify(data));
                    return item.id; 
                    // Si el item no existe en el archivo se agrega y se retorna el id del item agregado
                }else {
                    // Si existe product.code en el array product, se indica por consola que el producto existe. 
                    console.log(`El producto que intenta ingresar ya existe.`);
                }   
            }
        } catch(error) {
            console.log(`Hubo un error ${error}`);
        }
    }
    // --------------------------------------------------------------------------------------------------
    // updateProducto recibe dos argumentos (id, newData)
    // --------------------------------------------------------------------------------------------------

    async updateProduct(id, item){
        try {
            //Buscamos si existe el producto
            let findProduct = await this.getProductByCode(item.code);
            //console.log(`Find product ${findProduct}`);
            //leemos el archivo
            if (findProduct===true) {
                let data = await fs.promises.readFile(`./${this.path}.txt`, 'utf-8');
                data = JSON.parse(data);
                const findByIndex = data.findIndex((product) => product.id === id);
                item.id = id;
                const updateItem = data.splice(findByIndex,1,item);
                await fs.promises.writeFile(`./${this.path}.txt`, JSON.stringify(data));
                return data;
            }
        } catch(error) {
            console.log(`Hubo un error ${error}`);
        } 
}

   async getProductByCode(code) {
        try{
            let data = await fs.promises.readFile(`./${this.path}.txt`, 'utf-8');
            data = JSON.parse(data);
            let resultado = data.find(item => item.code === code);
            if (!resultado) {
                return false
                //devuelve false si el item no existe en el archivo
            }else{
                return true
                //devuelve true si el item existe en el archivo
            }
        }catch(err){
            return console.log('Error de lectura!', err);
        }
    }

    async getProductById(id){
        try{
            let data = await fs.promises.readFile(`./${this.path}.txt`, 'utf-8');
            data = JSON.parse(data);
            let resultado = data.find(item => item.id === id);
            if (!resultado) {
                return "Product Not Found";
            } else {
                return resultado;
            }
        }catch(err){
            return console.log('Error de lectura!', err);
        }
    }
    
    async getProducts(){
        //console.log("Se valida que el archivo exista.")
        try{
            let fileExists = fs.existsSync(`./${this.path}.txt`);
            console.log(`File exists: ${fileExists}`);
            if(fileExists == true) {
                let data = await fs.promises.readFile(`./${this.path}.txt`, 'utf-8');
                data = JSON.parse(data);
                return data;
            }else{
                let data = [];
                console.log("Entro a crear el archivo vacío.");
                await fs.promises.writeFile(`./${this.path}.txt`, JSON.stringify(data));
                return data;
            }
        }catch(err){
                return console.log('Método getProducts. Error de lectura!', err);
            } 
        }

    async deleteProductById(id){
        try{
            let data = await fs.promises.readFile(`./${this.path}.txt`, 'utf-8');
            data = JSON.parse(data);
            const newData = data.filter((item) => item.id !== id);
            for (let i = 0; i < newData.length; i++) {//Actualizo la posición de los productos en el array luego de borrar un item.
               newData[i].id = (i + 1);
            }
            await fs.promises.writeFile(`./${this.path}.txt`, JSON.stringify(newData));
            return newData;
        }catch(err){
            return console.log('Error de lectura!', err);
        }
    }

    async deleteProducts(){
        try{
            let deleteAll = [];
            await fs.promises.writeFile(`./${this.path}.txt`, JSON.stringify(deleteAll));
            let deleteData = await fs.promises.readFile(`./${this.path}.txt`, 'utf-8');
            return deleteData;
        }catch(err){
            return console.log('Error de lectura!', err);
        }
    }

    }

const compra = new ProductManager('productos');


//------------------------------------------------
//--    Para las pruebas descomentar cada línea
//------------------------------------------------

// Agregar de a un producto.

//compra.addProduct("Hamburguesa Simple","Hamburguesa simple con queso, tomate, cebolla, lechuga, pepinillos y papas fritas.","Hamburguesa",980,"https://i0.wp.com/www.opportimes.com/wp-content/uploads/2016/04/haburguesa-dos.png?resize=500%2C387&ssl=1","2A32F3212",85);
//compra.addProduct("Hamburguesa Doble","Hamburguesa doble carne, doble queso, tomate, cebolla, lechuga, pepinillos y papas fritas","Hamburguesa",1080,"ttps://st4.depositphotos.com/1328914/20814/i/600/depositphotos_208145482-stock-photo-double-cheeseburger-with-lettuce-tomato.jpg","2A32F3214",28);
//compra.addProduct("Coca Cola","Bebida Coca Cola de lata 355 ml.","Bebida",980,"https://i0.wp.com/www.opportimes.com/wp-content/uploads/2016/04/haburguesa-dos.png?resize=500%2C387&ssl=1","2A32F3222",120);


//compra.getProducts().then(data=>{console.log(data)});

//compra.getProductById(1).then(resultado=>{console.log(resultado)});

//compra.updateProduct(1,itemDos);

// Al borrar se actualiza la posición de cada producto
//compra.deleteProductById(1).then(newData=>{console.log(newData)});

// Elimina todos los productos. 
//compra.deleteProducts().then(deleteData=>{console.log(deleteData)});

