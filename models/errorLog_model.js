const mongoose = require('mongoose')

const userErrorLog = new mongoose.Schema({
    page:{
        type: String,  
    },
    level:{
        type: String,  
    },
    functionName:{
        type: String,  
    },
    // user_id:{
    //     type:  mongoose.Schema.Types.ObjectId,
    // },
    heading:{
        type: String,
    },
    detail:{
        type: String,  
    },
    createdAt:{
        type: Date,  
    }
})

module.exports = mongoose.model('error_log', userErrorLog)