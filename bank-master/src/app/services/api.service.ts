import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

const options={
  headers:new HttpHeaders()
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

 

  constructor(private http:HttpClient) { }



  register(uname:any, acno:any, pswd:any)
  {

  const body={uname,acno,pswd}

  //server call to register an acc and return response to reg component
return this.http.post('http://localhost:3000/register',body)



  }

  login(acno:any, pswd:any)
  {
    const body={acno,pswd}
    
     //server call to loginman acc and return response to logincomponent
return this.http.post('http://localhost:3000/login',body)
  }


//creating an function to append token in httpheader

appendToken()
{
  //fetch token from local storage
  const token=localStorage.getItem('token')||''

  //create http header
  var headers = new HttpHeaders()

  if(token)
  {
    //append token inside header
    headers=headers.append('access-token',token)

    //overload
    options.headers=headers
  }

  return options
}



//to get balance according to acc no


getBalance(acno:any)
{
  return this.http.get('http://localhost:3000/getBalance/'+acno,this.appendToken())
}

deposit(acno:any,amount:any)
{

const body = {
acno,
amount
}

return this.http.post('http://localhost:3000/deposit',body,this.appendToken())

}

fundTransfer(toAcno:any,pswd:any,amount:any)
{

  const body ={
    toAcno,
    pswd,
    amount
  }
return this.http.post('http://localhost:3000/fundTransfer',body,this.appendToken())
}



getAlltransactions()
{
  return this.http.get('http://localhost:3000/transactions',this.appendToken())
}



//delete acc

deleteAccount(acno:number)
{
  return this.http.delete('http://localhost:3000/delete-account/'+acno,this.appendToken())
}

}





