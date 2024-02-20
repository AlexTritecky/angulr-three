import { Component, ElementRef, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { BaseThreeComponent } from '../../../../class/component';

@Component({
  selector: 'app-lesson-01',
  templateUrl: './lesson-01.component.html',
  styleUrls: ['./lesson-01.component.scss'],
})
export class Lesson01Component extends BaseThreeComponent {
  @ViewChild('canvas', { static: true })
  protected override canvasRef!: ElementRef<HTMLCanvasElement>;

  constructor() {
    super();
  }

  protected initScene(): void {
    this.scene.background = new THREE.Color(0x393d3f);
  }

  protected addObjects(): void {
    this.addCube();
  }

  private addCube(): void {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const cube = new THREE.Mesh(geometry, material);
    this.scene.add(cube);
  }

  protected initCamera(): void {
    const aspectRatio =
      this.canvasRef.nativeElement.clientWidth /
      this.canvasRef.nativeElement.clientHeight;
    this.camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
    this.camera.position.z = 3;
  }

  protected initRenderer(): void {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvasRef.nativeElement,
    });
    this.renderer.setSize(
      this.canvasRef.nativeElement.clientWidth,
      this.canvasRef.nativeElement.clientHeight
    );
  }

  protected initControls(): void {}
}
