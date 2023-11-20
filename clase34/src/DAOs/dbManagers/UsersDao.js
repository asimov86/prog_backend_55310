const Users = require('../models/mongo/user.model');

class UsersDao {
    async findAll() {
        return await Users.find()
    }

    async insertOne(newUserInfo) {
        const newUser = await Users.create(newUserInfo);
        return newUser._id
    }

    async confirmNewUser(userId) {
        try {
            let userExist = await Users.find({_id: userId});
            if(userExist){
                const user = await Users.updateOne(
                    {_id: userId}, 
                    {$set:{
                        confirmed:'true'}
                    }
                );
                return user;
            }   
            
        } catch (error) {
            return ("No se pudo actualizar el usuario. " + error.message);
        }
        
    }

    async getUserByEmail(email) {
        const user = await Users.findOne({ email: email});
        return user;
    }

    async findById(uid) {
        const user = await Users.findOne({ _id: uid});
        return user;
    }
    async findByCart(cid) {
        const user = await Users.findOne({ cart: cid});
        return user;
    }

}

module.exports = UsersDao;