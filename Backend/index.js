require('dotenv').config();
const app=require('./src/app');

const connectDB=require('./src/config/db');
const generateInterviewReport=require('./src/services/ai.service');

connectDB();
























app.listen(5004,()=>{
    console.log('server is running on port',5004);
})