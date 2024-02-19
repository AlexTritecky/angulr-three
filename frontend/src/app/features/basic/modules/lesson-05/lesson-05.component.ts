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
  selector: 'app-lesson-05',
  templateUrl: './lesson-05.component.html',
  styleUrls: ['./lesson-05.component.scss'], // Corrected property name
})
export class Lesson05Component implements AfterViewInit {
  @ViewChild('canvas', { static: true })
  private canvasRef!: ElementRef<HTMLCanvasElement>;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;
  private sizes = { width: window.innerWidth, height: window.innerHeight };

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
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const mesh = new THREE.Mesh(geometry, material);
    this.scene.add(mesh);
  }

  private initCamera(): void {
    const aspectRatio = this.sizes.width / this.sizes.height;
    this.camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 100);
    this.camera.position.z = 3;
    this.camera.lookAt(0, 0, 0);
    this.scene.add(this.camera);
  }

  private initRenderer(): void {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvasRef.nativeElement,
    });
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  private initControls(): void {
    this.controls = new OrbitControls(
      this.camera,
      this.canvasRef.nativeElement
    );
    this.controls.enableDamping = true;
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(event: Event): void {
    // Update sizes
    this.sizes.width = window.innerWidth;
    this.sizes.height = window.innerHeight;

    // Update camera
    this.camera.aspect = this.sizes.width / this.sizes.height;
    this.camera.updateProjectionMatrix();

    // Update renderer
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  @HostListener('window:dblclick', ['$event'])
  onWindowDblClick(event: MouseEvent): void {
    const fullscreenElement =
      document.fullscreenElement || document.fullscreenElement;
    if (!fullscreenElement) {
      if (this.canvasRef.nativeElement.requestFullscreen) {
        this.canvasRef.nativeElement.requestFullscreen();
      } else if (this.canvasRef.nativeElement.requestFullscreen) {
        this.canvasRef.nativeElement.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  private animate(): void {
    const clock = new THREE.Clock();

    const tick = () => {
      const elapsedTime = clock.getElapsedTime();

      // Update controls
      this.controls.update();

      // Render
      this.renderer.render(this.scene, this.camera);

      // Call tick again on the next frame
      window.requestAnimationFrame(tick);
    };

    tick();
  }
}
