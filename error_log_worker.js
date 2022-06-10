const {parentPort , workerData} = require("worker_threads");
const errorLogModel = require('./models/errorLog_model')
const mongoose = require('mongoose')
const dotenv = require("dotenv");

dotenv.config();


parentPort.on("message", incoming =>{
    try{
        if(incoming.status=="connect"){
            mongoose
            .connect(process.env.LOGGER_DB, {
              useNewUrlParser: true,
              useUnifiedTopology: true,
            })
            .then(() => {
              parentPort.postMessage({ status: "connectiondone" });
              console.log("connected to error db");
            })
            .catch((e) => {
              console.log("no connection to error db", e);
            });
          
        }

        if(incoming.status=="cansave"){
            errorLogging(incoming.data);
        }
    }catch(err){
        console.log(err.message)
    }
})

function errorLogging(errorObject) {  

    try{
    
        // if(!errorObject.user_id){
        //     throw 'User id is required';
        // }
        errorLogModel.create(errorObject);
        return true 

    }catch(e){
        return e;
    }
      
}