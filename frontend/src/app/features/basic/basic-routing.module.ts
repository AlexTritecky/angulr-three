import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BasicComponent } from './page/basic.component';
import { Lesson01Component } from './modules/lesson-01/lesson-01.component';
import { Lesson02Component } from './modules/lesson-02/lesson-02.component';
import { Lesson03Component } from './modules/lesson-03/lesson-03.component';
import { Lesson04Component } from './modules/lesson-04/lesson-04.component';
import { Lesson05Component } from './modules/lesson-05/lesson-05.component';
import { Lesson06Component } from './modules/lesson-06/lesson-06.component';
import { Lesson07Component } from './modules/lesson-07/lesson-07.component';

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

  {
    path: 'lesson-04',
    component: Lesson04Component,
  },
  {
    path: 'lesson-05',
    component: Lesson05Component,
  },

  {
    path: 'lesson-06',
    component: Lesson06Component,
  },

  {
    path: 'lesson-07',
    component: Lesson07Component,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BasicRoutingModule {}
