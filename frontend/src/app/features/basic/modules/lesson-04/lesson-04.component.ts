import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
} from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

@Component({
  selector: 'app-lesson-04',
  templateUrl: './lesson-04.component.html',
  styleUrls: ['./lesson-04.component.scss'], // Corrected property name
})
export class Lesson04Component implements AfterViewInit {
  @ViewChild('canvas', { static: true })
  private canvasRef!: ElementRef<HTMLCanvasElement>;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;

  private cursor = { x: 0, y: 0 };

  constructor() {}

  ngAfterViewInit(): void {
    this.initScene();
    this.initCamera();
    this.initRenderer();
    this.initControls();
    this.animate();
  }

  private initScene(): void {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x393d3f);

    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ color: 0xff0000 })
    );
    this.scene.add(mesh);
  }

  private initCamera(): void {
    const aspectRatio =
      this.canvasRef.nativeElement.clientWidth /
      this.canvasRef.nativeElement.clientHeight;
    this.camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 100);
    this.camera.position.z = 3;
  }

  private initRenderer(): void {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvasRef.nativeElement,
    });
    this.renderer.setSize(
      this.canvasRef.nativeElement.clientWidth,
      this.canvasRef.nativeElement.clientHeight
    );
  }

  private initControls(): void {
    this.controls = new OrbitControls(
      this.camera,
      this.canvasRef.nativeElement
    );
    this.controls.enableDamping = true;
  }

  private animate(): void {
    const animate = () => {
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
      requestAnimationFrame(animate);
    };
    animate();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    this.cursor.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.cursor.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }
}
