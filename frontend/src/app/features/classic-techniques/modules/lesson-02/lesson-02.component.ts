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
import GUI from 'lil-gui';

@Component({
  selector: 'app-lesson-02',
  templateUrl: './lesson-02.component.html',
  styleUrls: ['./lesson-02.component.scss'],
})
export class Lesson02Component implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true })
  private canvasRef!: ElementRef<HTMLCanvasElement>;

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private controls!: OrbitControls;
  private gui!: GUI;
  private clock: THREE.Clock = new THREE.Clock();
  private textureLoader = new THREE.TextureLoader();
  private ambientLight!: THREE.AmbientLight;
  private directionalLight!: THREE.DirectionalLight;
  private spotLight!: THREE.SpotLight;
  private pointLight!: THREE.PointLight;

  ngAfterViewInit(): void {
    this.initThree();
    this.addLights();
    this.addObjects();
    this.startAnimationLoop();
  }

  ngOnDestroy(): void {
    if (this.renderer) {
      this.canvasRef.nativeElement.removeChild(this.renderer.domElement);
    }
  }

  private initThree(): void {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    this.camera.position.set(1, 1, 2);
    this.scene.add(this.camera);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvasRef.nativeElement,
      antialias: true,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;

    this.gui = new GUI();
  }

  private addLights(): void {
    // Ambient Light
    this.ambientLight = new THREE.AmbientLight(0xffffff, 1);
    this.scene.add(this.ambientLight);

    const ambientLightFolder = this.gui.addFolder('Ambient Light');
    ambientLightFolder
      .add(this.ambientLight, 'intensity')
      .min(0)
      .max(3)
      .step(0.001);
    ambientLightFolder.addColor(this.ambientLight, 'color').name('Color');

    // Directional Light
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    this.directionalLight.position.set(2, 2, -1);
    this.directionalLight.castShadow = true;
    this.configureLightShadow(this.directionalLight);
    this.scene.add(this.directionalLight);

    const directionalLightFolder = this.gui.addFolder('Directional Light');

    directionalLightFolder
      .add(this.directionalLight, 'intensity')
      .min(0)
      .max(3)
      .step(0.001);
    directionalLightFolder
      .add(this.directionalLight.position, 'x')
      .min(-5)
      .max(5)
      .step(0.001);
    directionalLightFolder
      .add(this.directionalLight.position, 'y')
      .min(-5)
      .max(5)
      .step(0.001);
    directionalLightFolder
      .add(this.directionalLight.position, 'z')
      .min(-5)
      .max(5)
      .step(0.001);

    // Spot Light
    this.spotLight = new THREE.SpotLight(0xffffff, 3.6, 10, Math.PI * 0.3);
    this.spotLight.position.set(0, 2, 2);
    this.spotLight.castShadow = true;
    this.configureLightShadow(this.spotLight);
    this.scene.add(this.spotLight);

    const spotLightFolder = this.gui.addFolder('Spot Light');

    spotLightFolder.add(this.spotLight, 'penumbra').min(0).max(1).step(0.001);
    spotLightFolder.add(this.spotLight, 'intensity').min(0).max(3).step(0.001);
    spotLightFolder.add(this.spotLight, 'distance').min(0).max(20).step(0.001);

    // Point Light
    this.pointLight = new THREE.PointLight(0xffffff, 2.7);
    this.pointLight.position.set(-1, 1, 0);
    this.pointLight.castShadow = true;
    this.configureLightShadow(this.pointLight);
    this.scene.add(this.pointLight);

    const pointLightFolder = this.gui.addFolder('Point Light');
    pointLightFolder
      .add(this.pointLight, 'intensity')
      .min(0)
      .max(3)
      .step(0.001);
    pointLightFolder
      .add(this.pointLight.position, 'x')
      .min(-5)
      .max(5)
      .step(0.001);
    pointLightFolder
      .add(this.pointLight.position, 'y')
      .min(-5)
      .max(5)
      .step(0.001);
  }

  private configureLightShadow(light: THREE.Light): void {
    if (
      light instanceof THREE.DirectionalLight ||
      light instanceof THREE.SpotLight ||
      light instanceof THREE.PointLight
    ) {
      light.shadow.mapSize.width = 1024;
      light.shadow.mapSize.height = 1024;
      light.shadow.camera.near = 0.5;
      light.shadow.camera.far = 500;
    }
  }

  private addObjects(): void {
    // Materials and Objects
    const material = new THREE.MeshStandardMaterial({
      color: 0x555555,
      roughness: 0.5,
    });
    const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const sphere = new THREE.Mesh(sphereGeometry, material);
    sphere.castShadow = true;
    sphere.position.y = 0.5;
    this.scene.add(sphere);

    const sphereFolder = this.gui.addFolder('Sphere');
    sphereFolder.add(sphere.position, 'y').min(0).max(2).step(0.001);
    sphereFolder.add(material, 'roughness').min(0).max(1).step(0.001);
    sphereFolder.addColor(material, 'color').name('Color');
    sphereFolder.add(material, 'wireframe');
    sphereFolder.add(material, 'metalness').min(0).max(1).step(0.001);

    // Floor
    const floorGeometry = new THREE.PlaneGeometry(10, 10);
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0xaaaaaa,
      roughness: 0.5,
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.scene.add(floor);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private startAnimationLoop(): void {
    const animate = () => {
      requestAnimationFrame(animate);
      this.controls.update();
      this.render();
    };
    animate();
  }

  private render(): void {
    this.renderer.render(this.scene, this.camera);
  }
}
