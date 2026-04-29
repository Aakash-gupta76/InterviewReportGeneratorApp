const multer=require('multer');
const upload=multer({
    storage:multer.memoryStorage(),
    limits:{
        fileSize:3*1024*1024,// 3 mb file size allowed
    }
})
module.exports=upload;