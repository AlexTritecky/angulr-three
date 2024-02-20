import { Component, ElementRef, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { gsap } from 'gsap';
import GUI from 'lil-gui';
import { BaseThreeComponent } from '../../../../class/component';

@Component({
  selector: 'app-lesson-09',
  templateUrl: './lesson-09.component.html',
  styleUrls: ['./lesson-09.component.scss'],
})
export class Lesson09Component extends BaseThreeComponent {
  @ViewChild('canvas', { static: true })
  protected override canvasRef!: ElementRef<HTMLCanvasElement>;

  private gui!: GUI;
  private clock: THREE.Clock = new THREE.Clock();
  private material!: THREE.MeshPhysicalMaterial;
  private sphereMesh!: THREE.Mesh;
  private planeMesh!: THREE.Mesh;
  private torusMesh!: THREE.Mesh;

  constructor() {
    super();
  }

  protected initScene(): void {
    this.scene.background = new THREE.Color(0x393d3f);
    this.loadEnvironment();
  }
  override ngOnDestroy(): void {
    this.gui.destroy();
    super.ngOnDestroy();
  }

  protected addObjects(): void {
    this.addMeshes();
    this.setupGui();
  }

  protected initCamera(): void {
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    this.camera.position.set(1, 1, 2);
  }

  protected initRenderer(): void {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvasRef.nativeElement,
      antialias: true,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
  }

  protected initControls(): void {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
  }

  private loadEnvironment(): void {
    const rgbeLoader = new RGBELoader();
    rgbeLoader.load('assets/images/environmentMap/2k.hdr', (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      this.scene.environment = texture;
      this.scene.background = texture;
    });
  }

  private addMeshes(): void {
    this.material = new THREE.MeshPhysicalMaterial({
      metalness: 0,
      roughness: 0,
      transmission: 1,
      ior: 2.417,
      thickness: 0.5,
    });

    const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const planeGeometry = new THREE.PlaneGeometry(1, 1);
    const torusGeometry = new THREE.TorusGeometry(0.3, 0.2, 16, 100);

    this.sphereMesh = new THREE.Mesh(sphereGeometry, this.material);
    this.planeMesh = new THREE.Mesh(planeGeometry, this.material);
    this.torusMesh = new THREE.Mesh(torusGeometry, this.material);

    this.sphereMesh.position.x = -1.5;
    this.torusMesh.position.x = 1.5;

    this.scene.add(this.sphereMesh, this.planeMesh, this.torusMesh);
  }

  private setupGui(): void {
    this.gui = new GUI();

    this.gui.add(this.material, 'metalness').min(0).max(1).step(0.0001);
    this.gui.add(this.material, 'roughness').min(0).max(1).step(0.0001);
    this.gui.add(this.material, 'transmission').min(0).max(1).step(0.0001);
    this.gui.add(this.material, 'ior').min(1).max(2.333).step(0.0001);
    this.gui.add(this.material, 'thickness').min(0).max(1).step(0.0001);
  }

  protected override update(): void {
    const elapsedTime = this.clock.getElapsedTime();

    // Update mesh rotations
    this.sphereMesh.rotation.y = elapsedTime * 0.1;
    this.planeMesh.rotation.y = elapsedTime * 0.1;
    this.torusMesh.rotation.y = elapsedTime * 0.1;

    this.sphereMesh.rotation.x = -0.15 * elapsedTime;
    this.planeMesh.rotation.x = -0.15 * elapsedTime;
    this.torusMesh.rotation.x = -0.15 * elapsedTime;

    super.update(); // Ensure controls are updated
  }
}
