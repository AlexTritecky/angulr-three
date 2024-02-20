import {
  ElementRef,
  HostListener,
  OnDestroy,
  AfterViewInit,
  Injectable,
} from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

@Injectable()
export abstract class BaseThreeComponent implements AfterViewInit, OnDestroy {
  protected canvasRef!: ElementRef<HTMLCanvasElement>;
  protected scene!: THREE.Scene;
  protected camera!: THREE.PerspectiveCamera;
  protected renderer!: THREE.WebGLRenderer;
  protected controls!: OrbitControls;
  private frameId!: number;

  constructor() {}

  ngAfterViewInit(): void {
    this.initTHREE();
    this.initScene();
    this.initCamera();
    this.initRenderer();
    this.initControls();
    this.addObjects();
    this.animate();
  }

  ngOnDestroy(): void {
    if (this.frameId) {
      cancelAnimationFrame(this.frameId);
    }
    this.renderer.domElement.removeEventListener('resize', this.onResize);
  }

  protected initTHREE(): void {
    this.scene = new THREE.Scene();
    this.initCamera();
    this.initRenderer();
    this.initControls();

    window.addEventListener('resize', this.onResize);
  }

  protected onResize = (): void => {
    const width = this.canvasRef.nativeElement.clientWidth;
    const height = this.canvasRef.nativeElement.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  protected abstract initScene(): void;
  protected abstract initCamera(): void;
  protected abstract initRenderer(): void;
  protected abstract initControls(): void;
  protected abstract addObjects(): void;

  protected animate = (): void => {
    this.frameId = requestAnimationFrame(this.animate);
    this.update();
    this.renderer.render(this.scene, this.camera);
  };

  protected update(): void {
    if (this.controls) {
      this.controls.update();
    }
  }
}
