const jwt = require('jsonwebtoken');
const tokenBlacklistModel=require('../models/blaclist.model');
async function authUser(req, res, next) {
    const token = req.cookies.token;
    //user ka pas token hai ki nahi ya check kar raha hai...
    if (!token) {
        return res.status(401).json({
            message: "token not found"
        })

    }
    const istokenBlacklisted= await tokenBlacklistModel.findOne({token});
    if(istokenBlacklisted){
        return res.status(401).json({
            message:"invalid token"
        })
    }
    //agar token hai to hum usko verify karenga
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded;
        next();
    }
    catch (err) {
        res.status(401).json({
            message: "Invalid token"
        })
    }





}
module.exports={authUser}
