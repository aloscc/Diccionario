import { Component, OnInit, ViewChild } from '@angular/core';
import { Word  } from 'src/app/models/word.interface';
import { DatabaseService  } from 'src/app/services/database.service';
import { IonInfiniteScroll } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { ModalComponent } from 'src/app/pages/list/modal/modal.component';
import { PopoverController  } from '@ionic/angular';
import { PopoverComponent  } from './popover/popover.component';

@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss']
})
export class ListPage implements OnInit {
  currentTable = '';
  currentSearchWord = '';
  searchword = '';
  currentIdx = -1;
  showOptions = false;
  progress = 0;
  interval: any;
  editword: Word = {wordId:0, word:'', definition:''};

  @ViewChild(IonInfiniteScroll, {static: false}) infiniteScroll: IonInfiniteScroll;
  words: Word[] = [];
  tmpwords: Word[]  = [];
  ini = 0;
  constructor(
    private databaseservice: DatabaseService,
    private modalController: ModalController,
    private popoverCtrl: PopoverController
  ) {
  }

  ngOnInit() {
    this.getWords();
  }

  async presentPopover(ev) {
    const popover = await this.popoverCtrl.create({
      component: PopoverComponent,
      event: ev,
      translucent: true
    });
    popover.onDidDismiss().then(obj => {
      if (obj.data) {
        this.ini = 0;
        this.tmpwords = [];
        this.currentTable = obj.data.fromidiom + obj.data.toidiom;
        this.databaseservice.loadWords(0, 100, this.currentTable);
      }
    });
    await popover.present();
  }

  getWords() {
    this.databaseservice.getWords().subscribe((words: Word[]) => {
      this.words = words;
      if (this.words.length > 0) {
        this.initializeItems();
      }
    });
  }

  initializeItems() {
    this.tmpwords = [...this.tmpwords.concat(this.words)];
    this.ini += this.tmpwords[this.tmpwords.length - 1].wordId;
  }

  incrementTmpWords() {
    if (this.currentSearchWord === '') {
      this.databaseservice.loadWords(this.ini + 1, 100, this.currentTable).then((words: Word[]) => {
      });
    } else {
      this.databaseservice.searchWord(this.currentSearchWord, this.currentTable, this.ini).then((words: Word[]) => {
      });
    }
  }

  searchWords(val) {
    this.currentSearchWord = val;
    if (val === '') {
      this.ini = 0;
      this.tmpwords = [];
      this.databaseservice.loadWords(this.ini, 100, this.currentTable).then((words: Word[]) => {

      });
    } else {
      if (val && val.trim() !== '') {
        this.ini = 0;
        this.tmpwords = [];
        this.databaseservice.searchWord(val, this.currentTable, this.ini).then(res => {

        });
      }
    }
  }

  loadData2(event) {
    setTimeout(() => {
      console.log('Para arriba.');
      event.target.complete();
      this.incrementTmpWords();
      // App logic to determine if all data is loaded
      // and disable the infinite scroll
      if (this.tmpwords.length === this.words.length) {
        event.target.disabled = true;
      }
    }, 500);
  }

  loadData(event) {
    setTimeout(() => {
      event.target.complete();
      this.incrementTmpWords();
      // App logic to determine if all data is loaded
      // and disable the infinite scroll
      // if (this.tmpwords.length === this.words.length) {
      //   event.target.disabled = true;
      // }
    }, 2000);
  }

  // Controller Functions
  onPress($event, i, word) {
    this.startInterval(i, word);
  }

  onPressUp($event) {
    this.stopInterval();
  }

  startInterval(i, word) {
    this.interval = setInterval(() => {
      this.progress = this.progress + 1;
      if (this.progress === 10) {
        //this.showOptions = true;
        this.currentIdx = i;
        this.editword.wordId = word.wordId;
        this.editword.word = word.word;
        this.editword.definition = word.definition;
      }
    }, 50);
  }

  stopInterval() {
    clearInterval(this.interval);
    this.progress = 0;
  }

  deleteWord(word) {
    this.databaseservice.deleteWord(word, this.currentTable).then(res => {
      if (res) {
        this.closeEdit();
      }
    });
  }

  closeEdit() {
    this.stopInterval();
    this.currentIdx = -1;
    this.editword.wordId = 0;
    this.editword.word = '';
    this.editword.definition = '';
  }

  editWord(word) {
    this.databaseservice.updateWord(word, this.currentTable).then(res => {
      if (res) {
        this.closeEdit();
      }
    });
  }

  async addNewWord() {
    const modal = await this.modalController.create({
      component: ModalComponent,
      componentProps: {
        table: this.currentTable
      }
    });
    return await modal.present();
  }
}
