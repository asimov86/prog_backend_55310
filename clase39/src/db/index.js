const mongoose = require('mongoose');
const {MONGODB_URI} = require('../public/js/config');

class MongoConnection{
    static #instance

    constructor(){
        this.connect();
    };

    async connect() {
        try {
            await mongoose.connect(MONGODB_URI);
            console.log('Connected to MongoDB');
        }catch (e) {
            console.log('Error connecting', e);
        }
    };

    static getInstance() {
        if(this.#instance) {
            return this.#instance;
        }

        this.#instance = new MongoConnection();
        return this.#instance;
    }
}
// Patrón Singleton

module.exports = MongoConnection;