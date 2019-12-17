import { Injectable  } from '@angular/core';
import { timer, interval  } from 'rxjs';
import { map, tap, retryWhen, delayWhen  } from 'rxjs/operators';
import { DatabaseService  } from 'src/app/services/database.service';

@Injectable({
  providedIn: 'root'

})
export class DiccionaryService {
  constructor(public database: DatabaseService) {
    this.database.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        //this.database.seedDatabase2();     
      }
    });
  }
}
