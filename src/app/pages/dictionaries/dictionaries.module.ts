import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DictionariesPageRoutingModule } from './dictionaries-routing.module';
import { DictionariesPage } from './dictionaries.page';
import { ModaldictionaryComponent } from './modaldictionary/modaldictionary.component';

@NgModule({
  declarations: [DictionariesPage, ModaldictionaryComponent],
  exports: [ModaldictionaryComponent],
  entryComponents: [ModaldictionaryComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DictionariesPageRoutingModule
  ]
})
export class DictionariesPageModule {}
