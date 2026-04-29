const express=require('express');
const authRouter=express.Router();
const authController=require('../controllers/auth.controller');
const authMiddleware=require('../middlewares/auth.middleware');

//defining the register routes post type
authRouter.post('/register',authController.registerUserController);
//definiing the login routes of post type
authRouter.post('/login',authController.loginUsercontroller)
//defining the logout routes of post type
authRouter.get('/logout',authController.logoutusercontroller);
//creting the routes to get the details of logged in users name is get-me api name 
authRouter.get('/get-me',authMiddleware.authUser,authController.getMeController);







module.exports=authRouter;
