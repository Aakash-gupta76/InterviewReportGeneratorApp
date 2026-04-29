const userModel=require('../models/user.model');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const tokenBlacklistModel=require('../models/blaclist.model');
// register routes ka logic is here..
async function registerUserController(req,res){
    const {username,email,password}=req.body;
    console.log(username,email,password);
    if(!username|| !email || !password){
        return res.status(400).json({
            message:"please provided username,email,and password "
        })
    }


    const isuserAlreadyRegistered=await userModel.findOne({
        $or:[{username},{email}]
    })
    if(isuserAlreadyRegistered){
        return res.status(400).json({
            message:"user already exits with this username or email"
        })
    }
    //hashing the password using bcrypt and createing the new user
    const hashPassword= await bcrypt.hash(password,10);
    const newUser= await userModel.create({
        username,
        email,
        password:hashPassword,
    })
    //generating the tolken of the new user
    const token=jwt.sign({
        id:newUser._id,username:newUser.username
    
    },process.env.JWT_SECRET,{expiresIn:"1d"})
    res.cookie("token",token)
    res.status(201).json({
        message:"user register sucessfully",
        user:{
            id:newUser._id,
            username:newUser.username,
            email:newUser.email,
        }
    })


}
async function loginUsercontroller(req,res){
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            message: "please provide email and password to login"
        })
    }
    const user = await userModel.findOne({ email });
    if (!user) {
        return res.status(400).json({
            message: 'Invalid email or password'
        })
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({
            message: 'Invalid email or password'
        })
    }
    const token=jwt.sign({
        id:user._id,username:user.username
    
    },process.env.JWT_SECRET,{expiresIn:"1d"})
    res.cookie('token',token)
    res.status(200).json({
        message:"user login sucessfully",
        user:{
            id:user._id,
            username:user.username,
            email:user.email,
        }
    })
    

}
async function logoutusercontroller(req,res){
    const token=req.cookies.token;
    if(token){
        await tokenBlacklistModel.create({token})
    }
    res.clearCookie("token")
    res.status(200).json({
        message:"user logout sucessfully!"
    })
}
async function getMeController(req,res){
    const user = await userModel.findById(req.user.id)
    res.status(200).json({
        message:"user details fetched sucessfully",
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })
}

module.exports={registerUserController,loginUsercontroller,logoutusercontroller,getMeController};