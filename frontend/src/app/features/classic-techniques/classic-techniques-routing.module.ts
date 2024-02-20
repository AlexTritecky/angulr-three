import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClassicTechniquesComponent } from './page/classic-techniques.component';
import { Lesson01Component } from './modules/lesson-01/lesson-01.component';

const routes: Routes = [
  {
    path: '',
    component: ClassicTechniquesComponent,
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
export class ClassicTechniquesRoutingModule {}
