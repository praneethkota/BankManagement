import { HttpBackend, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import party from "party-js";
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  isLogoutPressed:boolean=false
  isCollapse:boolean=true
  user:string=''
  fundTransferSuccessMsg=''
  fundTransferErrorMsg=''
  acno:number=0
  balance:number=0
  parentacno:any=""
  deleteConfirm:boolean=false
  deleteSpinnerDiv:boolean=false

 depositForm = this.fb.group({ amount:['',[Validators.required,Validators.pattern('[0-9]*')]]

 })

 FundTransferForm = this.fb.group({toAcno:['',[Validators.required,Validators.pattern('[0-9]*')]],
 pswd:['',[Validators.required,Validators.pattern('[0-9 a-z A-Z]*')]],
 amount:['',[Validators.required,Validators.pattern('[0-9]*')]]

})


  
 depositMsg:string=''


  constructor(private api:ApiService, private fb:FormBuilder, private http:HttpClientModule, private route:Router)
  {

  }


  ngOnInit(){
   

    if(!localStorage.getItem('token'))
    {
     alert('please login')
     this.route.navigateByUrl('')
    }

    if(localStorage.getItem('username'))
    {
      this.user= localStorage.getItem('username') ||''
    }
    
   

  }

 


  collapse()
  {
   this.isCollapse= !this.isCollapse
  }

  getBalance()
  {
    if(localStorage.getItem('currentAcno'))
    {
      this.acno=  JSON.parse(localStorage.getItem('currentAcno') ||'') //GETTING BACK TO NUM FROM STRING
   console.log(this.acno);
   
   this.api.getBalance(this.acno).subscribe((result:any)=>
  {
    console.log(result);
    this.balance=result.balance
  }
   ) //calling getbalance function inside aposervicr.ts using api and passsing acno as argument

   
    }
  }

 deposit()
 {
  if (this.depositForm.valid)
  {
let amount= this.depositForm.value.amount
this.acno=  JSON.parse(localStorage.getItem('currentAcno') ||'')
this.api.deposit(this.acno,amount).subscribe((result:any)=>
{
  console.log(result);
  this.depositMsg=result.message
  setTimeout(()=>{
    this.depositForm.reset()
    this.depositMsg=''
  },3000)
},
(result:any)=>
{
  this.depositMsg=result.error.message
}
 ) 
  }
  else
  {
    alert('invalid form')
  }
 }

 showconfetti(source:any)
 {
  party.confetti(source);
 }

 //transfer

 transfer()
 {


  if (this.FundTransferForm.valid)
  {
let toAcno= this.FundTransferForm.value.toAcno    
let pswd=this.FundTransferForm.value.pswd
let amount= this.FundTransferForm.value.amount

//api call 
this.api.fundTransfer(toAcno,pswd,amount).subscribe(
  (result:any)=>
  {
    //if trnsferdone
    this.fundTransferSuccessMsg=result.message
    setTimeout(() => {
      this.fundTransferSuccessMsg="";
     },1000);
  },
  (result:any)=>
  {
    //if transfer not happend, any error is happend
    this.fundTransferErrorMsg = result.error.message
    setTimeout(() => {
      this.fundTransferErrorMsg="";
    },1000);
  })

  }


  else
  {
    alert('invalid form')
  }


 }

 //clear fundtransfer modal

 clearFundTransferForm()
 {
this.FundTransferForm.reset()


 }

 clearLocalStorage()
 {
  localStorage.clear()
 this.isLogoutPressed=true
  // localStorage.removeItem('token') //we can remove one by one also like this
  setTimeout(() => {
    this.route.navigateByUrl('')
    this.isLogoutPressed=false
  },2000);

 }

 //delete account

 deleteAccFromNav()
 {
this.parentacno =localStorage.getItem("currentAcno")
this.deleteConfirm=true
 }

 onCancel()
 {
  this.parentacno="";
  this.deleteConfirm=false
 }

 onDelete(event:any)
 {
let deleteAcno= JSON.parse(event)
this.api.deleteAccount(deleteAcno).subscribe((result:any)=>
{
  this.parentacno="";
  localStorage.clear()
  this.deleteSpinnerDiv= true
  setTimeout(() => {
    this.route.navigateByUrl('')
    this.deleteSpinnerDiv= false
  }, 3000);
},
(result:any)=>
{
alert(result.error.message)
}
)
 }
}