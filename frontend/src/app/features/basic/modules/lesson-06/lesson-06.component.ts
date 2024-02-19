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
  selector: 'app-lesson-06',
  templateUrl: './lesson-06.component.html',
  styleUrls: ['./lesson-06.component.scss'], // Correct the property name
})
export class Lesson06Component implements AfterViewInit {
  @ViewChild('canvas', { static: true })
  private canvasRef!: ElementRef<HTMLCanvasElement>;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;

  // Cursor tracking
  private cursor = { x: 0, y: 0 };

  constructor() {}

  ngAfterViewInit(): void {
    this.initThree();
    this.addRandomGeometry();
    this.animate();
  }

  private initThree(): void {
    // Scene
    this.scene = new THREE.Scene();

    // Sizes
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    // Camera
    const aspectRatio = sizes.width / sizes.height;
    this.camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 100);
    this.camera.position.z = 3;
    this.scene.add(this.camera);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvasRef.nativeElement,
    });
    this.onResize(); // Set initial size and pixel ratio

    // Controls
    this.controls = new OrbitControls(
      this.camera,
      this.canvasRef.nativeElement
    );
    this.controls.enableDamping = true;
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

  private animate(): void {
    const tick = () => {
      // Update controls
      this.controls.update();

      // Render
      this.renderer.render(this.scene, this.camera);

      // Keep looping
      requestAnimationFrame(tick);
    };
    tick();
  }

  @HostListener('window:resize')
  onResize(): void {
    // Update sizes
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Update camera
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    // Update renderer
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  @HostListener('window:dblclick')
  onDoubleClick(): void {
    if (!document.fullscreenElement) {
      this.canvasRef.nativeElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    this.cursor.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.cursor.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }
}
