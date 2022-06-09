const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true,
        max:10
    },
    email:{
        type:String,
        required:true,
        max:20,
        unique:true
    },
    age:{
        type:String,
        required:true,
    }
})
module.exports = mongoose.model('User', userSchema)