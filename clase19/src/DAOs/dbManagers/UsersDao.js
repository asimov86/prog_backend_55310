const Users = require('../models/user.model');

class UsersDao {
    async findAll() {
        return await Users.find()
    }

    async insertOne(newUserInfo) {
        const newUser = await Users.create(newUserInfo);
        return newUser._id
    }

    async find(email) {
        const user = await Users.findOne({ email: email});
        return user;
    }
}

module.exports = UsersDao;