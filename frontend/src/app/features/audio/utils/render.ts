import {
  ElementRef,
  Inject,
  Injectable,
  InjectionToken,
  OnDestroy,
} from '@angular/core';
import * as THREE from 'three';

export const PERSPECTIVE = new InjectionToken<boolean>('Perspective');

@Injectable({
  providedIn: 'root',
})
export class ThreeSharedRenderer implements OnDestroy {
  public w: number;
  public h: number;
  public matrix: THREE.PerspectiveCamera | THREE.OrthographicCamera;
  private orthoMatrix?: THREE.OrthographicCamera;
  public renderer!: THREE.WebGLRenderer;
  private isOrtho: boolean = false;
  private timer!: number;

  constructor(
    @Inject(PERSPECTIVE) public perspective: boolean,
    private canvas?: ElementRef<HTMLCanvasElement>
  ) {
    this.w = document.documentElement.clientWidth;
    this.h = document.documentElement.clientHeight;

    if (perspective) {
      this.matrix = new THREE.PerspectiveCamera(45, this.w / this.h, 0.1, 100);
    } else {
      this.matrix = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 1, 10);
    }
    this.matrix.position.z = 5;
    if (this.matrix instanceof THREE.PerspectiveCamera) {
      this.matrix.aspect = this.w / this.h;
      this.matrix.updateProjectionMatrix();
    }

    this.initRenderer();
    window.addEventListener('resize', this.resize.bind(this), false);
  }

  public initOrthoMatrix(): void {
    this.orthoMatrix = new THREE.OrthographicCamera(
      -0.5,
      0.5,
      0.5,
      -0.5,
      1,
      10
    );
    this.orthoMatrix.position.z = 5;
    this.orthoMatrix.updateProjectionMatrix();

    this.isOrtho = true;
  }

  public resize(): void {
    this.w = document.documentElement.clientWidth;
    this.h = document.documentElement.clientHeight;

    if (this.matrix instanceof THREE.PerspectiveCamera) {
      this.matrix.aspect = this.w / this.h;
      this.matrix.updateProjectionMatrix();
    }

    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.w, this.h);

    if (this.isOrtho && this.orthoMatrix instanceof THREE.OrthographicCamera) {
      this.orthoMatrix.updateProjectionMatrix();
    }
  }

  disableDepth(): void {
    this.renderer.getContext().disable(this.renderer.getContext().DEPTH_TEST);
  }

  public initRenderer(): void {
    if (this.canvas && this.canvas.nativeElement) {
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas.nativeElement,
        alpha: true, // Consider setting alpha if you need transparency.
        antialias: true, // Consider setting antialias for smoother edges.
      });

      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(this.w, this.h);
      this.renderer.autoClear = false;
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFShadowMap;
    }

    console.log(
      'ThreeSharedRenderer: renderer is set with',
      this.w,
      'by',
      this.h
    );
  }

  render(queue: Array<() => void>): void {
    const size = queue.length;

    for (let i = 0; i < size; i++) {
      this.renderer.clearDepth();
      queue[i]();
    }

    this.timer += 0.001;

    if (this.timer > 999999) {
      this.timer = 0;
    }
  }

  ziggleCam(frame: number): void {
    const e = frame;
    const nLoc = new THREE.Vector3(
      Math.sin(e),
      Math.cos(e * 0.9) * Math.sin(e * 0.7),
      Math.cos(e)
    ).normalize();
    nLoc.multiplyScalar(8 + 2 * Math.sin(2 * e));

    const nCenter = new THREE.Vector3(
      Math.sin(0.6 * e),
      0,
      Math.cos(0.4 * e)
    ).normalize();
    nCenter.multiplyScalar(0.3);

    // Assuming this.matrix is a camera object
    if (
      this.matrix instanceof THREE.PerspectiveCamera ||
      this.matrix instanceof THREE.OrthographicCamera
    ) {
      this.matrix.position.copy(nLoc);
      this.matrix.lookAt(nCenter);

      this.matrix.updateProjectionMatrix();
    }
  }

  public getInversedMatrix(): THREE.Matrix4 | undefined {
    if (
      this.matrix instanceof THREE.PerspectiveCamera ||
      this.matrix instanceof THREE.OrthographicCamera
    ) {
      return this.matrix.matrixWorldInverse;
    }
    return undefined;
  }

  public getCamera(): THREE.PerspectiveCamera | THREE.OrthographicCamera {
    return this.matrix;
  }

  public getOrtho(): THREE.OrthographicCamera | undefined {
    return this.isOrtho ? this.orthoMatrix : undefined;
  }

  public getMatrix(): THREE.Matrix4 {
    return this.matrix.matrix;
  }

  public getTimer(): number {
    return this.timer ?? 0;
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.resize.bind(this));
  }
}
