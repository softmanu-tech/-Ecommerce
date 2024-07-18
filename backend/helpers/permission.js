const userModel = require("../models/userModel")

const uploadProductPermission =  async(userId) => {
    const user = await userModel.findById(userId)

    if(!user || user.role !== 'ADMIN'){
        throw new Error('Permission denied: Admin access required');
    }

    return true
} 

module.exports = uploadProductPermission