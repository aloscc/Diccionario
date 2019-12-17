import { Component } from '@angular/core';
import { DiccionaryService  } from 'src/app/services/diccionary.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(private diccionaryService: DiccionaryService) {}
}

