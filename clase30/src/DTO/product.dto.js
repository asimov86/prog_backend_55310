class ProductDto {
    constructor(ProductRegister) {
        this.title = ProductRegister.title;
        this.description = ProductRegister.description;
        this.category = ProductRegister.category;
        this.price = ProductRegister.price;
        this.thumbnail = ProductRegister.thumbnail;
        this.code = ProductRegister.code;
        this.stock = ProductRegister.stock;
    }
}

module.exports = ProductDto;