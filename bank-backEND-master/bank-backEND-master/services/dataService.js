//import db.js

const db= require('./db')

//importing jsonwebtoken

const jwt= require ('jsonwebtoken')

   

//register
const register =(uname,acno,pswd)=>{

    console.log('inside register function in data service');

     //check acno in mongodb

    return db.User.findOne({acno}).then((result)=>{
        console.log(result);

        if(result) //if acc already exits or not
        {
            return{
                statusCode:403,
                message:'account already exit!!'
            }
        }

        else
        {
            //crate a new acc
          const newUser = new db.User({
            username:uname,
            acno,
            password:pswd,
            balance:0,
            transcation:[]
          })

          //to save it to mongodb

          newUser.save()

          return {
            statusCode:200,
            message:'registration successful!'
          }

        }
        
        
    
    })

}


const login =(acno,pswd)=>
{
  console.log('inside');
  
     //check acno in mongodb and if exits getting the details
     return db.User.findOne(
      {
        acno,
        password:pswd
      }
     ).then((result)=>{
      if(result) //if acc already exits 
      {

        const token = jwt.sign({currentAcno:acno},'iamgod')
          return{
              statusCode:200,
              message:'sucessful login!!',
              username:result.username,
              currentAcno:result.acno,
              token           //automatically assigned iamgod to it no need again
          }
      }
      
      else{
        return {
          statusCode:404,
          message:'inavild account or password!'
        }

      }
      
      

     })
}

const getBalance=(acno)=>
{
  return db.User.findOne({acno}).then((result)=>{
    console.log(result);
    if(result) //if acc already exits or not
        {
            return{
                statusCode:200,
                balance:result.balance
            }
        }

        else
        {
           return{
            statusCode:404,
            message:'inavild account number!'
           }
        }
  })
}

const deposit=(acno,amt)=>{
  let amount = Number(amt)
  return db.User.findOne({
    acno
  }).then((result)=>{
    if(result){
      result.balance +=amount
      result.transcation.push({
        type:"CREDIT",
        fromAcno:acno,
        toAcno:acno,
        amount 

      })
      result.save()
      return {
        statusCode:200,
        message:`${amount} successfully deposited....`
      }
    }
    else{
      return {
        statusCode:404,
        message:'inavild account number!'
      }
    }
  })
}





const fundTransfer =(req,toAcno,amt,pswd)=>
{
let amount = Number(amt) //convert to string
let fromAcno = req.fromAcno
console.log(typeof(amount));
console.log(amount);

return db.User.findOne({acno:fromAcno, password:pswd}).then((result)=>{

  // console.log(result);
  if(fromAcno==toAcno){
    return {
      statusCode:401,
      message:'cannot transfer to own account!'
    }
  }

  if(result)
  {
    //debit acno logic
   let fromAcnoBalance= result.balance
   if(result.balance>=amount)
   {
result.balance= fromAcnoBalance-amount

//credit acc no logic
return db.User.findOne({acno:toAcno}).then((creditdata)=>{
if(creditdata)
{
creditdata.balance +=amount;
creditdata.transcation.push({
  type:"CREDIT",
  fromAcno,
  toAcno,
  amount 
})
creditdata.save()
console.log(creditdata);

result.transcation.push({
  type:"DEBIT",
  fromAcno,
  toAcno,
  amount 
})
result.save()
console.log(result);
return {
  statusCode:200,
  message:'amount transfer done'
}

}
else
{
  return {
    statusCode:404,
    message:'inavild credit account number!'
  }
}
})
   }

   else {
    return{
      statusCode:403,
      message:"insufficent balance"
    }
  }

   

  }



  else{
    return{
      statusCode:401,
      message:"invalid password"
    }
  }


})


}





//toget all transcations

const getAllTransactions = (req)=>
{
  let acno= req.fromAcno //getting acno from token itself
  return db.User.findOne({acno}).then((result)=>
  {
    if(result)
    {
      return{
        statusCode:200,
        transaction:result.transcation


      }
    }
    else
    {
      return{
        statusCode:401,
        message:"invalid account number"
      }
    }
  })
}



//delete acc

const deleteMyAccount=(acno)=>
{
return db.User.deleteOne({acno}).then((result)=>{
  if(result)
  {
return{
  statusCode:200,
  message:"Account deleted successfully"
}
  }
  else{
return{
  statusCode:401,
  message:"invalid account"
}
  }
})
}



//export

module.exports={


    
    login,
    register,
    getBalance,
    deposit,
    fundTransfer,
    getAllTransactions,
    deleteMyAccount
   
    
}