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

    async findById(uid) {
        const user = await Users.findOne({ _id: uid});
        return user;
    }
}

module.exports = UsersDao;