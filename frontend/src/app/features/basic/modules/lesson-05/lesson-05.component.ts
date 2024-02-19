import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { BaseThreeComponent } from '../../class/component';

@Component({
  selector: 'app-lesson-05',
  templateUrl: './lesson-05.component.html',
  styleUrls: ['./lesson-05.component.scss'],
})
export class Lesson05Component extends BaseThreeComponent {
  @ViewChild('canvas', { static: true })
  protected override canvasRef!: ElementRef<HTMLCanvasElement>;

  constructor() {
    super();
  }

  protected initScene(): void {
    this.scene.background = new THREE.Color(0x393d3f);
  }

  protected addObjects(): void {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const mesh = new THREE.Mesh(geometry, material);
    this.scene.add(mesh);
  }

  protected initCamera(): void {
    const aspectRatio =
      this.canvasRef.nativeElement.clientWidth /
      this.canvasRef.nativeElement.clientHeight;
    this.camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 100);
    this.camera.position.z = 3;
    this.camera.lookAt(0, 0, 0);
  }

  protected initRenderer(): void {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvasRef.nativeElement,
    });
    this.renderer.setSize(
      this.canvasRef.nativeElement.clientWidth,
      this.canvasRef.nativeElement.clientHeight
    );
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  protected initControls(): void {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
  }

  @HostListener('window:dblclick', ['$event'])
  onWindowDblClick(event: MouseEvent): void {
    if (!document.fullscreenElement) {
      this.canvasRef.nativeElement.requestFullscreen().catch((err) => {
        console.log(
          `Error attempting to enable fullscreen mode: ${err.message} (${err.name})`
        );
      });
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}
