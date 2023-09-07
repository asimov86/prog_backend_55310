const Users = require('../models/user.model');

class UsersDao {
    async findAll() {
        return await Users.find()
    }

    async insertOne(newUserInfo) {
        const newUser = await Users.create(newUserInfo);
        return newUser._id
    }

    async findOne(email, password) {
        const user = await Users.find({ email: email, password: password});
        return user;
    }
}

module.exports = UsersDao;