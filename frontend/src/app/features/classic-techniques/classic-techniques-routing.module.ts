import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClassicTechniquesComponent } from './page/classic-techniques.component';
import { Lesson01Component } from './modules/lesson-01/lesson-01.component';
import { Lesson02Component } from './modules/lesson-02/lesson-02.component';
import { Lesson03Component } from './modules/lesson-03/lesson-03.component';
import { Lesson04Component } from './modules/lesson-04/lesson-04.component';

const routes: Routes = [
  {
    path: '',
    component: ClassicTechniquesComponent,
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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClassicTechniquesRoutingModule {}
