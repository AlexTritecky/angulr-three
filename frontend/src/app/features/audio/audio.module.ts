import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AudioRoutingModule } from './audio-routing.module';
import { AudioComponent } from './page/audio.component';


@NgModule({
  declarations: [AudioComponent],
  imports: [
    CommonModule,
    AudioRoutingModule
  ]
})
export class AudioModule { }
