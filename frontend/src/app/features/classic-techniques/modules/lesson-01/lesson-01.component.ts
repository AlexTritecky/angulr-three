import { Component, ElementRef, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { BaseThreeComponent } from '../../../../class/component';

@Component({
  selector: 'app-lesson-01',
  templateUrl: './lesson-01.component.html',
  styleUrls: ['./lesson-01.component.scss'],
})
export class Lesson01Component extends BaseThreeComponent {
  @ViewChild('canvas', { static: true })
  protected override canvasRef!: ElementRef<HTMLCanvasElement>;

  sphere!: THREE.Mesh;
  cube!: THREE.Mesh;
  torus!: THREE.Mesh;
  private clock = new THREE.Clock();

  constructor() {
    super();
  }

  protected override initScene(): void {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x393d3f);
    this.setupLights();
  }

  protected override initCamera(): void {
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    this.camera.position.set(1, 1, 2);
    this.scene.add(this.camera);
  }

  protected override initRenderer(): void {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvasRef.nativeElement,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  protected override initControls(): void {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
  }

  protected override addObjects(): void {
    this.setupObjects();
  }

  private setupLights(): void {
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
    directionalLight.position.set(2, 2, -1);
    this.scene.add(directionalLight);
    // Additional lights can be added here
  }

  private setupObjects(): void {
    const material = new THREE.MeshStandardMaterial({ roughness: 0.4 });
    this.sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 32, 32),
      material
    );
    this.sphere.position.x = -1.5;
    this.scene.add(this.sphere);

    this.cube = new THREE.Mesh(
      new THREE.BoxGeometry(0.75, 0.75, 0.75),
      material
    );

    this.scene.add(this.cube);

    this.torus = new THREE.Mesh(
      new THREE.TorusGeometry(0.3, 0.2, 32, 64),
      material
    );
    this.torus.position.x = 1.5;

    this.scene.add(this.torus);

    const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
    plane.rotation.x = -Math.PI * 0.5;
    plane.position.y = -0.65;

    this.scene.add(plane);
  }

  protected override update(): void {
    super.update();

    const elapsedTime = this.clock.getElapsedTime();

    // Update your objects here
    this.sphere.rotation.y = 0.1 * elapsedTime;
    this.cube.rotation.y = 0.1 * elapsedTime;
    this.torus.rotation.y = 0.1 * elapsedTime;

    this.sphere.rotation.x = 0.15 * elapsedTime;
    this.cube.rotation.x = 0.15 * elapsedTime;
    this.torus.rotation.x = 0.15 * elapsedTime;
  }
}
