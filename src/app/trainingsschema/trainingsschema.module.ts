import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {TrainingsschemaPageRoutingModule} from './trainingsschema-routing.module';

import {TrainingsschemaPage} from './trainingsschema.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrainingsschemaPageRoutingModule
  ],
  declarations: [TrainingsschemaPage]
})
export class TrainingsschemaPageModule {
}
