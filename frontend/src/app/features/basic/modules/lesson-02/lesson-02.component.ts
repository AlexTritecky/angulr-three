import { Component, ElementRef, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { BaseThreeComponent } from '../../../../class/component';

@Component({
  selector: 'app-lesson-02',
  templateUrl: './lesson-02.component.html',
  styleUrls: ['./lesson-02.component.scss'],
})
export class Lesson02Component extends BaseThreeComponent {
  @ViewChild('canvas', { static: true })
  protected override canvasRef!: ElementRef<HTMLCanvasElement>;

  constructor() {
    super();
  }

  protected initScene(): void {
    this.scene.background = new THREE.Color(0x393d3f);
  }

  protected addObjects(): void {
    this.addGroupWithCubes();
    this.addAxesHelper();
  }

  private addGroupWithCubes(): void {
    const group = new THREE.Group();
    this.scene.add(group);

    const cube1 = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ color: 0xff0000 })
    );
    cube1.position.x = -1.5;
    group.add(cube1);

    const cube2 = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    );
    cube2.position.x = 1.5;
    group.add(cube2);
  }

  private addAxesHelper(): void {
    const axesHelper = new THREE.AxesHelper(2);
    this.scene.add(axesHelper);
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
