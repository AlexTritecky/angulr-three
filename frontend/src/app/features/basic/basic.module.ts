import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BasicRoutingModule } from './basic-routing.module';
import { BasicComponent } from './page/basic.component';
import { Lesson01Component } from './modules/lesson-01/lesson-01.component';

@NgModule({
  declarations: [BasicComponent, Lesson01Component],
  imports: [CommonModule, BasicRoutingModule],
})
export class BasicModule {}
