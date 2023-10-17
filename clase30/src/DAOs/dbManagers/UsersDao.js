const Users = require('../models/user.model');

class UsersDao {
    async findAll() {
        return await Users.find()
    }

    async insertOne(newUserInfo) {
        const newUser = await Users.create(newUserInfo);
        return newUser._id
    }

    async confirmNewUser(id) {
        try {
            let userExist = await Users.find({_id: id});
            if(userExist){
                const user = await Users.updateOne(
                    {_id: id}, 
                    {$set:{
                        confirmed:'true'}
                    }
                );
                return user;
            }   
            
        } catch (error) {
            console.log ("No se pudo actualizar el usuario. " + error)
        }
        
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