import { transition } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import jspdf from 'jspdf';
import 'jspdf-autotable';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {
 
  allTransactions:any;
  searchKey:string=''

 constructor (private api:ApiService, private route:Router)
 {

 }

  ngOnInit(): void {
    

    
    if(!localStorage.getItem('token'))
    {
     alert('please login')
     this.route.navigateByUrl('')
    }

    this.api.getAlltransactions().subscribe((result:any)=>
    {
      console.log(result);
      this.allTransactions=result.transaction
      console.log( this.allTransactions);
      
     
    })
  }

  search(event:any)
  {
    this.searchKey= event.target.value //anything we type will assigned t search key
  }

  generatePdf()
  {
    var pdf = new jspdf   //create a object to hold jspdf
    let col =['Type','FromAcno','ToAcno',"Amount"] //defining how many colums requiewd for pdf
    let row:any =[]
    pdf.setFontSize(16);
    pdf.text('Transaction History', 11, 8);
    pdf.setFontSize(12);
    pdf.setTextColor(99);

    //to convert array of objects(our current data) to nested array in order to work this function
    var itemnew = this.allTransactions //to avoid using 'this.' everywhere
   for (let element of itemnew) {
      var temp=[element.type,element.fromAcno,element.toAcno,element.amount]
      row.push(temp) //row is an array, temp also a array so when we push temp to row we get nested array
    }

    (pdf as any).autoTable(col,row,{startY:10}) //setting pdf y positin margin 10unit down

  
        pdf.output('dataurlnewwindow')   // Open PDF document in browser's new tab

         
        pdf.save('mini.pdf'); // Download PDF doc 
  }


}
