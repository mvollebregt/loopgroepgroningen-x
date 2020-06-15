import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {TrainingsschemaPage} from './trainingsschema.page';

const routes: Routes = [
  {
    path: '',
    component: TrainingsschemaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrainingsschemaPageRoutingModule {
}
