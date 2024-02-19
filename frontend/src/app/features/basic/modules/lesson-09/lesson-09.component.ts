import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { gsap } from 'gsap';
import GUI from 'lil-gui';

@Component({
  selector: 'app-lesson-09',
  templateUrl: './lesson-09.component.html',
  styleUrls: ['./lesson-09.component.scss'],
})
export class Lesson09Component implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true })
  private canvasRef!: ElementRef<HTMLCanvasElement>;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;
  private frameId!: number;

  private gui!: GUI;

  private clock: THREE.Clock = new THREE.Clock();
  private sphereMesh!: THREE.Mesh;
  private planeMesh!: THREE.Mesh;
  private torusMesh!: THREE.Mesh;
  private material!: THREE.MeshPhysicalMaterial;

  constructor() {}

  ngAfterViewInit(): void {
    this.initTHREE();
    this.addObjects();
    this.debug();
    this.animate();
  }

  ngOnDestroy(): void {
    if (this.frameId) {
      cancelAnimationFrame(this.frameId);
    }
    this.renderer.domElement.removeEventListener('resize', this.onResize);
    if (this.gui) this.gui.destroy();
  }

  private initTHREE(): void {
    this.scene = new THREE.Scene();
    const aspectRatio =
      this.canvasRef.nativeElement.clientWidth /
      this.canvasRef.nativeElement.clientHeight;
    this.camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 100);
    this.camera.position.set(1, 1, 2);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvasRef.nativeElement,
    });
    this.renderer.setSize(
      this.canvasRef.nativeElement.clientWidth,
      this.canvasRef.nativeElement.clientHeight
    );
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;

    window.addEventListener('resize', this.onResize);
  }

  private onResize = (): void => {
    this.camera.aspect =
      this.canvasRef.nativeElement.clientWidth /
      this.canvasRef.nativeElement.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(
      this.canvasRef.nativeElement.clientWidth,
      this.canvasRef.nativeElement.clientHeight
    );
  };

  private addObjects(): void {
    const loadingManager = new THREE.LoadingManager();
    const textureLoader = new THREE.TextureLoader(loadingManager);

    const doorColorTexture = textureLoader.load('assets/images/door/color.jpg');
    const matcap1Texture = textureLoader.load('assets/images/matcaps/1.png');

    doorColorTexture.colorSpace = THREE.SRGBColorSpace;
    matcap1Texture.colorSpace = THREE.SRGBColorSpace;

    this.material = new THREE.MeshPhysicalMaterial({
      metalness: 0,
      roughness: 0,
      transmission: 1,
      ior: 2.417,
      thickness: 0.5,
    });

    this.material.metalness = 0;
    this.material.roughness = 0;

    this.material.transmission = 1;
    this.material.ior = 2.417;
    this.material.thickness = 0.5;

    // Geometries
    const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    this.sphereMesh = new THREE.Mesh(sphereGeometry, this.material);
    this.sphereMesh.position.x = -1.5;

    const planeGeometry = new THREE.PlaneGeometry(1, 1);
    this.planeMesh = new THREE.Mesh(planeGeometry, this.material);

    const torusGeometry = new THREE.TorusGeometry(0.3, 0.2, 16, 100);
    this.torusMesh = new THREE.Mesh(torusGeometry, this.material);
    this.torusMesh.position.x = 1.5;

    this.scene.add(this.sphereMesh, this.planeMesh, this.torusMesh);

    // Environment Map
    const rgbeLoader = new RGBELoader(loadingManager);
    rgbeLoader.load('assets/images/environmentMap/2k.hdr', (envMap) => {
      envMap.mapping = THREE.EquirectangularReflectionMapping;
      this.scene.environment = envMap;
      this.scene.background = envMap;
    });
  }

  private animate = (): void => {
    this.renderer.render(this.scene, this.camera);

    const elapsedTime = this.clock.getElapsedTime();

    this.sphereMesh.rotation.y = elapsedTime * 0.1;
    this.planeMesh.rotation.y = elapsedTime * 0.1;
    this.torusMesh.rotation.y = elapsedTime * 0.1;

    this.sphereMesh.rotation.x = -0.15 * elapsedTime;
    this.planeMesh.rotation.x = -0.15 * elapsedTime;
    this.torusMesh.rotation.x = -0.15 * elapsedTime;

    this.controls.update();
    this.frameId = requestAnimationFrame(this.animate);
  };

  private debug(): void {
    this.gui = new GUI();

    this.gui.add(this.material, 'metalness').min(0).max(1).step(0.0001);
    this.gui.add(this.material, 'roughness').min(0).max(1).step(0.0001);
    this.gui.add(this.material, 'transmission').min(0).max(1).step(0.0001);
    this.gui.add(this.material, 'ior').min(1).max(2.333).step(0.0001);
    this.gui.add(this.material, 'thickness').min(0).max(1).step(0.0001);
  }
}
