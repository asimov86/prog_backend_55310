const Roles = require('../models/mongo/role.model');


class Role{
    async findById(uid) {
        const role = await Roles.findOne({ _id: uid});
        return role;
    }
}

module.exports = Role;