import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DictionariesPage } from './dictionaries.page';

const routes: Routes = [
  {
    path: '',
    component: DictionariesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DictionariesPageRoutingModule {}
