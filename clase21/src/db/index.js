const mongoose = require('mongoose');
//const { MONGODB_URI } = require('../public/config');
require('dotenv').config();

const connectMongo = async ()=> {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
    }catch (e) {
        console.log('Error connecting', e);
    }
};

module.exports = connectMongo;