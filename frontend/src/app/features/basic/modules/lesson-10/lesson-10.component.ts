import { Component, ElementRef, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { BaseThreeComponent } from '../../class/component';

@Component({
  selector: 'app-lesson-10',
  templateUrl: './lesson-10.component.html',
  styleUrls: ['./lesson-10.component.scss'],
})
export class Lesson10Component extends BaseThreeComponent {
  @ViewChild('canvas', { static: true })
  protected override canvasRef!: ElementRef<HTMLCanvasElement>;

  textureLoader!: THREE.TextureLoader;

  constructor() {
    super();
  }

  protected initScene(): void {
    this.scene.background = new THREE.Color(0x393d3f); // Optional background color
  }

  protected addObjects(): void {
    this.loadFontsAndTextures();
    this.addDonuts();
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
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  protected initControls(): void {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
  }

  private loadFontsAndTextures(): void {
    this.textureLoader = new THREE.TextureLoader();
    const matcapTexture = this.textureLoader.load(
      'assets/images/matcaps/8.png'
    );

    const fontLoader = new FontLoader();
    fontLoader.load('assets/fonts/helvetiker_regular.typeface.json', (font) => {
      const textGeometry = new TextGeometry('Submarine Agency', {
        font: font,
        size: 0.5,
        height: 0.2,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 5,
      });
      textGeometry.center();
      const textMaterial = new THREE.MeshMatcapMaterial({
        matcap: matcapTexture,
      });
      const textMesh = new THREE.Mesh(textGeometry, textMaterial);
      this.scene.add(textMesh);
    });
  }

  private addDonuts(): void {
    const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);
    const donutMaterial = new THREE.MeshMatcapMaterial({
      matcap: this.textureLoader.load('assets/images/matcaps/4.png'),
    });

    for (let i = 0; i < 100; i++) {
      // Adjust the number of donuts as needed
      const donut = new THREE.Mesh(donutGeometry, donutMaterial);
      donut.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      );
      donut.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      donut.scale.setScalar(Math.random() + 0.5);
      this.scene.add(donut);
    }
  }

  protected override update(): void {
    super.update();
  }
}
