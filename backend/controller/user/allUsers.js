const userModel = require("../../models/userModel")
async function  allUsers(req,res){
    try{
        console.log("userid all Users",res.userId)

        const allUsers = await userModel.find()
        res.json({
            message : "All User",
            success : true,
            data : allUsers,
            error : false
        })

    }catch(err){
        res.status(400).json({
            message : err.message || err,
            error : true,
            success : false
        })
    }
}
module.exports = allUsers