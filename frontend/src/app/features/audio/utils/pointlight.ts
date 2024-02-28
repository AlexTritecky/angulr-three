import * as THREE from 'three';

export class ThreePointLight {
  shadowBuffer: THREE.WebGLRenderTarget;
  light: THREE.PerspectiveCamera;

  constructor() {
    this.shadowBuffer = new THREE.WebGLRenderTarget(2048, 2048);
    this.shadowBuffer.depthBuffer = true;
    this.shadowBuffer.depthTexture = new THREE.DepthTexture(2048, 2048);

    const ratio = this.shadowBuffer.width / this.shadowBuffer.height;
    this.light = new THREE.PerspectiveCamera(35, ratio, 0.1, 1000);
    this.light.position.set(3, 3, 3);
    this.light.lookAt(new THREE.Vector3(0, 0, 0));
  }

  ziggle(frame: number): void {
    const e = frame * 10;
    const nLoc = new THREE.Vector3(
      this.light.position.x * Math.sin(e),
      this.light.position.y,
      this.light.position.z * Math.cos(e)
    );

    this.light.position.copy(nLoc);
    this.light.lookAt(new THREE.Vector3(0, 0, 0));
    this.light.updateProjectionMatrix();
  }

  getLight(): THREE.PerspectiveCamera {
    return this.light;
  }

  getLightPosition(): THREE.Vector3 {
    return this.light.position;
  }

  getShadowFrameBuffer(): THREE.WebGLRenderTarget {
    return this.shadowBuffer;
  }

  getShadowMap(): THREE.Texture | null {
    return this.shadowBuffer.depthTexture;
  }

  setLightPosition(val: THREE.Vector3): void {
    this.light.position.copy(val);
    this.light.updateProjectionMatrix();
  }

  setLightLookAt(val: THREE.Vector3): void {
    this.light.lookAt(val); // Updated to use the correct method for setting lookAt
    this.light.updateProjectionMatrix();
  }
}
