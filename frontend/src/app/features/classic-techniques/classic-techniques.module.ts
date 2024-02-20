import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClassicTechniquesRoutingModule } from './classic-techniques-routing.module';
import { ClassicTechniquesComponent } from './page/classic-techniques.component';

@NgModule({
  declarations: [ClassicTechniquesComponent],
  imports: [CommonModule, ClassicTechniquesRoutingModule],
})
export class ClassicTechniquesModule {}
