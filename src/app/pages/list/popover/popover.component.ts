import { Component, OnInit } from '@angular/core';
import { DatabaseService  } from 'src/app/services/database.service';
import { Dictionary  } from 'src/app/models/dictionary.interface';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {
  dictionaries: Dictionary[] = [];
  constructor(
    private popCtrl: PopoverController,
    private databaseservice: DatabaseService
  ) { }

  ngOnInit() {
    this.getDictionaries();
  }

  getDictionaries() {
    this.databaseservice.getDictionaries().subscribe((dictionaries: Dictionary[]) => {
      this.dictionaries = dictionaries;
      // if (this.words.length > 0) {
      //   this.initializeItems();
      // }
    });
  }

  async selectDictionary(dictionary: Dictionary) {
    await this.popCtrl.dismiss(dictionary);
  }

}
