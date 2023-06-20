import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-delete-confirm',
  templateUrl: './delete-confirm.component.html',
  styleUrls: ['./delete-confirm.component.css']
})
export class DeleteConfirmComponent {

  @Output() onCancel= new EventEmitter() //childs value to parent
  @Input() item:string|undefined //parent"s value to get to child (this is child, ie deleleconfirm, paremt is dashboard)
  @Output() onDelete= new EventEmitter() //childs value to parent
  cancel()
  {
this.onCancel.emit()
  }

  deleteAcc()
  {
this.onDelete.emit(this.item) //item holds acc no from dashboard ts using parent to child output transfter
  }
}
