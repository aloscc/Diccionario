import { Component, OnInit, ViewChild} from '@angular/core';
import { Dictionary  } from 'src/app/models/dictionary.interface';
import { ModalController } from '@ionic/angular';
import { ModaldictionaryComponent } from 'src/app/pages/dictionaries/modaldictionary/modaldictionary.component';
import { IonInfiniteScroll } from '@ionic/angular';
import { DatabaseService  } from 'src/app/services/database.service';

@Component({
  selector: 'app-dictionaries',
  templateUrl: './dictionaries.page.html',
  styleUrls: ['./dictionaries.page.scss'],
})
export class DictionariesPage implements OnInit {
  searchdictionary = '';
  currentIdx = -1;
  showOptions = false;
  progress = 0;
  interval: any;
  editdictionary: Dictionary = {dictionaryId: 0, fromidiom: '', toidiom: ''};

  @ViewChild(IonInfiniteScroll, {static: false}) infiniteScroll: IonInfiniteScroll;
  dictionaries: Dictionary[] = [];
  tmpdictionaries: Dictionary[]  = [];
  ini = 0;

  constructor(
    private modalController: ModalController,
    private databaseservice: DatabaseService
  ) {}

  ngOnInit() {
    this.databaseservice.getDictionaries().subscribe((dictionaries: Dictionary[]) => {
      this.dictionaries = dictionaries;
      // if (this.words.length > 0) {
      //   this.initializeItems();
      // }
    });
  }

  async addNewWord() {
    const modal = await this.modalController.create({
      component: ModaldictionaryComponent
    });
    return await modal.present();
  }
}
