import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BasicRoutingModule } from './basic-routing.module';
import { BasicComponent } from './page/basic.component';
import { COMPONENTS } from './modules';

@NgModule({
  declarations: [BasicComponent, ...COMPONENTS],
  imports: [CommonModule, BasicRoutingModule],
})
export class BasicModule {}
