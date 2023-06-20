const express =require('express')
const cors = require('cors')
const dataService = require('./services/dataService')

//importing jsonwebtoken

const jwt= require ('jsonwebtoken')

const server = express()

server.use(express.json())




server.use(cors

    ({origin:'http://localhost:4200'})

    )

server.listen(3000,()=>{
    console.log('server started at 3000');
})

//application specific middleware , any ewq in this project get goes to middleware first

const appMiddleware = (req,res,next)=>{
    console.log('application specific middleware');
    next() //execute reqs only when this line present
}

server.use(appMiddleware) //code for using the middleware


//token varify middleware
const jwtMiddleware=(req,res,next)=>
{
    console.log('router middleware');

    //get token from req header

    const token = req.headers['access-token']
    console.log(token);
    //varify token
   try{
    
    const data= jwt.verify(token,'iamgod')
    console.log(data) //it will show current loged in acno and token num
    //we can store acno in another variable to use in fund transfer funtcion
    req.fromAcno=data.currentAcno

    console.log('valid token');
    next()
     }

     catch
     {
console.log('invalid token');
res.status(401).json({
    message:'please login!!!'
})
     }

}


//bank app front end request resolving

//register api call


//below created to send/rececve data for associasted function in dataservice

server.post('/register',(req,res)=>{ 


    console.log('inside reg function');
    console.log(req.body);
    dataService.register(req.body.uname, req.body.acno, req.body.pswd)
    .then((result)=>
    {

        res.status(result.statusCode).json(result) //convert to json so only client 4200 recevie it
    })
   
})
//below created to send/rececve data for associasted function in dataservice

server.post('/login',(req,res)=>{ 


    console.log('inside login function');
    console.log(req.body);
    dataService.login(req.body.acno, req.body.pswd)
    .then((result)=>
    {

        res.status(result.statusCode).json(result) //convert to json so only client 4200 recevie it
    })
   
})







//to getbalance 
//below created to send/rececve data for associasted function in dataservice

server.get('/getBalance/:acno',jwtMiddleware,(req,res)=>{

    console.log('inside getbalance function');
    console.log(req.params.acno);
    dataService.getBalance(req.params.acno)
    .then((result)=>
    {

        res.status(result.statusCode).json(result) //convert to json so only client 4200 recevie it
    })
   
})


//to deposit
//below created to send/rececve data for associasted function in dataservice

server.post('/deposit',jwtMiddleware,(req,res)=>{

    console.log('inside deposit function');
    console.log(req.body);
    dataService.deposit(req.body.acno, req.body.amount)
    .then((result)=>
    {

        res.status(result.statusCode).json(result) //convert to json so only client 4200 recevie it
    })
   
})


//to fundtransfer

server.post('/fundTransfer',jwtMiddleware,(req,res)=>{

    console.log('inside fundTransfer function');
    console.log(req.body);
    dataService.fundTransfer(req,req.body.toAcno, req.body.amount,req.body.pswd)
    //fromacno is in req as we done in token varify section above
    .then((result)=>
    {


        res.status(result.statusCode).json(result) //convert to json so only client 4200 recevie it
    })
   
})

// getAllTransactions
//req means our token, we just need to pass token coz it hav acno of logged in usr


server.get('/transactions',jwtMiddleware,(req,res)=>{
    console.log('inside api');
    dataService.getAllTransactions(req).then((result)=>
    {
res.status(result.statusCode).json(result)
    })
})

//delete acc req from front end comes here, so 

server.delete('/delete-account/:acno',jwtMiddleware,(req,res)=>{

    console.log('inside deleteacc function');
    console.log(req.params.acno);
    dataService.deleteMyAccount(req.params.acno)
    .then((result)=>
    {

        res.status(result.statusCode).json(result) //convert to json so only client 4200 recevie it
    })
   
})