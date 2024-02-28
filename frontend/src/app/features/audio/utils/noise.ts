import * as THREE from 'three';
import { ThreeSharedRenderer } from './render';
import { AudioAnalyzer } from './audio';
import { ThreePointLight } from './pointlight';
import { ThreePBR } from './pbr';
import { skyboxVert } from '../shaders/skybox.vert';
import { skyboxFrag } from '../shaders/skybox.frag';
import { blobVert } from '../shaders/blob.vert';
import { blobFrag } from '../shaders/blob.frag';

export class NoiseBlob {
  private isInit: boolean = false;
  public showHdr: boolean = true;

  private renderer: ThreeSharedRenderer = new ThreeSharedRenderer(true);
  private audioAnalyzer!: AudioAnalyzer;
  private light!: ThreePointLight;
  private pbr!: ThreePBR;

  private w!: number;
  private h!: number;

  private scene!: THREE.Scene;
  private shadowScene!: THREE.Scene;
  private timer: number = 0;

  private cubemap!: THREE.CubeTexture;
  private cubemapB!: THREE.CubeTexture;

  private shdrMesh!: THREE.ShaderMaterial;
  private shdrWire!: THREE.ShaderMaterial;
  private shdrPoints!: THREE.ShaderMaterial;
  private shdrShadow!: THREE.ShaderMaterial;
  private shdrPopPoints!: THREE.ShaderMaterial;
  private shdrPopWire!: THREE.ShaderMaterial;
  private shdrPopPointsOut!: THREE.ShaderMaterial;
  private shdrPopWireOut!: THREE.ShaderMaterial;
  private shdrCubemap!: THREE.ShaderMaterial;

  private texSprite!: THREE.Texture;

  constructor(
    _renderer: ThreeSharedRenderer,
    _audioAnalyzer: AudioAnalyzer,
    _light: ThreePointLight
  ) {
    this.renderer = _renderer;
    this.audioAnalyzer = _audioAnalyzer;
    this.light = _light;

    this.w = this.renderer.w;
    this.h = this.renderer.h;

    this.initShader();
    this.initScene();
    this.initCubemap();
    this.initTexture();
  }

  update(): void {
    const shaders = [
      this.shdrMesh,
      this.shdrWire,
      this.shdrPoints,
      this.shdrPopPoints,
      this.shdrPopWire,
      this.shdrPopPointsOut,
      this.shdrPopWireOut,
      this.shdrShadow,
    ];

    shaders.forEach((shader) => {
      shader.uniforms['u_is_init'].value = this.isInit;
      shader.uniforms['u_t'].value = this.timer;

      shader.uniforms['u_audio_high'].value = this.audioAnalyzer.getHigh();
      shader.uniforms['u_audio_mid'].value = this.audioAnalyzer.getMid();
      shader.uniforms['u_audio_bass'].value = this.audioAnalyzer.getBass();
      shader.uniforms['u_audio_level'].value = this.audioAnalyzer.getLevel();
      shader.uniforms['u_audio_history'].value =
        this.audioAnalyzer.getHistory();
    });

    this.updateCubemap();

    const cam = this.renderer.getCamera();
    this.renderer.renderer.render(this.scene, cam);

    if (!this.isInit) {
      this.isInit = true;
      console.log('NoiseBlob : is initiated');
    }

    this.timer = this.renderer.getTimer();
  }

  updateShadowMap(): void {
    const shadowCam = this.light.getLight();
    const shadowFbo = this.light.getShadowFrameBuffer();

    this.renderer.renderer.setRenderTarget(shadowFbo);
    this.renderer.renderer.render(this.shadowScene, shadowCam);

    let lightPos = this.light.getLightPosition();
    lightPos.applyMatrix4(this.renderer.matrix.modelViewMatrix);

    let shadowMatrix = new THREE.Matrix4();
    shadowMatrix.identity();
    shadowMatrix.multiplyMatrices(
      this.light.getLight().projectionMatrix,
      this.light.getLight().modelViewMatrix
    );

    this.shdrMesh.uniforms['u_light_pos'].value = lightPos;
    this.shdrMesh.uniforms['u_shadow_matrix'].value = shadowMatrix;
    this.shdrMesh.uniforms['u_shadow_map'].value = this.light.getShadowMap();
  }

