import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { ListPage } from './list.page';
import { ModalComponent } from './modal/modal.component';

@NgModule({
  declarations: [ListPage, ModalComponent],
  exports: [ModalComponent],
  entryComponents: [ModalComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: ListPage
      }
    ])
  ]
})
export class ListPageModule {}
