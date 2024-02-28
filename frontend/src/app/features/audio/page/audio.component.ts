import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { ThreePBR } from '../utils/pbr';
import { ThreePointLight } from '../utils/pointlight';
import { AudioAnalyzer } from '../utils/audio';
import { ThreeSharedRenderer } from '../utils/render';
import { NoiseBlob } from '../utils/noise';
import { Ctrl } from '../utils/controls';
import { DeviceChecker } from '../utils/device';

@Component({
  selector: 'app-audio',
  templateUrl: './audio.component.html',
  styleUrl: './audio.component.scss',
})
export class AudioComponent implements AfterViewInit {
  @ViewChild('canvas', { static: true })
  private canvasRef!: ElementRef<HTMLCanvasElement>;
  public analyzer!: AudioAnalyzer;
  public render!: ThreeSharedRenderer;
  public renderQueue!: any;
  public pbr!: ThreePBR;
  public light!: ThreePointLight;
  public blob!: NoiseBlob;
  public controls!: Ctrl;
  public device!: DeviceChecker;

  constructor() {}
  ngAfterViewInit(): void {
    this.initVisualization();
    this.update();
  }

  private initVisualization(): void {
    this.device = new DeviceChecker();
    const isMobile = this.device.isMobile();
    const isRetina = this.device.isRetina();

    this.analyzer = new AudioAnalyzer();

    this.render = new ThreeSharedRenderer(true, this.canvasRef);

    this.pbr = new ThreePBR();
    this.light = new ThreePointLight();

    this.blob = new NoiseBlob(this.render, this.analyzer, this.light);
    this.blob.setPBR(this.pbr);

    if (isRetina) this.blob.setRetina();

    this.renderQueue = [this.blob.update.bind(this.blob)];

    this.controls = new Ctrl(this.blob, this.light, this.pbr, this.analyzer);
  }

  private update() {
    requestAnimationFrame(this.update.bind(this));

    this.analyzer.update();
    this.blob.updatePBR();

    this.pbr.exposure = 5 + 30 * this.analyzer.getLevel();

    if (this.controls.params.cam_ziggle)
      this.render.ziggleCam(this.analyzer.getHistory());
    this.render.render(this.renderQueue);
  }
}
