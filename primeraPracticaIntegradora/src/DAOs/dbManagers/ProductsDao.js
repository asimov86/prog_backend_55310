const Products = require('../models/product.model');

class ProductsDao {
    async findAll() {
        try{
            return await Products.find()
        }catch(error){
            console.log ("No se pudo traer los productos." + error);
            return { error: "No se pudo traer los productos." };
        }     
    }

    async getById(pid) {
        try{
            const prod = await Products.findById({_id:pid});
            return prod
        }catch(error){
            console.log ("No se pudo traer el producto." + error);
            return { error: "No se pudo traer el producto." };
        } 
    };

    async insertOne(newProductInfo) {
        const { title, description, category, price, thumbnail, code, stock } = newProductInfo;
        // Verifica si alguno de los campos está vacío o ausente
        if (!title || !description || !category || !price || !thumbnail || !code || !stock) {
            return { error: "Todos los campos son obligatorios" };
        }
        try {
            const newProduct = await Products.create(newProductInfo);
            return newProduct._id
        } catch (error) {
            console.log ("No se pudo insertar el producto." + error);
            return { error: 'Hubo un error al crear el producto' };
        }
        
    }

    async update(item, itemId) {
        try {
            let{title, description, category, price, status, thumbnail, code, stock} =item;
            console.log(itemId);
            let existProduct = await Products.find({_id: itemId});
            if(existProduct){
                const prod = await Products.updateOne(
                    {_id: itemId}, 
                    {$set:{
                        title:title, 
                        description:description, 
                        category:category, 
                        price:price, 
                        thumbnail:thumbnail, 
                        code:code, 
                        stock:stock}
                    }
                );
                return prod
        }   
        } catch (error) {
            console.log ("No se pudo insertar el producto. " + error)
        }
    }

    async deleteById(itemId) {
        try {
            const prod = await Products.deleteOne({_id:itemId});
            return prod 
        } catch (error) {
            console.log ("No se pudo borrar el producto. " + error)
        }    
    };
}

module.exports = ProductsDao;