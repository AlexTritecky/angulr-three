import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';
import { BaseThreeComponent } from '../../../../class/component';

@Component({
  selector: 'app-lesson-05',
  templateUrl: './lesson-05.component.html',
  styleUrls: ['./lesson-05.component.scss'],
})
export class Lesson05Component extends BaseThreeComponent {
  @ViewChild('canvas', { static: true })
  override canvasRef!: ElementRef<HTMLCanvasElement>;

  private gui!: GUI;
  private parameters: any;
  private points: THREE.Points | null = null;

  constructor() {
    super();
    this.parameters = {
      count: 1000,
      size: 0.02,
      radius: 5,
      branches: 3,
      spin: 1,
      randomness: 0.2,
      randomnessPower: 3,
      insideColor: '#ff6030',
      outsideColor: '#1b3984',
    };
  }

  protected initScene(): void {
    this.scene = new THREE.Scene();
    this.setupGUI();
  }

  // ngAfterViewInit(): void {
  //   this.initThree();
  //   this.addGalaxy();
  //   this.setupGUI();
  //   this.animate();
  // }

  override ngOnDestroy(): void {
    this.gui.destroy();
  }

  protected override addObjects(): void {
    if (this.points !== null) {
      this.points.geometry.dispose();
      this.scene.remove(this.points);
    }

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.parameters.count * 3);
    const colors = new Float32Array(this.parameters.count * 3);
    const colorInside = new THREE.Color(this.parameters.insideColor);
    const colorOutside = new THREE.Color(this.parameters.outsideColor);

    for (let i = 0; i < this.parameters.count; i++) {
      const i3 = i * 3;
      const radius = Math.random() * this.parameters.radius;
      const spinAngle = radius * this.parameters.spin;
      const branchAngle =
        ((i % this.parameters.branches) / this.parameters.branches) *
        Math.PI *
        2;

      const randomX =
        Math.pow(Math.random(), this.parameters.randomnessPower) *
        (Math.random() < 0.5 ? 1 : -1) *
        this.parameters.randomness *
        radius;
      const randomY =
        Math.pow(Math.random(), this.parameters.randomnessPower) *
        (Math.random() < 0.5 ? 1 : -1) *
        this.parameters.randomness *
        radius;
      const randomZ =
        Math.pow(Math.random(), this.parameters.randomnessPower) *
        (Math.random() < 0.5 ? 1 : -1) *
        this.parameters.randomness *
        radius;

      positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
      positions[i3 + 1] = randomY;
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

      // Color
      const mixedColor = colorInside.clone();
      mixedColor.lerp(colorOutside, radius / this.parameters.radius);

      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: this.parameters.size,
      sizeAttenuation: true,
      depthTest: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
    });

    this.points = new THREE.Points(geometry, material);
    this.scene.add(this.points);
  }

  private setupGUI(): void {
    this.gui = new GUI();
    this.canvasRef.nativeElement.parentElement?.appendChild(
      this.gui.domElement
    );
    const gui = this.gui;

    gui
      .add(this.parameters, 'count', 100, 30000, 100)
      .onFinishChange(() => this.addObjects());
    gui
      .add(this.parameters, 'size', 0.001, 0.1, 0.001)
      .onFinishChange(() => this.addObjects());
    gui
      .add(this.parameters, 'radius', 1, 20, 0.1)
      .onFinishChange(() => this.addObjects());
    gui
      .add(this.parameters, 'branches', 2, 20, 1)
      .onFinishChange(() => this.addObjects());
    gui
      .add(this.parameters, 'spin', -5, 5, 0.001)
      .onFinishChange(() => this.addObjects());
    gui
      .add(this.parameters, 'randomness', 0, 2, 0.001)
      .onFinishChange(() => this.addObjects());
    gui
      .add(this.parameters, 'randomnessPower', 1, 10, 0.001)
      .onFinishChange(() => this.addObjects());
    gui
      .addColor(this.parameters, 'insideColor')
      .onFinishChange(() => this.addObjects());
    gui
      .addColor(this.parameters, 'outsideColor')
      .onFinishChange(() => this.addObjects());
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

  protected override initControls(): void {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
  }
}
