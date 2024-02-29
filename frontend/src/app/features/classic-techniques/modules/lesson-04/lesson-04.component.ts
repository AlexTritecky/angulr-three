import { Component, ElementRef, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { BaseThreeComponent } from '../../../../class/component';

@Component({
  selector: 'app-lesson-04',
  templateUrl: './lesson-04.component.html',
  styleUrl: './lesson-04.component.scss',
})
export class Lesson04Component extends BaseThreeComponent {
  @ViewChild('canvas', { static: true })
  override canvasRef!: ElementRef<HTMLCanvasElement>;
  private particlesGeometry!: THREE.BufferGeometry;

  private particles!: THREE.Points;

  private clock = new THREE.Clock();
  private count = 20000;

  constructor() {
    super();
  }

  protected override initScene(): void {
    this.scene = new THREE.Scene();
    this.initTHREE();
    this.animate();
  }

  protected override initControls(): void {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
  }

  protected override initCamera(): void {
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    this.camera.position.z = 3;
    this.scene.add(this.camera);
  }

  protected override initRenderer(): void {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvasRef.nativeElement,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  protected override addObjects(): void {
    const textureLoader = new THREE.TextureLoader();
    const particleTexture = textureLoader.load('assets/images/particles/3.png');

    this.particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.count * 3);
    const colors = new Float32Array(this.count * 3);

    for (let i = 0; i < this.count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 10;
      colors[i] = Math.random();
    }

    this.particlesGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3)
    );
    this.particlesGeometry.setAttribute(
      'color',
      new THREE.BufferAttribute(colors, 3)
    );

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.1,
      sizeAttenuation: true,
      depthTest: false,
      blending: THREE.AdditiveBlending,
      transparent: true,
      alphaMap: particleTexture,
      vertexColors: true,
    });

    this.particles = new THREE.Points(
      this.particlesGeometry,
      particlesMaterial
    );
    this.scene.add(this.particles);
  }

  protected override update(): void {
    if (
      this.particlesGeometry &&
      this.particlesGeometry.attributes['position']
    ) {
      const elapsedTime = this.clock.getElapsedTime();

      const positions = this.particlesGeometry.attributes['position'].array;

      for (let i = 0; i < this.count; i++) {
        const i3 = i * 3;
        const x = positions[i3];
        positions[i3 + 1] = Math.sin(elapsedTime + x);
      }

      this.particlesGeometry.attributes['position'].needsUpdate = true;
    }

    this.controls.update();

    super.update();
  }
}
