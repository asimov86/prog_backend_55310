const roleModel = require('../DAOs/dbManagers/RolesDao');

const role = new roleModel();

const getRoleByID = async (uid) => {
    try {
        return role.findById(uid);
    } catch (error) {
        throw error;
    }
}

module.exports = {getRoleByID};