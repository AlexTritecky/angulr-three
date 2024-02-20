import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

@Component({
  selector: 'app-classic-techniques',
  templateUrl: './classic-techniques.component.html',
  styleUrls: ['./classic-techniques.component.scss'],
})
export class ClassicTechniquesComponent implements AfterViewInit, OnDestroy {
  @ViewChild('classicCanvas', { static: true })
  private canvasRef!: ElementRef<HTMLCanvasElement>;

  private renderer!: THREE.WebGLRenderer;
  private camera!: THREE.PerspectiveCamera;
  private scene!: THREE.Scene;
  private sphere!: THREE.Mesh;
  private frameId: number | null = null;
  private clock = new THREE.Clock();
  private controls!: OrbitControls;
  private uniforms!: { [uniform: string]: { value: any } };

  constructor() {}

  @HostListener('window:resize', ['$event'])
  onResize(event?: Event): void {
    this.updateCameraAspectRatio();
    this.updateRendererSize();
  }

  ngAfterViewInit(): void {
    this.initThree();
    this.initSunSphere();
    this.animate();
  }

  ngOnDestroy(): void {
    if (this.frameId != null) {
      cancelAnimationFrame(this.frameId);
    }
    this.renderer.dispose();
  }

  private initThree(): void {
    const canvas = this.canvasRef.nativeElement;

    this.initializeCamera();

    // Scene
    this.scene = new THREE.Scene();
    // this.scene.background = new THREE.Color(0x393d3f);

    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
    });
    this.renderer.setPixelRatio(devicePixelRatio);
    this.updateRendererSize();

    this.initializeOrbitControls();
  }

  private initializeCamera(): void {
    const parentWidth =
      this.canvasRef.nativeElement.parentElement?.clientWidth ||
      window.innerWidth;
    const parentHeight =
      this.canvasRef.nativeElement.parentElement?.clientHeight ||
      window.innerHeight;

    const aspectRatio = parentWidth / parentHeight;

    this.camera = new THREE.PerspectiveCamera(50, aspectRatio, 0.1, 1000);
    this.camera.position.z = 5;
  }

  private initSunSphere(): void {
    const textureLoader = new THREE.TextureLoader();
    const sunTexture = textureLoader.load('assets/images/2k_sun.jpg');

    const material = new THREE.MeshBasicMaterial({ map: sunTexture });

    this.sphere = new THREE.Mesh(new THREE.SphereGeometry(1, 30, 30), material);
    this.scene.add(this.sphere);

    const light = new THREE.PointLight(0xffffff, 2, 100);
    light.position.set(0, 0, 2); // Position the light a bit in front of the sun
    this.scene.add(light);
  }

  private animate(): void {
    this.frameId = requestAnimationFrame(this.animate.bind(this));

    this.scene.rotation.y += 0.001;
    this.renderer.render(this.scene, this.camera);
  }

  private updateCameraAspectRatio(): void {
    const width =
      this.canvasRef.nativeElement.parentElement?.clientWidth ||
      window.innerWidth;
    const height =
      this.canvasRef.nativeElement.parentElement?.clientHeight ||
      window.innerHeight;
    if (this.camera) {
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    }
  }

  private updateRendererSize(): void {
    const width =
      this.canvasRef.nativeElement.parentElement?.clientWidth ||
      window.innerWidth;
    const height =
      this.canvasRef.nativeElement.parentElement?.clientHeight ||
      window.innerHeight;
    this.renderer.setSize(width, height);
  }

  private initializeOrbitControls(): void {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.update();
  }
}
