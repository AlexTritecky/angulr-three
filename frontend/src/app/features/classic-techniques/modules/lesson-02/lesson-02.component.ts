import { Component, ElementRef, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';
import { BaseThreeComponent } from '../../../../class/component';

@Component({
  selector: 'app-lesson-02',
  templateUrl: './lesson-02.component.html',
  styleUrls: ['./lesson-02.component.scss'],
})
export class Lesson02Component extends BaseThreeComponent {
  @ViewChild('canvas', { static: true })
  protected override canvasRef!: ElementRef<HTMLCanvasElement>;

  private gui!: GUI;
  private clock: THREE.Clock = new THREE.Clock();
  private textureLoader = new THREE.TextureLoader();
  private ambientLight!: THREE.AmbientLight;
  private directionalLight!: THREE.DirectionalLight;
  private spotLight!: THREE.SpotLight;
  private pointLight!: THREE.PointLight;
  private sphere!: THREE.Mesh;
  private material!: THREE.MeshStandardMaterial;
  private directionalLightCameraHelper!: THREE.CameraHelper;
  private spotLightHelper!: THREE.CameraHelper;
  private pointLightHelper!: THREE.CameraHelper;

  constructor() {
    super();
  }

  protected override initScene(): void {
    this.scene = new THREE.Scene();
    this.addLights();
    this.initThree();
    this.addObjects();
    this.setupGui();
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
    // Initialize renderer if not done in initThree
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvasRef.nativeElement,
      antialias: true,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  }

  private initThree(): void {
    this.initCamera();
    this.initRenderer();
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
  }

  private addLights(): void {
    // Ambient Light
    this.ambientLight = new THREE.AmbientLight(0xffffff, 1);
    this.scene.add(this.ambientLight);

    // Directional Light
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    this.directionalLight.position.set(2, 2, -1);
    this.directionalLight.castShadow = true;
    this.configureLightShadow(this.directionalLight);
    this.scene.add(this.directionalLight);

    this.directionalLightCameraHelper = new THREE.CameraHelper(
      this.directionalLight.shadow.camera
    );
    this.directionalLightCameraHelper.visible = false;
    this.scene.add(this.directionalLightCameraHelper);

    // Spot Light
    this.spotLight = new THREE.SpotLight(0xffffff, 3.6, 10, Math.PI * 0.3);
    this.spotLight.position.set(0, 2, 2);
    this.spotLight.castShadow = true;
    this.configureLightShadow(this.spotLight);
    this.scene.add(this.spotLight);

    this.spotLightHelper = new THREE.CameraHelper(this.spotLight.shadow.camera);
    this.spotLightHelper.visible = false;
    this.scene.add(this.spotLightHelper);

    // Point Light
    this.pointLight = new THREE.PointLight(0xffffff, 2.7);
    this.pointLight.position.set(-1, 1, 0);
    this.pointLight.castShadow = true;
    this.configureLightShadow(this.pointLight);
    this.scene.add(this.pointLight);

    this.pointLightHelper = new THREE.CameraHelper(
      this.pointLight.shadow.camera
    );
    this.pointLightHelper.visible = false;

    this.scene.add(this.pointLightHelper);
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

  protected override addObjects(): void {
    this.material = new THREE.MeshStandardMaterial({
      color: 0x555555,
      roughness: 0.5,
    });
    const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    this.sphere = new THREE.Mesh(sphereGeometry, this.material);
    this.sphere.castShadow = true;
    this.sphere.position.y = 0.5;
    this.scene.add(this.sphere);

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

  private setupGui(): void {
    this.gui = new GUI();

    const sphereFolder = this.gui.addFolder('Sphere');
    sphereFolder.add(this.sphere.position, 'y').min(0).max(2).step(0.001);
    sphereFolder.add(this.material, 'roughness').min(0).max(1).step(0.001);
    sphereFolder.addColor(this.material, 'color').name('Color');
    sphereFolder.add(this.material, 'wireframe');
    sphereFolder.add(this.material, 'metalness').min(0).max(1).step(0.001);

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

    pointLightFolder
      .add(this.pointLightHelper, 'visible')
      .name('Camera Helper Visible')
      .onChange((value: boolean) => {
        this.pointLightHelper.visible = value;
      });

    pointLightFolder.addColor(this.pointLight, 'color').name('Color');

    const spotLightFolder = this.gui.addFolder('Spot Light');
    spotLightFolder.add(this.spotLight, 'penumbra').min(0).max(1).step(0.001);
    spotLightFolder.add(this.spotLight, 'intensity').min(0).max(3).step(0.001);
    spotLightFolder.add(this.spotLight, 'distance').min(0).max(20).step(0.001);

    spotLightFolder
      .add(this.spotLightHelper, 'visible')
      .name('Camera Helper Visible')
      .onChange((value: boolean) => {
        this.spotLightHelper.visible = value;
      });

    spotLightFolder.addColor(this.spotLight, 'color').name('Color');

    const ambientLightFolder = this.gui.addFolder('Ambient Light');
    ambientLightFolder
      .add(this.ambientLight, 'intensity')
      .min(0)
      .max(3)
      .step(0.001);
    ambientLightFolder.addColor(this.ambientLight, 'color').name('Color');

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

    directionalLightFolder
      .add(this.directionalLightCameraHelper, 'visible')
      .name('Camera Helper Visible')
      .onChange((value: boolean) => {
        this.directionalLightCameraHelper.visible = value;
      });
  }

  protected override update(): void {
    super.update();
  }

  protected override initControls(): void {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
  }
}
