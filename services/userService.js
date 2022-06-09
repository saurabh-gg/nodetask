const User = require('../models/userData')


const saveUser =  async (data)=>{
    const {name, email , age} = data
    const user = new User({
        name: name ,
        email: email,
        age: age
    })
    try{
        const responseData = await user.save();
        return responseData;
    }catch(error){
   
        return {error: true, message: error.message}
    }
}

module.exports = {
    saveUser
}