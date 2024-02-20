import { Component, ElementRef, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { BaseThreeComponent } from '../../class/component';

@Component({
  selector: 'app-lesson-08',
  templateUrl: './lesson-08.component.html',
  styleUrls: ['./lesson-08.component.scss'],
})
export class Lesson08Component extends BaseThreeComponent {
  @ViewChild('canvas', { static: true })
  protected override canvasRef!: ElementRef<HTMLCanvasElement>;

  constructor() {
    super();
  }

  protected initScene(): void {
    this.scene.background = new THREE.Color(0x393d3f);
  }

  protected addObjects(): void {
    this.loadTexturesAndCreateMesh();
  }

  private loadTexturesAndCreateMesh(): void {
    const textureLoader = new THREE.TextureLoader();
    const colorTexture = textureLoader.load('assets/images/door/color.jpg');

    colorTexture.rotation = Math.PI / 4;
    colorTexture.center.set(0.5, 0.5);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ map: colorTexture });
    const mesh = new THREE.Mesh(geometry, material);
    this.scene.add(mesh);
  }

  protected initCamera(): void {
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    this.camera.position.set(1, 1, 1);
  }

  protected initRenderer(): void {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvasRef.nativeElement,
      antialias: true, // Optional but recommended for better visuals
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  protected initControls(): void {
    this.controls = new OrbitControls(
      this.camera,
      this.canvasRef.nativeElement
    );
    this.controls.enableDamping = true;
  }
}