  initTexture(): void {
    this.texSprite = new THREE.TextureLoader().load(
      'assets/images/audio/sprite_additive_rect.png',
      (texture) => {
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        texture.magFilter = THREE.LinearFilter;
        texture.minFilter = THREE.LinearFilter;
      }
    );
  }

  setRetina(): void {
    this.w *= 0.5;
    this.h *= 0.5;
  }

  initCubemap(): void {
    const path = 'assets/images/audio/';
    const format = '.jpg';
    let urls = [
      path + 'px_3js' + format,
      path + 'nx_3js' + format,
      path + 'py_3js' + format,
      path + 'ny_3js' + format,
      path + 'pz_3js' + format,
      path + 'nz_3js' + format,
    ];

    this.cubemap = new THREE.CubeTextureLoader().load(urls);
    this.cubemap.format = THREE.RGBAFormat;

    urls = [
      path + 'px' + format,
      path + 'nx' + format,
      path + 'py' + format,
      path + 'ny' + format,
      path + 'pz' + format,
      path + 'nz' + format,
    ];

    this.cubemapB = new THREE.CubeTextureLoader().load(urls);
    this.cubemapB.format = THREE.RGBAFormat;

    this.shdrMesh.uniforms['cubemap'] = { value: this.cubemap };
    this.shdrCubemap.uniforms['u_cubemap'] = { value: this.cubemap };
    this.shdrMesh.uniforms['cubemap_b'] = { value: this.cubemapB };
    this.shdrCubemap.uniforms['u_cubemap_b'] = { value: this.cubemapB };
    this.shdrCubemap.uniforms['u_show_cubemap'] = { value: this.showHdr };
    this.shdrMesh.defines = { ...this.shdrMesh.defines, HAS_CUBEMAP: 'true' };
  }

  toggleCubemap(): void {
    this.shdrCubemap.uniforms['u_show_cubemap'].value = this.showHdr;
  }

  updateCubemap(): void {
    let cross_fader = 0;

    this.shdrMesh.uniforms['u_cross_fader'].value = cross_fader;
    this.shdrCubemap.uniforms['u_cross_fader'].value = cross_fader;

    this.shdrCubemap.uniforms['u_exposure'].value = this.pbr.getExposure();
    this.shdrCubemap.uniforms['u_gamma'].value = this.pbr.getGamma();
  }

  setPBR(_pbr: ThreePBR): void {
    console.log('NoiseBlob', _pbr);

    this.pbr = _pbr;
    if (this.shdrMesh && this.shdrMesh.uniforms) {
      this.shdrMesh.uniforms['tex_normal'].value = this.pbr.getNormalMap();
      this.shdrMesh.uniforms['tex_roughness'].value =
        this.pbr.getRoughnessMap();
      this.shdrMesh.uniforms['tex_metallic'].value = this.pbr.getMetallicMap();

      this.shdrMesh.uniforms['u_normal'].value = this.pbr.getNormal();
      this.shdrMesh.uniforms['u_roughness'].value = this.pbr.getRoughness();
      this.shdrMesh.uniforms['u_metallic'].value = this.pbr.getMetallic();

      this.shdrMesh.uniforms['u_exposure'].value = this.pbr.getExposure();
      this.shdrMesh.uniforms['u_gamma'].value = this.pbr.getGamma();

      this.shdrMesh.uniforms['u_view_matrix_inverse'].value =
        this.renderer.getInversedMatrix();

      this.shdrMesh.defines = { IS_PBR: 'true' };
    }
  }

  updatePBR(): void {
    this.shdrMesh.uniforms['u_normal'].value = this.pbr.getNormal();
    this.shdrMesh.uniforms['u_roughness'].value = this.pbr.getRoughness();
    this.shdrMesh.uniforms['u_metallic'].value = this.pbr.getMetallic();

    this.shdrMesh.uniforms['u_exposure'].value = this.pbr.getExposure();
    this.shdrMesh.uniforms['u_gamma'].value = this.pbr.getGamma();

    this.shdrMesh.uniforms['u_view_matrix_inverse'].value =
      this.renderer.getInversedMatrix();
  }

