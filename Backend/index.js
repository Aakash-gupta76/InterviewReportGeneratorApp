require('dotenv').config();
const app=require('./src/app');

const connectDB=require('./src/config/db');
const generateInterviewReport=require('./src/services/ai.service');
const PORT=process.env.PORT || 5004;
connectDB();
























app.listen(PORT,()=>{
    console.log('server is running on port',PORT);
})