import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
} from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

@Component({
  selector: 'app-lesson-08',
  templateUrl: './lesson-08.component.html',
  styleUrls: ['./lesson-08.component.scss'],
})
export class Lesson08Component implements AfterViewInit {
  @ViewChild('canvas', { static: true })
  private canvasRef!: ElementRef<HTMLCanvasElement>;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;

  @HostListener('window:resize')
  onResize(): void {
    // Update camera aspect ratio and renderer size
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  @HostListener('window:dblclick')
  onDoubleClick(): void {
    // Toggle fullscreen based on the current document state
    if (!document.fullscreenElement) {
      this.canvasRef.nativeElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }

  ngAfterViewInit(): void {
    this.initScene();
    this.initCamera();
    this.initRenderer();
    this.loadTexturesAndCreateMesh();
    this.initOrbitControls();
    this.animate();
  }

  private initScene(): void {
    this.scene = new THREE.Scene();
  }

  private initCamera(): void {
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    this.camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      100
    );
    this.camera.position.set(1, 1, 1);
    this.scene.add(this.camera);
  }

  private initRenderer(): void {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvasRef.nativeElement,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  private loadTexturesAndCreateMesh(): void {
    const loadingManager = new THREE.LoadingManager();
    const textureLoader = new THREE.TextureLoader(loadingManager);

    const colorTexture = textureLoader.load('assets/images/door/color.jpg');
    // Additional textures can be loaded similarly
    // const alphaTexture = textureLoader.load('assets/images/door/alpha.jpg');
    // ...load other textures

    colorTexture.rotation = Math.PI / 4;
    colorTexture.center.set(0.5, 0.5);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ map: colorTexture });
    const mesh = new THREE.Mesh(geometry, material);
    this.scene.add(mesh);
  }

  private initOrbitControls(): void {
    const controls = new OrbitControls(
      this.camera,
      this.canvasRef.nativeElement
    );
    controls.enableDamping = true;
  }

  private animate(): void {
    const render = () => {
      this.renderer.render(this.scene, this.camera);
      requestAnimationFrame(render);
    };
    render();
  }
}
