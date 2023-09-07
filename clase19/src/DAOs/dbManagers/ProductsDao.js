const Products = require('../models/product.model');

class ProductsDao {
    async findAll(customQuery,page,limitValue,sort) {
        try{
            if(!customQuery){
                const {docs,hasPrevPage,hasNextPage,nextPage,prevPage,totalPages,prevLink,nextLink} = await Products.paginate({}, {limit:Number(limitValue) , page:Number(page),  sort: { price: sort }, lean:true});
                console.log('Entré')
                //console.log(docs);
                return {docs,hasPrevPage,hasNextPage,nextPage,prevPage,totalPages,prevLink,nextLink,page,limitValue,sort,customQuery}
            }else{
                const {docs,hasPrevPage,hasNextPage,nextPage,prevPage,totalPages,prevLink,nextLink} = await Products.paginate({category: customQuery}, {limit:Number(limitValue) , page:Number(page),  sort: { price: sort }, lean:true});
                
                console.log('Entré en el otro')
                //console.log(docs);
                return {docs,hasPrevPage,hasNextPage,nextPage,prevPage,totalPages,prevLink,nextLink,page,limitValue,sort,customQuery}
            }
            
            // return await Products.paginate({limit: Number(limit), page: Number(page)})
        }catch(error){
            console.log ("No se pudo traer los productos." + error);
            return { error: "No se pudo traer los productos." };
        }     
    }
    /* async findAll() {
        try{
            return await Products.find()
        }catch(error){
            console.log ("No se pudo traer los productos." + error);
            return { error: "No se pudo traer los productos." };
        }     
    }  */

 /*    async findAll() {
        try{
            return await Products.aggregate([
                {
                    $match: {category: 'Bebida'}
                },
                {
                    $group: {_id: '$category', category: {$sum: '$stock'}}
                },
                {
                    $sort: {
                }
            ])
        }catch(error){
            console.log ("No se pudo traer los productos." + error);
            return { error: "No se pudo traer los productos." };
        }     
    } */

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