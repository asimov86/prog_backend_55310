class ProductsApi {
    constructor() {
        this.elements = [{
            "id":1,
            "title":"Hamburguesa Simple",
            "description":"Hamburguesa simple con queso, tomate, cebolla, lechuga, pepinillos y papas fritas.",
            "product":"Hamburguesa",
            "price":980,
            "thumbnail":"https://i0.wp.com/www.opportimes.com/wp-content/uploads/2016/04/haburguesa-dos.png?resize=500%2C387&ssl=1",
            "code":"2A32F3212",
            "stock":85
        },
        {
            "id":2,
            "title":"Hamburguesa Doble","description":"Hamburguesa doble carne, doble queso, tomate, cebolla, lechuga, pepinillos y papas fritas.",
            "product":"Hamburguesa",
            "price":1080,
            "thumbnail":"https://st4.depositphotos.com/1328914/20814/i/600/depositphotos_208145482-stock-photo-double-cheeseburger-with-lettuce-tomato.jpg",
            "code":"2A32F3214",
            "stock":28
        },
        {
            "id":3,
            "title":"Coca Cola",
            "description":"Bebida Coca Cola de lata 355 ml.",
            "product":"Bebida",
            "price":980,
            "thumbnail":"https://i0.wp.com/www.opportimes.com/wp-content/uploads/2016/04/haburguesa-dos.png?resize=500%2C387&ssl=1",
            "code":"2A32F3226",
            "stock":120
        },
        {
            "id":4,
            "title":"Hamburguesa Triple",
            "description":"Hamburguesa triple con queso, tomate, cebolla, lechuga, pepinillos y papas fritas.",
            "product":"Hamburguesa",
            "price":1380,
            "thumbnail":"https://i0.wp.com/www.opportimes.com/wp-content/uploads/2016/04/haburguesa-dos.png?resize=500%2C387&ssl=1",
            "code":"2A32F3228",
            "stock":189
        },
        {
            "id":5,
            "title":"Hamburguesa cuadruple",
            "description":"Hamburguesa cuadruple con queso, tomate, cebolla, lechuga, pepinillos y papas fritas.",
            "product":"Hamburguesa",
            "price":1580,
            "thumbnail":"https://i0.wp.com/www.opportimes.com/wp-content/uploads/2016/04/haburguesa-dos.png?resize=500%2C387&ssl=1",
            "code":"2A32F3230",
            "stock":98
        },
        {
            "id":6,
            "title":"Hamburguesa de pollo",
            "description":"Hamburguesa de pollo con queso, tomate, cebolla, lechuga, pepinillos y papas fritas.",
            "product":"Hamburguesa",
            "price":1180,
            "thumbnail":"https://i0.wp.com/www.opportimes.com/wp-content/uploads/2016/04/haburguesa-dos.png?resize=500%2C387&ssl=1",
            "code":"2A32F3231",
            "stock":83
        }
    ]
        this.id = 6
    }

    show(id) {
        const elem = this.elements.find(elem => elem.id == id)
        return elem || { error: `elemento no encontrado` }
    }

    showAll() {
        return [...this.elements]
    }

    save(elem) {
        const newElem = { ...elem, id: ++this.id }
        this.elements.push(newElem)
        return newElem
    }

    update(elem, id) {
        const newElem = { id: Number(id), ...elem }
        const index = this.elements.findIndex(p => p.id == id)
        if (index !== -1) {
            this.elements[index] = newElem
            return newElem
        } else {
            return { error: `elemento no encontrado` }
        }
    }

    delete(id) {
        const index = this.elements.findIndex(elem => elem.id == id)
        if (index !== -1) {
            return this.elements.splice(index, 1)
        } else {
            return { error: `elemento no encontrado` }
        }
    }

    deleteAll() {
        this.elements = []
    }
}

module.exports = ProductsApi
