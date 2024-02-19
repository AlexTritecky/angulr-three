import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  HostListener,
} from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

@Component({
  selector: 'app-basic',
  templateUrl: './basic.component.html',
  styleUrls: ['./basic.component.scss'], // Correct the property name to styleUrls
})
export class BasicComponent implements AfterViewInit, OnDestroy {
  @ViewChild('basicCanvas', { static: true })
  private canvasRef!: ElementRef<HTMLCanvasElement>;
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private controls!: OrbitControls;
  private sphere!: THREE.Mesh;
  private clock: THREE.Clock = new THREE.Clock();
  private particles!: THREE.Points;
  private pointLight!: THREE.PointLight;

  constructor() {}

  @HostListener('window:resize', ['$event'])
  onResize(event?: Event): void {
    this.updateCameraAspectRatio();
    this.updateRendererSize();
  }

  ngAfterViewInit(): void {
    this.initThree();
    this.addSphere();
    this.addParticles();
    this.addMovingLight();
    this.animate();
    this.onResize();
  }

  ngOnDestroy(): void {
    if (this.renderer) {
      this.renderer.dispose();
    }
    if (this.controls) {
      this.controls.dispose();
    }
  }

  private initThree(): void {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x393d3f);

    this.initializeCamera();

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvasRef.nativeElement,
      antialias: true,
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.updateRendererSize();

    this.initializeOrbitControls();
  }

  private addSphere(): void {
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const sphereColor = new THREE.Color('#62929e');
    const material = new THREE.MeshBasicMaterial({
      color: sphereColor,
      wireframe: true,
    });
    this.sphere = new THREE.Mesh(geometry, material);
    this.scene.add(this.sphere);
  }

  private animate = (): void => {
    requestAnimationFrame(this.animate);

    const elapsedTime = this.clock.getElapsedTime();
    this.sphere.rotation.y = elapsedTime * 0.5;

    this.particles.rotation.y = -0.1 * elapsedTime;

    const lightSpeed = 0.5;
    this.pointLight.position.x = Math.sin(elapsedTime * lightSpeed) * 5;
    this.pointLight.position.z = Math.cos(elapsedTime * lightSpeed) * 5;

    const colorHue = Math.sin(elapsedTime * 0.2) * 0.5 + 0.5;
    if ((this.sphere.material as THREE.MeshBasicMaterial).color) {
      (this.sphere.material as THREE.MeshBasicMaterial).color.setHSL(
        colorHue,
        1,
        0.5
      );
    }

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  };

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

  private initializeOrbitControls(): void {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.update();
  }

  private addParticles(): void {
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 500;
    const posArray = new Float32Array(particlesCount * 3); // x,y,z for each particle

    for (let i = 0; i < particlesCount * 3; i++) {
      // Distribute particles around the sphere
      posArray[i] = (Math.random() - 0.5) * 5;
    }

    particlesGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(posArray, 3)
    );
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.05,
      color: '#ffffff',
    });

    this.particles = new THREE.Points(particlesGeometry, particlesMaterial);
    this.scene.add(this.particles);
  }

  private addMovingLight(): void {
    this.pointLight = new THREE.PointLight(0xffffff, 1, 100);
    this.pointLight.position.set(5, 0, 5);
    this.scene.add(this.pointLight);
  }
}
