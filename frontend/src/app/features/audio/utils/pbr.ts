import * as THREE from 'three';

export class ThreePBR {
  normalMap: THREE.Texture;
  roughnessMap: THREE.Texture;
  metallicMap: THREE.Texture;
  normal: number;
  roughness: number;
  metallic: number;
  exposure: number;
  gamma: number;

  constructor() {
    this.normalMap = new THREE.TextureLoader().load('assets/images/audio/normal.jpg');
    this.configureTexture(this.normalMap);

    this.roughnessMap = new THREE.TextureLoader().load('assets/images/audio/roughness.jpg');
    this.configureTexture(this.roughnessMap);

    this.metallicMap = new THREE.TextureLoader().load('assets/images/audio/metallic.jpg');
    this.configureTexture(this.metallicMap);

    this.normal = 1.0;
    this.roughness = 0.0;
    this.metallic = 1.0;
    this.exposure = 2.0;
    this.gamma = 2.2;
  }

  private configureTexture(texture: THREE.Texture): void {
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.magFilter = THREE.LinearFilter;
    texture.minFilter = THREE.LinearFilter;
  }

  getNormalMap(): THREE.Texture {
    return this.normalMap;
  }

  getRoughnessMap(): THREE.Texture {
    return this.roughnessMap;
  }

  getMetallicMap(): THREE.Texture {
    return this.metallicMap;
  }

  getNormal(): number {
    return this.normal;
  }

  getRoughness(): number {
    return this.roughness;
  }

  getMetallic(): number {
    return this.metallic;
  }

  getExposure(): number {
    return this.exposure;
  }

  getGamma(): number {
    return this.gamma;
  }
}
