// Assuming Three.js and dat.GUI are accessible in your project
import * as THREE from 'three';
import * as dat from 'dat.gui';
import { Injectable } from '@angular/core';
import { NoiseBlob } from './noise';
import { ThreePointLight } from './pointlight';
import { ThreePBR } from './pbr';
import { AudioAnalyzer } from './audio';

@Injectable({
  providedIn: 'root',
})
export class Ctrl {
  private gui: dat.GUI;
  public params: {
    show_hdr: boolean;
    debug_shadow_map: boolean;
    cam_ziggle: boolean;
    light_ziggle: boolean;
    audio_gain: number;
    light_posx: number;
    light_posy: number;
    light_posz: number;
  };

  constructor(
    private blob: NoiseBlob,
    private light: ThreePointLight,
    private pbr: ThreePBR,
    private audio: AudioAnalyzer
  ) {
    this.params = {
      show_hdr: true,
      debug_shadow_map: false,
      cam_ziggle: true,
      light_ziggle: true,
      audio_gain: 70,
      light_posx: 3,
      light_posy: 3,
      light_posz: 3,
    };

    this.gui = new dat.GUI();
    this.setupGUI();
  }

  private setupGUI(): void {
    this.gui
      .add(this.params, 'audio_gain', 0, 500)
      .onChange(() => this.updateParams());
    this.gui.add(this.audio, 'isPulse');
    this.gui
      .add(this.blob, 'showHdr')
      .onFinishChange(() => this.blob.toggleCubemap());

    // Additional GUI controls can be added here following the same pattern
    this.updateParams();
  }

  private updateParams(): void {
    let p = this.params;

    // Assuming these methods exist on the blob, audio, and light objects
    this.blob.debugShadowMap(p.debug_shadow_map);
    this.audio.setGain(p.audio_gain);
    // Assuming setLightPos is expecting a THREE.Vector3
    this.light.setLightPosition(
      new THREE.Vector3(p.light_posx, p.light_posy, p.light_posz)
    );
  }
}
