import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { gsap } from 'gsap';
import GUI from 'lil-gui';

@Component({
  selector: 'app-lesson-07',
  templateUrl: './lesson-07.component.html',
  styleUrls: ['./lesson-07.component.scss'], // Correct the property name
})
export class Lesson07Component implements AfterViewInit {
  @ViewChild('canvas', { static: true })
  private canvasRef!: ElementRef<HTMLCanvasElement>;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;
  private material!: THREE.MeshBasicMaterial;

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

  private mesh!: THREE.Mesh;

  constructor() {}

  ngAfterViewInit(): void {
    this.initThree();
    this.addMesh();
    this.setupGui();
    this.animate();
  }

  private initThree(): void {
    this.scene = new THREE.Scene();

    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    const aspectRatio = sizes.width / sizes.height;
    this.camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 100);
    this.camera.position.z = 3;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvasRef.nativeElement,
    });
    this.renderer.setSize(sizes.width, sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.controls = new OrbitControls(
      this.camera,
      this.canvasRef.nativeElement
    );
    this.controls.enableDamping = true;
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
    const gui = new GUI();
    gui
      .add(this.debugObject, 'subdivision', 1, 10, 1)
      .onFinishChange(this.updateGeometry.bind(this));
    gui
      .addColor(this.debugObject, 'color')
      .onChange(this.updateMaterialColor.bind(this));
    gui.add(this.debugObject, 'spin');
    gui.add(this.material, 'wireframe');
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
    this.mesh.geometry.dispose(); // Dispose of the old geometry
    this.mesh.geometry = geometry;
  }

  private updateMaterialColor(): void {
    this.material.color.set(this.debugObject.color);
  }

  private animate(): void {
    const animate = () => {
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
      requestAnimationFrame(animate);
    };
    animate();
  }
}
