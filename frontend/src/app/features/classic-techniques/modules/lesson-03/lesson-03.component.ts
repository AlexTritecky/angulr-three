import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  HostListener,
  ViewChild,
} from '@angular/core';

import * as THREE from 'three';
import GUI from 'lil-gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

@Component({
  selector: 'app-lesson-03',
  templateUrl: './lesson-03.component.html',
  styleUrl: './lesson-03.component.scss',
})
export class Lesson03Component implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  private renderer!: THREE.WebGLRenderer;
  private camera!: THREE.PerspectiveCamera;
  private scene!: THREE.Scene;
  private fog!: THREE.Fog;
  private textureLoader!: THREE.TextureLoader;
  private gui!: GUI;
  private controls!: OrbitControls;
  private clock = new THREE.Clock();

  private door!: THREE.Mesh;
  private roof!: THREE.Mesh;
  private walls!: THREE.Mesh;
  private floor!: THREE.Mesh;

  private bush1!: THREE.Mesh;
  private bush2!: THREE.Mesh;
  private bush3!: THREE.Mesh;
  private bush4!: THREE.Mesh;

  private frameId: number | null = null;

  // Door textures
  private doorColorTexture!: THREE.Texture;
  private doorAlphaTexture!: THREE.Texture;
  private doorAmbientOcclusionTexture!: THREE.Texture;
  private doorHeightTexture!: THREE.Texture;
  private doorMetalnessTexture!: THREE.Texture;
  private doorNormalTexture!: THREE.Texture;
  private doorRoughnessTexture!: THREE.Texture;
  // Brick textures
  private bricksColorTexture!: THREE.Texture;
  private bricksAmbientOcclusionTexture!: THREE.Texture;
  private bricksNormalTexture!: THREE.Texture;
  private bricksRoughnessTexture!: THREE.Texture;

  // Grass textures
  private grassColorTexture!: THREE.Texture;
  private grassAmbientOcclusionTexture!: THREE.Texture;
  private grassNormalTexture!: THREE.Texture;
  private grassRoughnessTexture!: THREE.Texture;

  // Groups
  private houseGroup!: THREE.Group;
  private gravesGroup!: THREE.Group;

  // Lights
  private ambientLight!: THREE.AmbientLight;
  private moonLight!: THREE.DirectionalLight;
  private doorLight!: THREE.PointLight;
  private ghost1!: THREE.PointLight;
  private ghost2!: THREE.PointLight;
  private ghost3!: THREE.PointLight;

  constructor() {}

  @HostListener('window:resize', ['$event'])
  onResize(event?: Event): void {
    this.updateCameraAspectRatio();
    this.updateRendererSize();
  }

  ngAfterViewInit(): void {
    this.initThree();
    this.initTextures();
    this.initObjects();
    this.initLight();

    this.animate();
    this.setupGui();
  }

  ngOnDestroy(): void {
    if (this.frameId != null) {
      cancelAnimationFrame(this.frameId);
    }
    this.renderer.dispose();
  }

  private initThree(): void {
    const canvas = this.canvasRef.nativeElement;

    this.scene = new THREE.Scene();
    this.fog = new THREE.Fog('#263537', 1, 15);
    this.scene.fog = this.fog;

    this.initializeCamera();

    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
    });
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setClearColor('#263537');
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.textureLoader = new THREE.TextureLoader();
    this.updateRendererSize();
    this.initializeOrbitControls();
  }

  private initTextures(): void {
    this.initDoorTextures();
    this.initBrickTextures();
    this.initGrassTextures();
  }

  private initObjects(): void {
    this.initHouseGroup();
    this.initGravesGroup();
    this.initFloor();
    this.initBrushes();
  }

  private initializeCamera(): void {
    const parentWidth =
      this.canvasRef.nativeElement.parentElement?.clientWidth ||
      window.innerWidth;
    const parentHeight =
      this.canvasRef.nativeElement.parentElement?.clientHeight ||
      window.innerHeight;

    const aspectRatio = parentWidth / parentHeight;
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    this.camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      100
    );
    this.camera.position.x = 4;
    this.camera.position.y = 2;
    this.camera.position.z = 5;
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

  private initLight(): void {
    this.ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12);
    this.scene.add(this.ambientLight);

    this.moonLight = new THREE.DirectionalLight('#b9d5ff', 0.12);
    this.moonLight.position.set(4, 5, -2);
    this.scene.add(this.moonLight);

    this.doorLight = new THREE.PointLight('#ff7d46', 3, 7);
    this.doorLight.position.set(0, 2.2, 2.7);
    this.houseGroup.add(this.doorLight);

    this.ghost1 = new THREE.PointLight('#00f2ff', 6, 3);
    this.ghost2 = new THREE.PointLight('#00ffff', 6, 3);
    this.ghost3 = new THREE.PointLight('#ffff00', 6, 3);

    this.scene.add(this.ghost1);
    this.scene.add(this.ghost2);
    this.scene.add(this.ghost3);

    this.moonLight.castShadow = true;
    this.doorLight.castShadow = true;
    this.ghost1.castShadow = true;
    this.ghost2.castShadow = true;
    this.ghost3.castShadow = true;

    this.walls.castShadow = true;

    this.bush1.castShadow = true;
    this.bush2.castShadow = true;
    this.bush3.castShadow = true;
    this.bush4.castShadow = true;

    this.floor.receiveShadow = true;

    this.moonLight.shadow.mapSize.width = 256;
    this.moonLight.shadow.mapSize.height = 256;
    this.moonLight.shadow.camera.far = 7;

    this.doorLight.shadow.mapSize.width = 256;
    this.doorLight.shadow.mapSize.height = 256;
    this.doorLight.shadow.camera.far = 7;

    this.ghost1.shadow.mapSize.width = 256;
    this.ghost1.shadow.mapSize.height = 256;
    this.ghost1.shadow.camera.far = 7;

    this.ghost2.shadow.mapSize.width = 256;
    this.ghost2.shadow.mapSize.height = 256;
    this.ghost2.shadow.camera.far = 7;

    this.ghost3.shadow.mapSize.width = 256;
    this.ghost3.shadow.mapSize.height = 256;
    this.ghost3.shadow.camera.far = 7;
  }

  private animate(): void {
    this.frameId = requestAnimationFrame(this.animate.bind(this));

    const elapsedTime = this.clock.getElapsedTime();

    const ghost1Angle = elapsedTime * 0.5;
    this.ghost1.position.x = Math.cos(ghost1Angle) * 4;
    this.ghost1.position.z = Math.sin(ghost1Angle) * 4;
    this.ghost1.position.y = Math.sin(elapsedTime * 3);

    const ghost2Angle = -elapsedTime * 0.32;

    this.ghost2.position.x = Math.cos(ghost2Angle) * 5;
    this.ghost2.position.z = Math.sin(ghost2Angle) * 5;
    this.ghost2.position.y =
      Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);

    const ghost3Angle = -elapsedTime * 0.18;

    this.ghost3.position.x =
      Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32));
    this.ghost3.position.z =
      Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5));
    this.ghost3.position.y =
      Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);

    this.controls.update();

    this.renderer.render(this.scene, this.camera);
  }

  private setupGui(): void {
    this.gui = new GUI();

    this.gui.add(this.ambientLight, 'intensity').min(0).max(1).step(0.001);

    this.gui.add(this.moonLight, 'intensity').min(0).max(1).step(0.001);
    this.gui.add(this.moonLight.position, 'x').min(-5).max(5).step(0.001);
    this.gui.add(this.moonLight.position, 'y').min(-5).max(5).step(0.001);
    this.gui.add(this.moonLight.position, 'z').min(-5).max(5).step(0.001);
  }

  private initHouseGroup(): void {
    this.houseGroup = new THREE.Group();
    this.scene.add(this.houseGroup);

    this.walls = new THREE.Mesh(
      new THREE.BoxGeometry(4, 2.5, 4),
      new THREE.MeshStandardMaterial({
        map: this.bricksColorTexture,
        aoMap: this.bricksAmbientOcclusionTexture,
        normalMap: this.bricksNormalTexture,
        roughnessMap: this.bricksRoughnessTexture,
      })
    );
    this.walls.position.y = 2.5 / 2;
    this.houseGroup.add(this.walls);

    this.roof = new THREE.Mesh(
      new THREE.ConeGeometry(3.5, 1, 4),
      new THREE.MeshStandardMaterial({ color: '#b35f45' })
    );

    this.roof.rotation.y = Math.PI * 0.25;
    this.roof.position.y = 5 / 2 + 1 / 2 + 0.01;
    this.houseGroup.add(this.roof);

    this.door = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2, 100, 100),

      new THREE.MeshStandardMaterial({
        map: this.doorColorTexture,
        transparent: true,
        alphaMap: this.doorAlphaTexture,
        aoMap: this.doorAmbientOcclusionTexture,
        displacementMap: this.doorHeightTexture,
        displacementScale: 0.1,
        metalnessMap: this.doorMetalnessTexture,
        normalMap: this.doorNormalTexture,
        roughnessMap: this.doorRoughnessTexture,
      })
    );

    this.door.position.z = 4 / 2 + 0.01;
    this.door.position.y = 1;

    this.houseGroup.add(this.door);
  }

  private initGravesGroup(): void {
    this.gravesGroup = new THREE.Group();
    this.scene.add(this.gravesGroup);

    const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
    const graveMaterial = new THREE.MeshStandardMaterial({ color: '#b2b6b1' });

    for (let i = 0; i < 50; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 3 + Math.random() * 6;
      const x = Math.sin(angle) * radius;
      const z = Math.cos(angle) * radius;
      const y = Math.random() - 0.5;

      const grave = new THREE.Mesh(graveGeometry, graveMaterial);
      grave.position.set(x, y, z);
      grave.rotation.z = (Math.random() - 0.5) * 0.4;
      grave.rotation.y = (Math.random() - 0.5) * 0.4;
      grave.castShadow = true;
      this.gravesGroup.add(grave);
    }
  }

  private initFloor(): void {
    this.floor = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 20),
      new THREE.MeshStandardMaterial({
        map: this.grassColorTexture,
        aoMap: this.grassAmbientOcclusionTexture,
        normalMap: this.grassNormalTexture,
        roughnessMap: this.grassRoughnessTexture,
      })
    );

    this.floor.rotation.x = -Math.PI * 0.5;
    this.floor.position.y = 0;

    this.scene.add(this.floor);
  }

  // Helpers
  private initDoorTextures(): void {
    this.doorColorTexture = this.textureLoader.load(
      '/assets/images/door/color.jpg'
    );

    this.doorAlphaTexture = this.textureLoader.load(
      '/assets/images/door/alpha.jpg'
    );

    this.doorAmbientOcclusionTexture = this.textureLoader.load(
      '/assets/images/door/ambientOcclusion.jpg'
    );

    this.doorHeightTexture = this.textureLoader.load(
      '/assets/images/door/height.jpg'
    );

    this.doorMetalnessTexture = this.textureLoader.load(
      '/assets/images/door/metalness.jpg'
    );

    this.doorNormalTexture = this.textureLoader.load(
      '/assets/images/door/normal.jpg'
    );

    this.doorRoughnessTexture = this.textureLoader.load(
      '/assets/images/door/roughness.jpg'
    );
  }

  private initBrickTextures(): void {
    this.bricksColorTexture = this.textureLoader.load(
      '/assets/images/bricks/color.jpg'
    );

    this.bricksAmbientOcclusionTexture = this.textureLoader.load(
      '/assets/images/bricks/ambientOcclusion.jpg'
    );

    this.bricksNormalTexture = this.textureLoader.load(
      '/assets/images/bricks/normal.jpg'
    );

    this.bricksRoughnessTexture = this.textureLoader.load(
      '/assets/images/bricks/roughness.jpg'
    );
  }

  private initGrassTextures(): void {
    this.grassColorTexture = this.textureLoader.load(
      '/assets/images/grass/color.jpg'
    );

    this.grassAmbientOcclusionTexture = this.textureLoader.load(
      '/assets/images/grass/ambientOcclusion.jpg'
    );

    this.grassNormalTexture = this.textureLoader.load(
      '/assets/images/grass/normal.jpg'
    );

    this.grassRoughnessTexture = this.textureLoader.load(
      '/assets/images/grass/roughness.jpg'
    );

    this.grassColorTexture.repeat.set(8, 8);
    this.grassAmbientOcclusionTexture.repeat.set(8, 8);
    this.grassNormalTexture.repeat.set(8, 8);
    this.grassRoughnessTexture.repeat.set(8, 8);

    this.grassColorTexture.wrapS = THREE.RepeatWrapping;
    this.grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
    this.grassNormalTexture.wrapS = THREE.RepeatWrapping;
    this.grassRoughnessTexture.wrapS = THREE.RepeatWrapping;

    this.grassColorTexture.wrapT = THREE.RepeatWrapping;
    this.grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;
    this.grassNormalTexture.wrapT = THREE.RepeatWrapping;
    this.grassRoughnessTexture.wrapT = THREE.RepeatWrapping;
  }

  private initializeOrbitControls(): void {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.update();
  }

  private initBrushes(): void {
    const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
    const bushMaterial = new THREE.MeshStandardMaterial({ color: '#89c854' });

    this.bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
    this.bush1.scale.set(0.5, 0.5, 0.5);
    this.bush1.position.set(0.8, 0.2, 2.2);

    this.bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
    this.bush2.scale.set(0.25, 0.25, 0.25);
    this.bush2.position.set(1.4, 0.1, 2.1);

    this.bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
    this.bush3.scale.set(0.4, 0.4, 0.4);
    this.bush3.position.set(-0.8, 0.1, 2.2);

    this.bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
    this.bush4.scale.set(0.15, 0.15, 0.15);
    this.bush4.position.set(-1, 0.05, 2.6);

    this.houseGroup.add(this.bush1, this.bush2, this.bush3, this.bush4);
  }
}