  initScene(): void {
    let _sphere_size = 0.7;

    let _geom = new THREE.SphereGeometry(_sphere_size, 128, 128);
    let _geom_lowres = new THREE.SphereGeometry(_sphere_size, 64, 64);

    this.scene = new THREE.Scene();
    this.shadowScene = new THREE.Scene();

    const _mesh = new THREE.Mesh(_geom, this.shdrMesh);
    const _wire = new THREE.Line(_geom_lowres, this.shdrWire);

    const _points = new THREE.Points(_geom_lowres, this.shdrPoints);
    const _shadow_mesh = new THREE.Mesh(_geom, this.shdrShadow);

    const _pop_points = new THREE.Points(_geom_lowres, this.shdrPopPoints);
    const _pop_wire = new THREE.Line(_geom_lowres, this.shdrPopWire);

    const _pop_points_out = new THREE.Points(
      _geom_lowres,
      this.shdrPopPointsOut
    );
    const _pop_wire_out = new THREE.Line(_geom_lowres, this.shdrPopWireOut);

    this.scene.add(_mesh);
    this.scene.add(_wire);
    this.scene.add(_points);

    this.scene.add(_pop_points);
    this.scene.add(_pop_wire);
    this.scene.add(_pop_points_out);
    this.scene.add(_pop_wire_out);

    this.shadowScene.add(_shadow_mesh);

    let _geom_cube = new THREE.BoxGeometry(100, 100, 100);
    let _mesh_cube = new THREE.Mesh(_geom_cube, this.shdrCubemap);

    let mS = new THREE.Matrix4().identity();

    mS.elements[0] = -1;
    mS.elements[5] = -1;
    mS.elements[10] = -1;

    _geom_cube.applyMatrix4(mS);

    this.scene.add(_mesh_cube);
  }

