import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { BaseThreeComponent } from '../../../../class/component';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

@Component({
  selector: 'app-lesson-06',
  templateUrl: './lesson-06.component.html',
  styleUrls: ['./lesson-06.component.scss'],
})
export class Lesson06Component extends BaseThreeComponent {
  @ViewChild('canvas', { static: true })
  protected override canvasRef!: ElementRef<HTMLCanvasElement>;

  private cursor = { x: 0, y: 0 };

  constructor() {
    super();
  }

  protected initScene(): void {
    this.scene.background = new THREE.Color(0x393d3f);
  }

  protected addObjects(): void {
    this.addRandomGeometry();
  }

  private addRandomGeometry(): void {
    const count = 50;
    const geometry = new THREE.BufferGeometry();
    const positionsArray = new Float32Array(count * 3 * 3);
    for (let i = 0; i < count * 3 * 3; i++) {
      positionsArray[i] = (Math.random() - 0.5) * 4; // Random positions
    }
    geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positionsArray, 3)
    );
    const material = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      wireframe: true,
    });
    const mesh = new THREE.Mesh(geometry, material);
    this.scene.add(mesh);
  }

  protected initCamera(): void {
    // Assuming the sizes are managed globally or recalculated here
    const aspectRatio =
      this.canvasRef.nativeElement.clientWidth /
      this.canvasRef.nativeElement.clientHeight;
    this.camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 100);
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
    this.renderer.setPixelRatio(window.devicePixelRatio);
  }

  protected initControls(): void {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
  }

  @HostListener('window:dblclick')
  onDoubleClick(): void {
    if (!document.fullscreenElement) {
      this.canvasRef.nativeElement.requestFullscreen().catch((err: any) => {
        console.log(
          `Error attempting to enable fullscreen mode: ${err.message} (${err.name})`
        );
      });
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    this.cursor.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.cursor.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  protected override update(): void {
    super.update();
  }
}
