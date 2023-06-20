import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  errorMsg:string=''
  successMsg:boolean=false

loginForm = this.fb.group({acno:['',[Validators.required,Validators.pattern('[0-9]*')]],
pswd:['',[Validators.required,Validators.pattern('[0-9 a-z A-Z]*')]]})

  constructor(private fb:FormBuilder, private api:ApiService, private router:Router) {
    
  }

  login()
  {

    if(this.loginForm.valid)
    {
      //getting acno nd pswd that enter by usr
      let acno= this.loginForm.value.acno
      let pswd= this.loginForm.value.pswd
      //api call goes to api service and return the result
  this.api.login(acno,pswd).subscribe((result:any)=>
  {
    this.successMsg=true
    //store username in localstorage
    localStorage.setItem('username',result.username)

    //store acno in localstorage
    localStorage.setItem('currentAcno',JSON.stringify(result.currentAcno)) //ONLY STRING CAN STORED IN LOCAL STORAGE SO WE CONVERTED IT 


    //store token //already string so no need to convert to json
    localStorage.setItem('token',result.token) 


    setTimeout(() => {
      this.router.navigateByUrl('dashboard')
    }, 1000);
    

  },
  (result:any)=>{
    this.errorMsg= result.error.message
    setTimeout(() => {
      this.errorMsg=""
      this.loginForm.reset()
    },2000);

  }
  )
    
    }

    else
    {
      alert('invalid')
    }
    
  }


  
}
