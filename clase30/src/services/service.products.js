//const {Router} = require('express');
const ProductsDao = require('../DAOs/dbManagers/ProductsDao.js');

const Products = new ProductsDao();

const findAll = async (customQuery,page,limitValue,sort) => {
    try {
        return Products.findAll(customQuery,page,limitValue,sort);
    } catch (error) {
        throw error;
    }
};

const getById = async (pid) => {
    try {
        return Products.getById(pid);
    } catch (error) {
        throw error;
    }
}

const insertOne = async (newProductInfo) => {
    try {
        console.log(newProductInfo)
        return Products.insertOne(newProductInfo);
    } catch (error) {
        throw error;
    }
}

const update = async (newProductInfo, itemId) => {
    try {
        return Products.update(newProductInfo, itemId);
    } catch (error) {
        throw error;
    }
}

const deleteById = async (itemId) => {
    try {
        return Products.deleteById(itemId);
    } catch (error) {
        throw error;
    }
}

module.exports = {findAll, getById, insertOne, update, deleteById};