import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Word  } from 'src/app/models/word.interface';
import { DatabaseService  } from 'src/app/services/database.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {
  newWord:Word = {wordId:0, word:'', definition: ''};
  constructor(
    private modalController: ModalController,
    private databaseservice: DatabaseService
  ) { }
  ngOnInit() {}
  closeModal() {
    this.newWord = {wordId:0, word:'', definition: ''};
    this.modalController.dismiss();
  }
  saveNewWord() {
    this.databaseservice.addWord(this.newWord).then(res => {
      if (res) {
        console.log('guardado con exito!');
      } else {
        console.log('ocurrio un error al guardar');
      }
    });
  }
}
