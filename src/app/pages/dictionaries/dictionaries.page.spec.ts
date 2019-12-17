import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DictionariesPage } from './diccionaries.page';

describe('DictionariesPage', () => {
  let component: DictionariesPage;
  let fixture: ComponentFixture<DictionariesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DictionariesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DictionariesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
