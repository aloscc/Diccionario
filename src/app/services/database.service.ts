import { Platform  } from '@ionic/angular';
import { Injectable  } from '@angular/core';
import { SQLitePorter  } from '@ionic-native/sqlite-porter/ngx';
import { HttpClient  } from '@angular/common/http';
import { SQLite, SQLiteObject  } from '@ionic-native/sqlite/ngx';
import { BehaviorSubject, Observable  } from 'rxjs';
import { tap  } from 'rxjs/operators';
import { NativeStorage  } from '@ionic-native/native-storage/ngx';
import { Word  } from 'src/app/models/word.interface';
import { Dictionary  } from 'src/app/models/dictionary.interface';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  database: SQLiteObject;
  dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);
  words = new BehaviorSubject([]);
  dictionaries = new BehaviorSubject([]);
  dbname = 'A.csv';

  constructor(
    private plt: Platform,
    private sqlitePorter: SQLitePorter,
    private sqlite: SQLite,
    private http: HttpClient,
    public nativestorage: NativeStorage
  ) {
    this.plt.ready().then(() => {
      this.createDatabaseObject();
    });
  }

  createDatabaseObject() {
    this.sqlite.create({
      name: 'diccionariocsvDB',
      location: 'default'
    }).then((db: SQLiteObject) => {
      this.database = db;
      return this.cleanTable('dictionary');
    }).then(res => {
      return this.cleanTable('quechua');
    }).then(res => {
      return this.createTableDictionary();
    }).then(res => {
      this.dbReady.next(true);
    });
  }

  createTableDictionary() {
    const query = 'CREATE TABLE IF NOT EXISTS dictionary (dictionaryId INTEGER PRIMARY KEY AUTOINCREMENT, fromidiom TEXT, toidiom TEXT);';
    return new Promise(resolve => {
      this.database.executeSql(query, []).then(data => {
        resolve(true);
      }, error => {
        resolve(false);
      });
    });
  }

  seedDatabase() {
    this.http.get('assets/dbs/' + this.dbname, { responseType: 'text' })
      .subscribe(sql => {
        this.sqlitePorter.importSqlToDb(this.database, sql)
          .then(_ => {
            this.loadWords();
            this.dbReady.next(true);
          })
          .catch(e => console.error(e));
      });
  }

  seedDatabase2() {
    this.http.get('assets/dbs/' + this.dbname, { responseType: 'text' })
      .subscribe(codes => {
        let arrWords:Word[] = this.formatLinesStrings(codes.split(/[\r\n]+/));
        let sql = this.generaSql(arrWords);
        this.nativestorage.clear().then(res => {
          this.sqlitePorter.importSqlToDb(this.database, sql).then(_ => {
            this.loadWords();
            this.dbReady.next(true);
          }).catch(e => {
            console.error(e);
          });
        });
      });
  }

  formatLinesStrings(strings: String[]) {
    let arrWords:Word[] = [];
    strings.forEach((w, i) => {
      // const tmparr =  w.replace(/\"/g,'').split('(');
      const tmparr =  w.split(' ');
      const word = tmparr.shift();
      const definition = tmparr.join(' ');
      const newWord: Word = {wordId: i, word: word, definition: definition};
      arrWords.push(newWord);
    });
    return arrWords;
  }

  seedDatabaseDinamic(lines) {
    return new Promise(resolve => {
      const sql = this.generaSql(this.formatLinesStrings(lines));
      this.sqlitePorter.importSqlToDb(this.database, sql).then(_ => {
        this.loadWords().then(res => {
          this.dbReady.next(true);
          resolve(true);
        });
      }).catch(e => {
        console.error(e);
        resolve(false);
      });
    });
  }

  generaSql(arrayitems: Word[], table = 'quechua') {
    let i, j, chunk = 500;
    let insertchunks = [];
    let queryG = 'CREATE TABLE IF NOT EXISTS ' + table + '(wordId INTEGER PRIMARY KEY AUTOINCREMENT, word TEXT, definition TEXT);';
    for (i = 0, j = arrayitems.length; i < j; i += chunk) {
      let items = arrayitems.slice(i,i+chunk);
      let batchqueryG = ' INSERT INTO ' + table;
      let flag = false;
      for (let i = 0; i < items.length; i++) {
        let item = items[i];
        if (item) {
          flag = true;
          if (i == 0) {
            batchqueryG += ` SELECT "${item.wordId}" AS 'wordId', "${item.word}" AS 'word', "${item.definition}" AS 'definition'`;  
          } else {
            batchqueryG += ` UNION ALL SELECT "${item.wordId}" AS 'wordId', "${item.word}", "${item.definition}"`;
          }
        }
      }
      if (flag) {
        batchqueryG += ';';
        queryG += batchqueryG; 
      }
    }
    return queryG;
  }

  query(query: string): Promise<any> {
    return this.database.executeSql(query);
  }

  getDatabaseState() {
    return this.dbReady.asObservable();
  }

  getWords(): Observable<Word[]> {
    return this.words.asObservable();
  }

  loadWords(postinitial = 0, size = 100) {
    return new Promise(resolve => {
      this.database.executeSql(`SELECT * FROM quechua 
                WHERE wordId BETWEEN ${postinitial} AND ${postinitial + size} 
                ORDER BY wordId ASC`, []).then(data => {
                  const words: Word[] = [];
                  if (data.rows.length > 0) {
                    for (let i = 0; i < data.rows.length; i++) {
                      words.push({
                        wordId: data.rows.item(i).wordId,
                        word: data.rows.item(i).word,
                        definition: data.rows.item(i).definition
                      });
                    }
                  }
                  this.words.next(words);
                  resolve(true);
                });
    });
  }

  getWord(word, table): Promise<Word> {
    return new Promise(resolve => {
      this.database.executeSql('SELECT * FROM ' + table + ' WHERE word = ?', [word]).then(data => {
        if (data.rows.item(0)) {
          resolve(data.rows.item(0));
        } else {
          resolve(undefined);
        }
      });
    });
  }

  searchWord(word, table, postinitial) {
    return new Promise(resolve => {
      this.database.executeSql(`SELECT * FROM ${table} WHERE word like "${word}%" 
        AND wordId > ${postinitial} 
        ORDER BY wordId ASC limit 100`, []).then(data => {
          const words: Word[] = [];
          if (data.rows.length > 0) {
            for (let i = 0; i < data.rows.length; i++) {
              words.push({
                wordId: data.rows.item(i).wordId,
                word: data.rows.item(i).word,
                definition: data.rows.item(i).definition
              });
            }
          }
          this.words.next(words);
          resolve(true);
        });
    });
  }

  addWord(word: Word, table = 'quechua') {
    return new Promise(resolve => {
      const query0 = `SELECT MAX(wordId) as maxindex FROM ${table}`;
      this.database.executeSql(query0, []).then(data => {
        if (data.rows.length > 0) {
          const maxindex = data.rows.item(0);
          word.wordId = maxindex.maxindex + 1;
          const query1 = `INSERT INTO ${table} (wordId, word , definition) VALUES( ${word.wordId}, '${word.word}', '${word.definition}')`;
          return this.database.executeSql(query1, []);
        }
        resolve(false);
      }, error => {
        resolve(false);
      }).then(res => {
        return this.loadWords();
      }, error => {
        resolve(false);
      }).then(res => {
        resolve(true);
      });
    });
  }

  deleteWord(word: Word, table = 'quechua') {
    return new Promise(resolve => {
      this.database.executeSql('DELETE FROM ' + table + ' WHERE wordId = ?', [word.wordId]).then(_ => {
        return this.loadWords();
      }, error => {
        resolve(false);
      }).then(res => {
        resolve(true);
      });
    });
  }

  updateWord(word: Word, table='quechua') {
    return new Promise(resolve => {
      this.database.executeSql(`UPDATE ${table} SET definition = '${word.definition}', 
              word = '${word.word}' WHERE wordId = ${word.wordId}`, []).then(data => {
                return this.loadWords();
              }, error => {
                resolve(false);
              }).then(res => {
                resolve(true);
              });
    });
  }

  cleanTable(table) {
    return new Promise(resolve => {
      this.nativestorage.clear().then(res => {
        this.database.executeSql('DROP TABLE IF EXISTS ' + table + ';').then(() => {
          resolve(true);
          console.log(`tabla ${table}, eliminada!`);
        }, err => {
          resolve(false);
          console.log(err);
        });
      });
    });
  }

  readFile(filename: string) {
    return this.http.get(filename, {responseType: 'text'});
  }

  // Crud for list idioms.
  addDictionaryName(sql) {
    return new Promise(resolve => {
      this.sqlitePorter.importSqlToDb(this.database, sql).then(_ => {
        this.loadDictionaries().then(res => {
          this.dbReady.next(true);
          resolve(true);
        });
      }).catch(e => {
        console.error(e);
        resolve(false);
      });
    });
  }

  loadDictionaries() {
    return new Promise(resolve => {
      this.database.executeSql(`SELECT * FROM dictionary ORDER BY fromidiom ASC`, []).then(data => {
        const dictionaries: Dictionary[] = [];
        if (data.rows.length > 0) {
          for (let i = 0; i < data.rows.length; i++) {
            dictionaries.push({
              dictionaryId: data.rows.item(i).dictionaryId,
              fromidiom: data.rows.item(i).fromidiom,
              toidiom: data.rows.item(i).toidiom
            });
          }
        }
        this.dictionaries.next(dictionaries);
        resolve(true);
      });
    });
  }

  getDictionaries(): Observable<Dictionary[]> {
    return this.dictionaries.asObservable();
  }

  deleteDictionary(dictionary: Dictionary) {
    return new Promise(resolve => {
      this.database.executeSql('DELETE FROM dictionary WHERE dictionaryId = ?', [dictionary.dictionaryId]).then(_ => {
        return this.loadDictionaries();
      }, error => {
        resolve(false);
      }).then(res => {
        resolve(true);
      });
    });
  }
}