  initShader(): void {
    let screen_res =
      'vec2( ' + this.w.toFixed(1) + ', ' + this.h.toFixed(1) + ')';

    const load = (_vert: string, _frag: string) => {
      return new THREE.ShaderMaterial({
        defines: {
          SCREEN_RES: screen_res,
        },
        uniforms: {
          u_t: { value: 0 },
          u_is_init: { value: false },
          u_audio_high: { value: 0 },
          u_audio_mid: { value: 0 },
          u_audio_bass: { value: 0 },
          u_audio_level: { value: 0 },
          u_audio_history: { value: 0 },
        },
        vertexShader: _vert,
        fragmentShader: _frag,
      });
    };

    this.shdrCubemap = new THREE.ShaderMaterial({
      defines: {
        SCREEN_RES: screen_res,
      },
      uniforms: {
        u_cubemap: { value: this.cubemap },
        u_cubemap_b: { value: this.cubemapB },
        u_exposure: { value: 2 },
        u_gamma: { value: 2.2 },
        u_cross_fader: { value: 2 },
      },
      vertexShader: skyboxVert,
      fragmentShader: skyboxFrag,
    });

    this.shdrMesh = load(blobVert, blobFrag);
    this.shdrWire = load(blobVert, blobFrag);
    this.shdrPoints = load(blobVert, blobFrag);
    this.shdrShadow = load(blobVert, blobFrag);
    this.shdrPopPoints = load(blobVert, blobFrag);
    this.shdrPopWire = load(blobVert, blobFrag);
    this.shdrPopPointsOut = load(blobVert, blobFrag);
    this.shdrPopWireOut = load(blobVert, blobFrag);

    this.shdrMesh.extensions.derivatives = true;


    this.shdrMesh = new THREE.ShaderMaterial({
      uniforms: {
          'tex_normal': { value: null },
          'tex_roughness': { value: null },
          'tex_metallic': { value: null },
          'u_normal': { value: null },
          'u_roughness': { value: null },
          'u_metallic': { value: null },
          'u_exposure': { value: null },
          'u_gamma': { value: null },
          'u_view_matrix_inverse': { value: null },
          'u_is_init': { value: false },
          'u_t': { value: 0 },
          'u_audio_high': { value: 0 },
          'u_audio_mid': { value: 0 },
          'u_audio_bass': { value:  0 },
          'u_audio_level': { value: 0 },
          'u_audio_history': { value: 0 },
          'u_light_pos': { value: null },
          'u_shadow_matrix': { value: null },
          'u_shadow_map': { value: null },
          'u_debug_shadow': { value: false },
          'u_cross_fader': { value: 0 },
      },
      vertexShader: blobVert,
      fragmentShader: blobFrag,
  });


    this.shdrMesh.defines = { IS_MESH: 'false' };
    this.shdrWire.defines = { HAS_SHADOW: 'true' };
    this.shdrWire.defines = { IS_WIRE: 'true' };
    this.shdrPoints.defines = { IS_POINTS: 'true' };
    this.shdrShadow.defines = { IS_SHADOW: 'true' };
    this.shdrPopPoints.defines = { IS_POINTS: 'true' };
    this.shdrPopPoints.defines = { IS_POP: 'true' };
    this.shdrPopWire.defines = { IS_WIRE: 'true' };
    this.shdrPopWire.defines = { IS_POP: 'true' };

    this.shdrPopPointsOut.defines = { IS_POINTS: 'true' };
    this.shdrPopPointsOut.defines = { IS_POP_OUT: 'true' };

    this.shdrPopWireOut.defines = { IS_WIRE: 'true' };
    this.shdrPopWireOut.defines = { IS_POP_OUT: 'true' };

    let _lightPos = this.light.getLightPosition();
    _lightPos.applyMatrix4(this.renderer.matrix.modelViewMatrix);

    let _shadowMatrix = new THREE.Matrix4();
    _shadowMatrix.identity();
    _shadowMatrix.multiplyMatrices(
      this.light.getLight().projectionMatrix,
      this.light.getLight().modelViewMatrix
    );

    this.shdrMesh.uniforms['u_light_pos'] = { value: _lightPos };
    this.shdrMesh.uniforms['u_shadow_matrix'] = { value: _shadowMatrix };
    this.shdrMesh.uniforms['u_shadow_map'] = {
      value: this.light.getShadowMap(),
    };
    this.shdrMesh.uniforms['u_debug_shadow'] = { value: false };

    this.shdrPoints.uniforms['tex_sprite'] = { value: this.texSprite };
    this.shdrPopPoints.uniforms['tex_sprite'] = { value: this.texSprite };
    this.shdrPopPointsOut.uniforms['tex_sprite'] = { value: this.texSprite };
    this.shdrPopWire.uniforms['tex_sprite'] = { value: this.texSprite };
    this.shdrPopWireOut.uniforms['tex_sprite'] = { value: this.texSprite };

    this.shdrPoints.blending = THREE.AdditiveBlending;
    this.shdrWire.blending = THREE.AdditiveBlending;
    this.shdrPopPoints.blending = THREE.AdditiveBlending;
    this.shdrPopWire.blending = THREE.AdditiveBlending;
    this.shdrPopPointsOut.blending = THREE.AdditiveBlending;
    this.shdrPopWireOut.blending = THREE.AdditiveBlending;

    this.shdrWire.transparent = true;
    this.shdrPoints.transparent = true;
    this.shdrPopPoints.transparent = true;
    this.shdrPopWire.transparent = true;
    this.shdrPopPointsOut.transparent = true;
    this.shdrPopWireOut.transparent = true;

    this.shdrWire.depthTest = false;
    this.shdrPoints.depthTest = false;
    this.shdrPopPoints.depthTest = false;
    this.shdrPopWire.depthTest = false;
    this.shdrPopPointsOut.depthTest = false;
    this.shdrPopWireOut.depthTest = false;
  }

  debugShadowMap(val: boolean): void {
    this.shdrMesh.uniforms['u_debug_shadow'].value = val;
  }
}
