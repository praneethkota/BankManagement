import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {


  registerForm = this.fb.group({acno:['',[Validators.required,Validators.pattern('[0-9]*')]],
pswd:['',[Validators.required,Validators.pattern('[0-9 a-z A-Z]*')]], uname:['',[Validators.required,Validators.pattern('[0-9 a-z A-Z]*')]]})

  constructor(private fb:FormBuilder, private api:ApiService, private router:Router) {
    
  }

  register()
  {

    if(this.registerForm.valid)

    {

    
        //getting deatails that enter by usr
      let acno= this.registerForm.value.acno
      let pswd= this.registerForm.value.pswd
      let uname= this.registerForm.value.uname
      
    
this.api.register(uname,acno,pswd).subscribe((result:any)=>
{
  alert(result.message)
  //go to login
  this.router.navigateByUrl('')

},
(result:any)=>{
  alert(result.error.message)
}
)
  
    }

    else
    {
      alert('invalid')
    }
    
  }
}
