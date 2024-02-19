import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BasicComponent } from './page/basic.component';
import { Lesson01Component } from './modules/lesson-01/lesson-01.component';

const routes: Routes = [
  {
    path: '',
    component: BasicComponent,
  },

  {
    path: 'lesson-01',
    component: Lesson01Component,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BasicRoutingModule {}
