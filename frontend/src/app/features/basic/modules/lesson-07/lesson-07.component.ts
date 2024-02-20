import { Component, ElementRef, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { gsap } from 'gsap';
import GUI from 'lil-gui';
import { BaseThreeComponent } from '../../../../class/component';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

@Component({
  selector: 'app-lesson-07',
  templateUrl: './lesson-07.component.html',
  styleUrls: ['./lesson-07.component.scss'],
})
export class Lesson07Component extends BaseThreeComponent {
  @ViewChild('canvas', { static: true })
  protected override canvasRef!: ElementRef<HTMLCanvasElement>;

  private material!: THREE.MeshBasicMaterial;
  private mesh!: THREE.Mesh;
  private gui!: GUI;

  private debugObject = {
    color: 0xff0000,
    wireframe: true,
    spin: () => {
      gsap.to(this.mesh.rotation, {
        duration: 1,
        y: this.mesh.rotation.y + Math.PI * 2,
      });
    },
    subdivision: 30,
  };

  constructor() {
    super();
  }

  protected initScene(): void {
    this.scene.background = new THREE.Color(0x393d3f);
    this.addMesh();
    this.setupGui();
  }

  protected addObjects(): void {
    this.addMesh();
    this.setupGui();
  }

  private addMesh(): void {
    const geometry = new THREE.BoxGeometry(
      1,
      1,
      1,
      this.debugObject.subdivision,
      this.debugObject.subdivision,
      this.debugObject.subdivision
    );
    this.material = new THREE.MeshBasicMaterial({
      color: this.debugObject.color,
      wireframe: this.debugObject.wireframe,
    });
    this.mesh = new THREE.Mesh(geometry, this.material);
    this.scene.add(this.mesh);
  }

  private setupGui(): void {
    this.gui = new GUI();
    this.gui
      .add(this.debugObject, 'subdivision', 1, 100, 1)
      .name('Subdivision')
      .onFinishChange(this.updateGeometry.bind(this));

    this.gui
      .addColor(this.debugObject, 'color')
      .name('Color')
      .onChange(this.updateMaterialColor.bind(this));

    this.gui.add(this.debugObject, 'spin').name('Spin!');

    this.gui.add(this.debugObject, 'wireframe').onChange((value: boolean) => {
      this.material.wireframe = value;
    });
  }

  private updateGeometry(): void {
    const geometry = new THREE.BoxGeometry(
      1,
      1,
      1,
      this.debugObject.subdivision,
      this.debugObject.subdivision,
      this.debugObject.subdivision
    );
    this.mesh.geometry.dispose();
    this.mesh.geometry = geometry;
  }

  private updateMaterialColor(): void {
    this.material.color.set(this.debugObject.color);
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    if (this.gui) this.gui.destroy();
  }

  protected initCamera(): void {
    const aspectRatio =
      this.canvasRef.nativeElement.clientWidth /
      this.canvasRef.nativeElement.clientHeight;
    this.camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 100);
    this.camera.position.z = 3;
  }

  protected initRenderer(): void {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvasRef.nativeElement,
      antialias: true, // Optional but can improve the visual quality
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  protected initControls(): void {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
  }
}
