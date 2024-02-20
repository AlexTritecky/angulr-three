import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClassicTechniquesRoutingModule } from './classic-techniques-routing.module';
import { ClassicTechniquesComponent } from './page/classic-techniques.component';
import { COMPONENTS } from './modules';

@NgModule({
  declarations: [ClassicTechniquesComponent, ...COMPONENTS],
  imports: [CommonModule, ClassicTechniquesRoutingModule],
})
export class ClassicTechniquesModule {}
