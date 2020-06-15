import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {TrainingsschemaPage} from './trainingsschema.page';

describe('TrainingsschemaPage', () => {
  let component: TrainingsschemaPage;
  let fixture: ComponentFixture<TrainingsschemaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TrainingsschemaPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TrainingsschemaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
