const Products = require('../models/mongo/product.model');

class ProductsDao {
    constructor(logger) {
        this.logger = logger;
    }

    async findAll(customQuery,page,limitValue,sort) {
        try{
            if(!customQuery){
                const {docs,hasPrevPage,hasNextPage,nextPage,prevPage,totalPages,prevLink,nextLink} = await Products.paginate({}, {limit:Number(limitValue) , page:Number(page),  sort: { price: sort }, lean:true});
                return {docs,hasPrevPage,hasNextPage,nextPage,prevPage,totalPages,prevLink,nextLink,page,limitValue,sort,customQuery}
            }else{
                const {docs,hasPrevPage,hasNextPage,nextPage,prevPage,totalPages,prevLink,nextLink} = await Products.paginate({category: customQuery}, {limit:Number(limitValue) , page:Number(page),  sort: { price: sort }, lean:true});
                return {docs,hasPrevPage,hasNextPage,nextPage,prevPage,totalPages,prevLink,nextLink,page,limitValue,sort,customQuery}
            }
            
            // return await Products.paginate({limit: Number(limit), page: Number(page)})
        }catch(error){
            return ("Products not found.");
        }     
    }

    async getById(pid) {
        try{
            const prod = await Products.findById({_id:pid});
            if(!prod) {
                this.logger.info("Product not found.");
                return "Product not found.";
            }
            return prod
        }catch(error){
            return ("Product not found.");
        } 
    };

    async insertOne(newProductInfo) {
        try {
            const { title, description, category, price, thumbnail, code, stock } = newProductInfo;
            // Verifica si alguno de los campos está vacío o ausente
            if (!title || !description || !category || !price || !thumbnail || !code || !stock) {
                return { error: "All fields are required." };
            }
            const newProduct = await Products.create(newProductInfo);
            return newProduct._id
        } catch (error) {
            return ("The product could not be inserted", error);
        }
    }

    async update(item, itemId) {
        try {
            let{title, description, category, price, thumbnail, code, stock} =item;
            let existProduct = await Products.find({_id: itemId});
            if(existProduct && existProduct.length > 0){
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
            }  else {
                throw new Error("Product not found");
            }
        } catch (error) {
            return ("The product could not be updated: " + error.message);
        }
    }

    async deleteById(itemId) {
        try {
            const prod = await Products.deleteOne({_id:itemId});
            if (prod.deletedCount !== 0) {
                return prod 
            }else{
                throw new Error("Product not found");
            }
        } catch (error) {
            return ("The product could not be deleted. " + error.message)
        }    
    };
}

module.exports = ProductsDao;