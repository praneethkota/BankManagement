///this file to extsblish connection to mono db


const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/bank',()=>{
    console.log('mongodb connction done');
})

//creating a model

const User= mongoose.model('User',{
    username:String,
    acno:Number,
    password:Number,
    balance:Number,
    transcation:[]

}

)

//exporting the model

module.exports={User}