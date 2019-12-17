import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { DatabaseService  } from 'src/app/services/database.service';

@Component({
  selector: 'app-modaldictionary',
  templateUrl: './modaldictionary.component.html',
  styleUrls: ['./modaldictionary.component.scss'],
})
export class ModaldictionaryComponent implements OnInit {
  fromIdiom = '';
  toIdiom = '';
  idioms = ['Quechua', 'Espaniol', 'Ingles', 'Portugues', 'Frances', 'Aleman'];
  allLines = [];
  constructor(
    public modalController: ModalController,
    public db: DatabaseService,
    public loadingController: LoadingController
  ) { }

  ngOnInit() {}

  closeModal() {
    this.fromIdiom = '';
    this.toIdiom = '';
    this.modalController.dismiss();
  }

  handleFileSelect(ev) {
    const loadingElement = this.loadingController.create({
      message: 'Leendo Archivo...',
      spinner: 'crescent'
    });
    loadingElement.then(res => {
      res.present();
      const files = ev.target.files; // FileList object
      // Loop through the FileList and render image files as thumbnails.
      const arrProm = [];
      Array.from(files).forEach(f => {
        arrProm.push(this.readFile(f));
      });
      Promise.all(arrProm).then(ll => {
        this.allLines = [];
        ll.forEach(l => {
          this.allLines = this.allLines.concat(l);
          this.loadingController.dismiss();
        });
      });
    });
  }

  readFile(f) {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = event => {
        // NOTE: event.target point to FileReader
        const contents = event.target['result'];
        const lines = contents.split(/[\r\n]+/);
        resolve(lines);
      };
      reader.readAsText(f);
    });
  }

  saveNewDictionary() {
    const query2Dict = `INSERT INTO dictionary (fromidiom, toidiom) VALUES('${this.fromIdiom}', '${this.toIdiom}'); `;
    const loadingElement = this.loadingController.create({
      message: 'Cargando BD...',
      spinner: 'crescent'
    });
    loadingElement.then(res => {
      res.present();
      this.db.addDictionaryName(query2Dict).then(rs => {
        if (rs) {
          return this.db.seedDatabaseDinamic(this.allLines);
        } else {
          console.log('Hubo un error al cargar la base de datos.');
          return false;
        }
      }, err => {
        console.log(err);
      }).then(rs => {
        if (rs) {
          this.loadingController.dismiss();
          console.log('base de datos cargada!');
        } else {
          this.loadingController.dismiss();
          console.log('Hubo un error al cargar la base de datos.');
        }
      });
    });
  }

  getFromIdiom(event) {
    this.fromIdiom = event.target.value;
  }
  getToIdiom(event) {
    this.toIdiom = event.target.value;
  }
}

