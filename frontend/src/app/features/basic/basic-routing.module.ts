import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BasicComponent } from './page/basic.component';
import { Lesson01Component } from './modules/lesson-01/lesson-01.component';
import { Lesson02Component } from './modules/lesson-02/lesson-02.component';
import { Lesson03Component } from './modules/lesson-03/lesson-03.component';

const routes: Routes = [
  {
    path: '',
    component: BasicComponent,
  },

  {
    path: 'lesson-01',
    component: Lesson01Component,
  },

  {
    path: 'lesson-02',
    component: Lesson02Component,
  },

  {
    path: 'lesson-03',
    component: Lesson03Component,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BasicRoutingModule {}
