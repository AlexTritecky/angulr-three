import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
} from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-lesson-01',
  templateUrl: './lesson-01.component.html',
  styleUrls: ['./lesson-01.component.scss'],
})
export class Lesson01Component implements AfterViewInit {
  @ViewChild('canvas', { static: true })
  private canvasRef!: ElementRef<HTMLCanvasElement>;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;

  constructor() {}

  ngAfterViewInit(): void {
    this.initScene();
    this.addCube();
    this.addCamera();
    this.addRenderer();
    this.renderer.setSize(
      this.canvasRef.nativeElement.clientWidth,
      this.canvasRef.nativeElement.clientHeight
    );
    this.render();
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.camera.aspect =
      this.canvasRef.nativeElement.clientWidth /
      this.canvasRef.nativeElement.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(
      this.canvasRef.nativeElement.clientWidth,
      this.canvasRef.nativeElement.clientHeight
    );
    this.render();
  }

  private initScene(): void {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x393d3f);
  }

  private addCube(): void {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const cube = new THREE.Mesh(geometry, material);
    this.scene.add(cube);
  }

  private addCamera(): void {
    const aspectRatio =
      this.canvasRef.nativeElement.clientWidth /
      this.canvasRef.nativeElement.clientHeight;
    this.camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
    this.camera.position.z = 3;
  }

  private addRenderer(): void {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvasRef.nativeElement,
    });
  }

  private render(): void {
    this.renderer.render(this.scene, this.camera);
  }
}
