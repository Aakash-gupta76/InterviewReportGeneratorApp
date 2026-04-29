const mongoose=require('mongoose');

const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Database connected sucessfully');

    }
    catch(err){
        console.log('failed to connecr database',err);
    }
}
module.exports=connectDB;