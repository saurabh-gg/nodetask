const express = require('express')
require('./database/db');
const app = express()


app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.get('/',(req, res)=>{
    res.send('hellow')
})

// importing routes
const userRoute = require('./routes/userRoutes')

app.use('/users', userRoute )

app.listen(4444, ()=>{
    console.log('server live on port 4444')
})