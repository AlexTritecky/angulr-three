import { Component, ElementRef, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { BaseThreeComponent } from '../../../../class/component';

@Component({
  selector: 'app-lesson-03',
  templateUrl: './lesson-03.component.html',
  styleUrls: ['./lesson-03.component.scss'],
})
export class Lesson03Component extends BaseThreeComponent {
  @ViewChild('canvas', { static: true })
  protected override canvasRef!: ElementRef<HTMLCanvasElement>;

  private clock: THREE.Clock = new THREE.Clock();

  private mesh!: THREE.Mesh;

  constructor() {
    super();
  }

  protected initScene(): void {
    this.scene.background = new THREE.Color(0x393d3f);
  }

  protected addObjects(): void {
    this.createMesh();
  }

  private createMesh(): void {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    this.mesh = new THREE.Mesh(geometry, material);
    this.scene.add(this.mesh);
  }

  protected initCamera(): void {
    const sizes = {
      width: this.canvasRef.nativeElement.clientWidth,
      height: this.canvasRef.nativeElement.clientHeight,
    };

    this.camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      1000
    );
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

  protected initControls(): void {
    // Lesson03 does not use controls, so this can be left empty or implement controls if needed.
  }

  protected override update(): void {
    const elapsedTime = this.clock.getElapsedTime();

    // Custom animation logic for Lesson03
    this.mesh.rotation.y = Math.sin(elapsedTime);
    this.mesh.rotation.x = Math.cos(elapsedTime);

    this.camera.lookAt(this.mesh.position);
  }
}
