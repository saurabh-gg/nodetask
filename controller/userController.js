const Joi = require('joi');
const User = require('../models/userData')
const response = require('../utils/responseHandler')
const userService = require('../services/userService')
const {STATUS} = require('../config/constants')
const getAllUsers = async (req ,res)=>{
    try{
        const allUsers = await User.find();
        if(allUsers.length ===0){
            response.responseHandler(res,STATUS.NOT_FOUND,[], [{'message': 'error fetching datas'}])
        }else{
            response.responseHandler(res, STATUS.SUCCESS, allUsers, [], 'tempp', true);
        }
    }
    catch(e){
        response.responseHandler(res,STATUS.BAD_REQUEST,[], [{'message':e}])
    }
}

const saveUsers = async(req,res)=>{
    let errorObj={};

    try{
    let body = req.body;

    const userSchema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        age: Joi.string().required()
    })

    let finalUser={...body}
    let userbody = userSchema.validate(finalUser)

    // errorObj={
    //     'level':'error',
    //     'heading': `Error while ${finaluser}`,
    //     'page': 'userController',
    //     'functionName':'saveUsers',
    // }
     if(userbody.error){ //validation errors
        errorObj['level']= 'validation-error';
        errorObj['detail']= userbody.error.message;
        console.log(errorObj)
        response.responseHandler(res,STATUS.BAD_REQUEST,[],[{ "message" : userbody.error.message}] )
    }else{
       
        const user = new User({
            name:req.body.name,
            email:req.body.email,
            age:req.body.age
        }) 
        try{
            const result = await user.save();
            response.responseHandler(res, STATUS.SUCCESS, result, [], 'tempp', true);
        }
        catch(e){
            response.responseHandler(res,STATUS.BAD_REQUEST,[],[{ "message" :e}] )
        }
       
    }

    }catch(e){
        response.responseHandler(res,STATUS.BAD_REQUEST,[], [{'message': e}])
    }
}


module.exports= {
    getAllUsers,
    saveUsers
}

// console.log(result)
//             if(result.error){
//                 console.log(result.error)
//                 error['detail'] = result.message;
//                 response.responseHandler(res, STATUS.BAD_REQUEST, [], [{"message" : result.message}], false);
//             }else{
//                 response.responseHandler(res, STATUS.SUCCESS, result, [], 'tempp', true);
//                 // res.send(result)
//             }

 // if(result.error){
        //     error['detail'] = result.message;
        //     console.log(errorObj)
        //     response.responseHandler(res, STATUS.BAD_REQUEST, [], [{"message" : result.message}], false);
        // }else{
        //     response.responseHandler(res, STATUS.SUCCESS, [{'user': {}}] ,[], 'tempp', true);
        //     // res.send(result)
        // }