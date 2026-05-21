"use client";

import { BloomEffect, EffectComposer, EffectPass, RenderPass, SMAAEffect, SMAAPreset } from 'postprocessing';
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useSectionVisible } from '@/lib/useSectionVisible';
import { scrollToSectionId } from '@/lib/navScroll';

// ==========================================
// 1. HYPERSPEED COMPONENT BACKGROUND
// ==========================================

const DEFAULT_EFFECT_OPTIONS = {
  onSpeedUp: () => {},
  onSlowDown: () => {},
  distortion: 'turbulentDistortionStill',
  length: 400,
  roadWidth: 10,
  islandWidth: 2,
  lanesPerRoad: 4,
  fov: 90,
  fovSpeedUp: 150,
  speedUp: 2,
  carLightsFade: 0.4,
  totalSideLightSticks: 20,
  lightPairsPerRoadWay: 40,
  shoulderLinesWidthPercentage: 0.05,
  brokenLinesWidthPercentage: 0.1,
  brokenLinesLengthPercentage: 0.5,
  lightStickWidth: [0.12, 0.5],
  lightStickHeight: [1.3, 1.7],
  movingAwaySpeed: [60, 80],
  movingCloserSpeed: [-120, -160],
  carLightsLength: [400 * 0.03, 400 * 0.2],
  carLightsRadius: [0.05, 0.14],
  carWidthPercentage: [0.3, 0.5],
  carShiftX: [-0.8, 0.8],
  carFloorSeparation: [0, 5],
  colors: {
    roadColor: 0x080808,
    islandColor: 0x0a0a0a,
    background: 0x000000,
    shoulderLines: 0xffffff,
    brokenLines: 0xffffff,
    leftCars: [0xd856bf, 0x6750a2, 0xc247ac],
    rightCars: [0x03b3c3, 0x0e5ea5, 0x324555],
    sticks: 0x03b3c3
  }
};

export const Hyperspeed = ({ effectOptions = DEFAULT_EFFECT_OPTIONS }) => {
  const hyperspeed = useRef(null);
  const appRef = useRef(null);

  useEffect(() => {
    if (appRef.current) {
      appRef.current.dispose();
      appRef.current = null;
      const container = hyperspeed.current;
      if (container) {
        while (container.firstChild) {
          container.removeChild(container.firstChild);
        }
      }
    }

    const mountainUniforms = {
      uFreq: { value: new THREE.Vector3(3, 6, 10) },
      uAmp: { value: new THREE.Vector3(30, 30, 20) }
    };

    const xyUniforms = {
      uFreq: { value: new THREE.Vector2(5, 2) },
      uAmp: { value: new THREE.Vector2(25, 15) }
    };

    const LongRaceUniforms = {
      uFreq: { value: new THREE.Vector2(2, 3) },
      uAmp: { value: new THREE.Vector2(35, 10) }
    };

    const turbulentUniforms = {
      uFreq: { value: new THREE.Vector4(4, 8, 8, 1) },
      uAmp: { value: new THREE.Vector4(25, 5, 10, 10) }
    };

    const deepUniforms = {
      uFreq: { value: new THREE.Vector2(4, 8) },
      uAmp: { value: new THREE.Vector2(10, 20) },
      uPowY: { value: new THREE.Vector2(20, 2) }
    };

    let nsin = val => Math.sin(val) * 0.5 + 0.5;

    const distortions = {
      mountainDistortion: {
        uniforms: mountainUniforms,
        getDistortion: `
          uniform vec3 uAmp;
          uniform vec3 uFreq;
          #define PI 3.14159265358979
          float nsin(float val){
            return sin(val) * 0.5 + 0.5;
          }
          vec3 getDistortion(float progress){
            float movementProgressFix = 0.02;
            return vec3( 
              cos(progress * PI * uFreq.x + uTime) * uAmp.x - cos(movementProgressFix * PI * uFreq.x + uTime) * uAmp.x,
              nsin(progress * PI * uFreq.y + uTime) * uAmp.y - nsin(movementProgressFix * PI * uFreq.y + uTime) * uAmp.y,
              nsin(progress * PI * uFreq.z + uTime) * uAmp.z - nsin(movementProgressFix * PI * uFreq.z + uTime) * uAmp.z
            );
          }
        `,
        getJS: (progress, time) => {
          let movementProgressFix = 0.02;
          let uFreq = mountainUniforms.uFreq.value;
          let uAmp = mountainUniforms.uAmp.value;
          let distortion = new THREE.Vector3(
            Math.cos(progress * Math.PI * uFreq.x + time) * uAmp.x -
              Math.cos(movementProgressFix * Math.PI * uFreq.x + time) * uAmp.x,
            nsin(progress * Math.PI * uFreq.y + time) * uAmp.y -
              nsin(movementProgressFix * Math.PI * uFreq.y + time) * uAmp.y,
            nsin(progress * Math.PI * uFreq.z + time) * uAmp.z -
              nsin(movementProgressFix * Math.PI * uFreq.z + time) * uAmp.z
          );
          let lookAtAmp = new THREE.Vector3(2, 2, 2);
          let lookAtOffset = new THREE.Vector3(0, 0, -5);
          return distortion.multiply(lookAtAmp).add(lookAtOffset);
        }
      },
      xyDistortion: {
        uniforms: xyUniforms,
        getDistortion: `
          uniform vec2 uFreq;
          uniform vec2 uAmp;
          #define PI 3.14159265358979
          vec3 getDistortion(float progress){
            float movementProgressFix = 0.02;
            return vec3( 
              cos(progress * PI * uFreq.x + uTime) * uAmp.x - cos(movementProgressFix * PI * uFreq.x + uTime) * uAmp.x,
              sin(progress * PI * uFreq.y + PI/2. + uTime) * uAmp.y - sin(movementProgressFix * PI * uFreq.y + PI/2. + uTime) * uAmp.y,
              0.
            );
          }
        `,
        getJS: (progress, time) => {
          let movementProgressFix = 0.02;
          let uFreq = xyUniforms.uFreq.value;
          let uAmp = xyUniforms.uAmp.value;
          let distortion = new THREE.Vector3(
            Math.cos(progress * Math.PI * uFreq.x + time) * uAmp.x -
              Math.cos(movementProgressFix * Math.PI * uFreq.x + time) * uAmp.x,
            Math.sin(progress * Math.PI * uFreq.y + time + Math.PI / 2) * uAmp.y -
              Math.sin(movementProgressFix * Math.PI * uFreq.y + time + Math.PI / 2) * uAmp.y,
            0
          );
          let lookAtAmp = new THREE.Vector3(2, 0.4, 1);
          let lookAtOffset = new THREE.Vector3(0, 0, -3);
          return distortion.multiply(lookAtAmp).add(lookAtOffset);
        }
      },
      LongRaceDistortion: {
        uniforms: LongRaceUniforms,
        getDistortion: `
          uniform vec2 uFreq;
          uniform vec2 uAmp;
          #define PI 3.14159265358979
          vec3 getDistortion(float progress){
            float camProgress = 0.0125;
            return vec3( 
              sin(progress * PI * uFreq.x + uTime) * uAmp.x - sin(camProgress * PI * uFreq.x + uTime) * uAmp.x,
              sin(progress * PI * uFreq.y + uTime) * uAmp.y - sin(camProgress * PI * uFreq.y + uTime) * uAmp.y,
              0.
            );
          }
        `,
        getJS: (progress, time) => {
          let camProgress = 0.0125;
          let uFreq = LongRaceUniforms.uFreq.value;
          let uAmp = LongRaceUniforms.uAmp.value;
          let distortion = new THREE.Vector3(
            Math.sin(progress * Math.PI * uFreq.x + time) * uAmp.x -
              Math.sin(camProgress * Math.PI * uFreq.x + time) * uAmp.x,
            Math.sin(progress * Math.PI * uFreq.y + time) * uAmp.y -
              Math.sin(camProgress * Math.PI * uFreq.y + time) * uAmp.y,
            0
          );
          let lookAtAmp = new THREE.Vector3(1, 1, 0);
          let lookAtOffset = new THREE.Vector3(0, 0, -5);
          return distortion.multiply(lookAtAmp).add(lookAtOffset);
        }
      },
      turbulentDistortion: {
        uniforms: turbulentUniforms,
        getDistortion: `
          uniform vec4 uFreq;
          uniform vec4 uAmp;
          float nsin(float val){
            return sin(val) * 0.5 + 0.5;
          }
          #define PI 3.14159265358979
          float getDistortionX(float progress){
            return (
              cos(PI * progress * uFreq.r + uTime) * uAmp.r +
              pow(cos(PI * progress * uFreq.g + uTime * (uFreq.g / uFreq.r)), 2. ) * uAmp.g
            );
          }
          float getDistortionY(float progress){
            return (
              -nsin(PI * progress * uFreq.b + uTime) * uAmp.b +
              -pow(nsin(PI * progress * uFreq.a + uTime / (uFreq.b / uFreq.a)), 5.) * uAmp.a
            );
          }
          vec3 getDistortion(float progress){
            return vec3(
              getDistortionX(progress) - getDistortionX(0.0125),
              getDistortionY(progress) - getDistortionY(0.0125),
              0.
            );
          }
        `,
        getJS: (progress, time) => {
          const uFreq = turbulentUniforms.uFreq.value;
          const uAmp = turbulentUniforms.uAmp.value;

          const getX = p =>
            Math.cos(Math.PI * p * uFreq.x + time) * uAmp.x +
            Math.pow(Math.cos(Math.PI * p * uFreq.y + time * (uFreq.y / uFreq.x)), 2) * uAmp.y;

          const getY = p =>
            -nsin(Math.PI * p * uFreq.z + time) * uAmp.z -
            Math.pow(nsin(Math.PI * p * uFreq.w + time / (uFreq.z / uFreq.w)), 5) * uAmp.w;

          let distortion = new THREE.Vector3(
            getX(progress) - getX(progress + 0.007),
            getY(progress) - getY(progress + 0.007),
            0
          );
          let lookAtAmp = new THREE.Vector3(-2, -5, 0);
          let lookAtOffset = new THREE.Vector3(0, 0, -10);
          return distortion.multiply(lookAtAmp).add(lookAtOffset);
        }
      },
      turbulentDistortionStill: {
        uniforms: turbulentUniforms,
        getDistortion: `
          uniform vec4 uFreq;
          uniform vec4 uAmp;
          float nsin(float val){
            return sin(val) * 0.5 + 0.5;
          }
          #define PI 3.14159265358979
          float getDistortionX(float progress){
            return (
              cos(PI * progress * uFreq.r) * uAmp.r +
              pow(cos(PI * progress * uFreq.g * (uFreq.g / uFreq.r)), 2. ) * uAmp.g
            );
          }
          float getDistortionY(float progress){
            return (
              -nsin(PI * progress * uFreq.b) * uAmp.b +
              -pow(nsin(PI * progress * uFreq.a / (uFreq.b / uFreq.a)), 5.) * uAmp.a
            );
          }
          vec3 getDistortion(float progress){
            return vec3(
              getDistortionX(progress) - getDistortionX(0.02),
              getDistortionY(progress) - getDistortionY(0.02),
              0.
            );
          }
        `
      },
      deepDistortionStill: {
        uniforms: deepUniforms,
        getDistortion: `
          uniform vec4 uFreq;
          uniform vec4 uAmp;
          uniform vec2 uPowY;
          float nsin(float val){
            return sin(val) * 0.5 + 0.5;
          }
          #define PI 3.14159265358979
          float getDistortionX(float progress){
            return (
              sin(progress * PI * uFreq.x) * uAmp.x * 2.
            );
          }
          float getDistortionY(float progress){
            return (
              pow(abs(progress * uPowY.x), uPowY.y) + sin(progress * PI * uFreq.y) * uAmp.y
            );
          }
          vec3 getDistortion(float progress){
            return vec3(
              getDistortionX(progress) - getDistortionX(0.02),
              getDistortionY(progress) - getDistortionY(0.05),
              0.
            );
          }
        `
      },
      deepDistortion: {
        uniforms: deepUniforms,
        getDistortion: `
          uniform vec4 uFreq;
          uniform vec4 uAmp;
          uniform vec2 uPowY;
          float nsin(float val){
            return sin(val) * 0.5 + 0.5;
          }
          #define PI 3.14159265358979
          float getDistortionX(float progress){
            return (
              sin(progress * PI * uFreq.x + uTime) * uAmp.x
            );
          }
          float getDistortionY(float progress){
            return (
              pow(abs(progress * uPowY.x), uPowY.y) + sin(progress * PI * uFreq.y + uTime) * uAmp.y
            );
          }
          vec3 getDistortion(float progress){
            return vec3(
              getDistortionX(progress) - getDistortionX(0.02),
              getDistortionY(progress) - getDistortionY(0.02),
              0.
            );
          }
        `,
        getJS: (progress, time) => {
          const uFreq = deepUniforms.uFreq.value;
          const uAmp = deepUniforms.uAmp.value;
          const uPowY = deepUniforms.uPowY.value;

          const getX = p => Math.sin(p * Math.PI * uFreq.x + time) * uAmp.x;
          const getY = p => Math.pow(p * uPowY.x, uPowY.y) + Math.sin(p * Math.PI * uFreq.y + time) * uAmp.y;

          let distortion = new THREE.Vector3(
            getX(progress) - getX(progress + 0.01),
            getY(progress) - getY(progress + 0.01),
            0
          );
          let lookAtAmp = new THREE.Vector3(-2, -4, 0);
          let lookAtOffset = new THREE.Vector3(0, 0, -10);
          return distortion.multiply(lookAtAmp).add(lookAtOffset);
        }
      }
    };

    class App {
      constructor(container, options = {}) {
        this.options = options;
        if (this.options.distortion == null) {
          this.options.distortion = {
            uniforms: distortion_uniforms,
            getDistortion: distortion_vertex
          };
        }
        this.container = container;
        this.hasValidSize = false;

        const initW = Math.max(1, container.offsetWidth);
        const initH = Math.max(1, container.offsetHeight);

        this.renderer = new THREE.WebGLRenderer({
          antialias: false,
          alpha: true
        });
        this.renderer.setSize(initW, initH, false);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
        this.composer = new EffectComposer(this.renderer);
        container.append(this.renderer.domElement);

        this.camera = new THREE.PerspectiveCamera(options.fov, initW / initH, 0.1, 10000);
        this.camera.position.z = -5;
        this.camera.position.y = 8;
        this.camera.position.x = 0;
        this.scene = new THREE.Scene();
        this.scene.background = null;

        let fog = new THREE.Fog(options.colors.background, options.length * 0.2, options.length * 500);
        this.scene.fog = fog;
        this.fogUniforms = {
          fogColor: { value: fog.color },
          fogNear: { value: fog.near },
          fogFar: { value: fog.far }
        };
        this.clock = new THREE.Clock();
        this.assets = {};
        this.disposed = false;

        this.road = new Road(this, options);
        this.leftCarLights = new CarLights(
          this,
          options,
          options.colors.leftCars,
          options.movingAwaySpeed,
          new THREE.Vector2(0, 1 - options.carLightsFade)
        );
        this.rightCarLights = new CarLights(
          this,
          options,
          options.colors.rightCars,
          options.movingCloserSpeed,
          new THREE.Vector2(1, 0 + options.carLightsFade)
        );
        this.leftSticks = new LightsSticks(this, options);

        this.fovTarget = options.fov;
        this.speedUpTarget = 0;
        this.speedUp = 0;
        this.timeOffset = 0;

        this.tick = this.tick.bind(this);
        this.init = this.init.bind(this);
        this.setSize = this.setSize.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);

        this.onTouchStart = this.onTouchStart.bind(this);
        this.onTouchEnd = this.onTouchEnd.bind(this);
        this.onContextMenu = this.onContextMenu.bind(this);

        this.onWindowResize = this.onWindowResize.bind(this);
        window.addEventListener('resize', this.onWindowResize);

        if (container.offsetWidth > 0 && container.offsetHeight > 0) {
          this.hasValidSize = true;
        }
      }

      onWindowResize() {
        const width = this.container.offsetWidth;
        const height = this.container.offsetHeight;

        if (width <= 0 || height <= 0) {
          this.hasValidSize = false;
          return;
        }

        this.renderer.setSize(width, height);
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.composer.setSize(width, height);
        this.hasValidSize = true;
      }

      initPasses() {
        this.renderPass = new RenderPass(this.scene, this.camera);
        this.bloomPass = new EffectPass(
          this.camera,
          new BloomEffect({
            luminanceThreshold: 0.2,
            luminanceSmoothing: 0,
            resolutionScale: 1
          })
        );

        const smaaPass = new EffectPass(
          this.camera,
          new SMAAEffect({
            preset: SMAAPreset.MEDIUM,
            searchImage: SMAAEffect.searchImageDataURL,
            areaImage: SMAAEffect.areaImageDataURL
          })
        );
        this.renderPass.renderToScreen = false;
        this.bloomPass.renderToScreen = false;
        smaaPass.renderToScreen = true;
        this.composer.addPass(this.renderPass);
        this.composer.addPass(this.bloomPass);
        this.composer.addPass(smaaPass);
      }

      loadAssets() {
        const assets = this.assets;
        return new Promise(resolve => {
          const manager = new THREE.LoadingManager(resolve);

          const searchImage = new Image();
          const areaImage = new Image();
          assets.smaa = {};
          searchImage.addEventListener('load', function () {
            assets.smaa.search = this;
            manager.itemEnd('smaa-search');
          });

          areaImage.addEventListener('load', function () {
            assets.smaa.area = this;
            manager.itemEnd('smaa-area');
          });
          manager.itemStart('smaa-search');
          manager.itemStart('smaa-area');

          searchImage.src = SMAAEffect.searchImageDataURL;
          areaImage.src = SMAAEffect.areaImageDataURL;
        });
      }

      init() {
        this.initPasses();
        const options = this.options;
        this.road.init();
        this.leftCarLights.init();

        this.leftCarLights.mesh.position.setX(-options.roadWidth / 2 - options.islandWidth / 2);
        this.rightCarLights.init();
        this.rightCarLights.mesh.position.setX(options.roadWidth / 2 + options.islandWidth / 2);
        this.leftSticks.init();
        this.leftSticks.mesh.position.setX(-(options.roadWidth + options.islandWidth / 2));

        this.container.addEventListener('mousedown', this.onMouseDown);
        this.container.addEventListener('mouseup', this.onMouseUp);
        this.container.addEventListener('mouseout', this.onMouseUp);

        this.container.addEventListener('touchstart', this.onTouchStart, { passive: true });
        this.container.addEventListener('touchend', this.onTouchEnd, { passive: true });
        this.container.addEventListener('touchcancel', this.onTouchEnd, { passive: true });
        this.container.addEventListener('contextmenu', this.onContextMenu);

        this.tick();
      }

      onMouseDown(ev) {
        if (this.options.onSpeedUp) this.options.onSpeedUp(ev);
        this.fovTarget = this.options.fovSpeedUp;
        this.speedUpTarget = this.options.speedUp;
      }

      onMouseUp(ev) {
        if (this.options.onSlowDown) this.options.onSlowDown(ev);
        this.fovTarget = this.options.fov;
        this.speedUpTarget = 0;
      }

      onTouchStart(ev) {
        if (this.options.onSpeedUp) this.options.onSpeedUp(ev);
        this.fovTarget = this.options.fovSpeedUp;
        this.speedUpTarget = this.options.speedUp;
      }

      onTouchEnd(ev) {
        if (this.options.onSlowDown) this.options.onSlowDown(ev);
        this.fovTarget = this.options.fov;
        this.speedUpTarget = 0;
      }

      onContextMenu(ev) {
        ev.preventDefault();
      }

      update(delta) {
        let lerpPercentage = Math.exp(-(-60 * Math.log2(1 - 0.1)) * delta);
        this.speedUp += lerp(this.speedUp, this.speedUpTarget, lerpPercentage, 0.00001);
        this.timeOffset += this.speedUp * delta;

        let time = this.clock.elapsedTime + this.timeOffset;

        this.rightCarLights.update(time);
        this.leftCarLights.update(time);
        this.leftSticks.update(time);
        this.road.update(time);

        let updateCamera = false;
        let fovChange = lerp(this.camera.fov, this.fovTarget, lerpPercentage);
        if (fovChange !== 0) {
          this.camera.fov += fovChange * delta * 6;
          updateCamera = true;
        }

        if (this.options.distortion.getJS) {
          const distortion = this.options.distortion.getJS(0.025, time);

          this.camera.lookAt(
            new THREE.Vector3(
              this.camera.position.x + distortion.x,
              this.camera.position.y + distortion.y,
              this.camera.position.z + distortion.z
            )
          );
          updateCamera = true;
        }
        if (updateCamera) {
          this.camera.updateProjectionMatrix();
        }
      }

      render(delta) {
        if (this.disposed || !this.hasValidSize || !this.composer) return;
        try {
          this.composer.render(delta);
        } catch {
          this.disposed = true;
        }
      }

      dispose() {
        this.disposed = true;

        if (this.scene) {
          this.scene.traverse(object => {
            const obj = object;
            if (!obj.isMesh) return;

            if (obj.geometry) obj.geometry.dispose();

            if (obj.material) {
              if (Array.isArray(obj.material)) {
                obj.material.forEach(material => material.dispose());
              } else {
                obj.material.dispose();
              }
            }
          });
          this.scene.clear();
        }

        if (this.renderer) {
          this.renderer.dispose();
          this.renderer.forceContextLoss();
          if (this.renderer.domElement && this.renderer.domElement.parentNode) {
            this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
          }
        }
        if (this.composer) {
          this.composer.dispose();
        }

        window.removeEventListener('resize', this.onWindowResize);
        if (this.container) {
          this.container.removeEventListener('mousedown', this.onMouseDown);
          this.container.removeEventListener('mouseup', this.onMouseUp);
          this.container.removeEventListener('mouseout', this.onMouseUp);

          this.container.removeEventListener('touchstart', this.onTouchStart);
          this.container.removeEventListener('touchend', this.onTouchEnd);
          this.container.removeEventListener('touchcancel', this.onTouchEnd);
          this.container.removeEventListener('contextmenu', this.onContextMenu);
        }
      }

      setSize(width, height, updateStyles) {
        if (width <= 0 || height <= 0) {
          this.hasValidSize = false;
          return;
        }
        this.composer.setSize(width, height, updateStyles);
        this.hasValidSize = true;
      }

      tick() {
        if (this.disposed) return;

        if (!this.hasValidSize) {
          const w = this.container.offsetWidth;
          const h = this.container.offsetHeight;
          if (w > 0 && h > 0) {
            this.renderer.setSize(w, h, false);
            this.camera.aspect = w / h;
            this.camera.updateProjectionMatrix();
            this.composer.setSize(w, h);
            this.hasValidSize = true;
          } else {
            requestAnimationFrame(this.tick);
            return;
          }
        }

        if (resizeRendererToDisplaySize(this.renderer, this.setSize)) {
          const canvas = this.renderer.domElement;
          if (this.hasValidSize) {
            this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
            this.camera.updateProjectionMatrix();
          }
        }

        if (this.hasValidSize) {
          const delta = this.clock.getDelta();
          this.render(delta);
          this.update(delta);
        }

        requestAnimationFrame(this.tick);
      }
    }

    const distortion_uniforms = {
      uDistortionX: { value: new THREE.Vector2(80, 3) },
      uDistortionY: { value: new THREE.Vector2(-40, 2.5) }
    };

    const distortion_vertex = `
      #define PI 3.14159265358979
      uniform vec2 uDistortionX;
      uniform vec2 uDistortionY;
      float nsin(float val){
        return sin(val) * 0.5 + 0.5;
      }
      vec3 getDistortion(float progress){
        progress = clamp(progress, 0., 1.);
        float xAmp = uDistortionX.r;
        float xFreq = uDistortionX.g;
        float yAmp = uDistortionY.r;
        float yFreq = uDistortionY.g;
        return vec3( 
          xAmp * nsin(progress * PI * xFreq - PI / 2.),
          yAmp * nsin(progress * PI * yFreq - PI / 2.),
          0.
        );
      }
    `;

    const random = base => {
      if (Array.isArray(base)) return Math.random() * (base[1] - base[0]) + base[0];
      return Math.random() * base;
    };

    const pickRandom = arr => {
      if (Array.isArray(arr)) return arr[Math.floor(Math.random() * arr.length)];
      return arr;
    };

    function lerp(current, target, speed = 0.1, limit = 0.001) {
      let change = (target - current) * speed;
      if (Math.abs(change) < limit) {
        change = target - current;
      }
      return change;
    }

    class CarLights {
      constructor(webgl, options, colors, speed, fade) {
        this.webgl = webgl;
        this.options = options;
        this.colors = colors;
        this.speed = speed;
        this.fade = fade;
      }

      init() {
        const options = this.options;
        let curve = new THREE.LineCurve3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -1));
        let geometry = new THREE.TubeGeometry(curve, 40, 1, 8, false);

        let instanced = new THREE.InstancedBufferGeometry().copy(geometry);
        instanced.instanceCount = options.lightPairsPerRoadWay * 2;

        let laneWidth = options.roadWidth / options.lanesPerRoad;

        let aOffset = [];
        let aMetrics = [];
        let aColor = [];

        let colors = this.colors;
        if (Array.isArray(colors)) {
          colors = colors.map(c => new THREE.Color(c));
        } else {
          colors = new THREE.Color(colors);
        }

        for (let i = 0; i < options.lightPairsPerRoadWay; i++) {
          let radius = random(options.carLightsRadius);
          let length = random(options.carLightsLength);
          let speed = random(this.speed);

          let carLane = i % options.lanesPerRoad;
          let laneX = carLane * laneWidth - options.roadWidth / 2 + laneWidth / 2;

          let carWidth = random(options.carWidthPercentage) * laneWidth;
          let carShiftX = random(options.carShiftX) * laneWidth;
          laneX += carShiftX;

          let offsetY = random(options.carFloorSeparation) + radius * 1.3;

          let offsetZ = -random(options.length);

          aOffset.push(laneX - carWidth / 2);
          aOffset.push(offsetY);
          aOffset.push(offsetZ);

          aOffset.push(laneX + carWidth / 2);
          aOffset.push(offsetY);
          aOffset.push(offsetZ);

          aMetrics.push(radius);
          aMetrics.push(length);
          aMetrics.push(speed);

          aMetrics.push(radius);
          aMetrics.push(length);
          aMetrics.push(speed);

          let color = pickRandom(colors);
          aColor.push(color.r);
          aColor.push(color.g);
          aColor.push(color.b);

          aColor.push(color.r);
          aColor.push(color.g);
          aColor.push(color.b);
        }

        instanced.setAttribute('aOffset', new THREE.InstancedBufferAttribute(new Float32Array(aOffset), 3, false));
        instanced.setAttribute('aMetrics', new THREE.InstancedBufferAttribute(new Float32Array(aMetrics), 3, false));
        instanced.setAttribute('aColor', new THREE.InstancedBufferAttribute(new Float32Array(aColor), 3, false));

        let material = new THREE.ShaderMaterial({
          fragmentShader: carLightsFragment,
          vertexShader: carLightsVertex,
          glslVersion: THREE.GLSL1,
          transparent: true,
          uniforms: Object.assign(
            {
              uTime: { value: 0 },
              uTravelLength: { value: options.length },
              uFade: { value: this.fade }
            },
            this.webgl.fogUniforms,
            options.distortion.uniforms
          )
        });

        material.onBeforeCompile = shader => {
          shader.vertexShader = shader.vertexShader.replace(
            '#include <getDistortion_vertex>',
            options.distortion.getDistortion
          );
        };

        let mesh = new THREE.Mesh(instanced, material);
        mesh.frustumCulled = false;
        this.webgl.scene.add(mesh);
        this.mesh = mesh;
      }

      update(time) {
        this.mesh.material.uniforms.uTime.value = time;
      }
    }

    const carLightsFragment = `
      #define USE_FOG;
      ${THREE.ShaderChunk['fog_pars_fragment']}
      varying vec3 vColor;
      varying vec2 vUv; 
      uniform vec2 uFade;
      void main() {
        vec3 color = vec3(vColor);
        float alpha = smoothstep(uFade.x, uFade.y, vUv.x);
        gl_FragColor = vec4(color, alpha);
        if (gl_FragColor.a < 0.0001) discard;
        ${THREE.ShaderChunk['fog_fragment']}
      }
    `;

    const carLightsVertex = `
      #define USE_FOG;
      ${THREE.ShaderChunk['fog_pars_vertex']}
      attribute vec3 aOffset;
      attribute vec3 aMetrics;
      attribute vec3 aColor;
      uniform float uTravelLength;
      uniform float uTime;
      varying vec2 vUv; 
      varying vec3 vColor; 
      #include <getDistortion_vertex>
      void main() {
        vec3 transformed = position.xyz;
        float radius = aMetrics.r;
        float myLength = aMetrics.g;
        float speed = aMetrics.b;

        transformed.xy *= radius;
        transformed.z *= myLength;

        vUv = uv;
        vColor = aColor;

        float zProgress = (aOffset.z - uTime * speed) / uTravelLength;
        zProgress = max(zProgress, 0.);
        zProgress = fract(zProgress);

        transformed.z += zProgress * uTravelLength;
        transformed.xyz += aOffset;

        float transformedProgress = transformed.z / uTravelLength;
        transformed.xyz += getDistortion(transformedProgress);

        vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        ${THREE.ShaderChunk['fog_vertex']}
      }
    `;

    class LightsSticks {
      constructor(webgl, options) {
        this.webgl = webgl;
        this.options = options;
      }

      init() {
        const options = this.options;
        const curve = new THREE.LineCurve3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -1));
        const geometry = new THREE.TubeGeometry(curve, 40, 1, 8, false);
        const instanced = new THREE.InstancedBufferGeometry().copy(geometry);
        instanced.instanceCount = options.totalSideLightSticks;

        const aOffset = [];
        const aMetrics = [];

        for (let i = 0; i < options.totalSideLightSticks; i++) {
          const width = random(options.lightStickWidth);
          const height = random(options.lightStickHeight);
          const length = random(options.carLightsLength);
          const speed = random(options.movingAwaySpeed);

          const offsetY = random(options.carFloorSeparation) + height / 2;
          const offsetZ = -random(options.length);

          aOffset.push(0, offsetY, offsetZ);
          aMetrics.push(width, height, length, speed);
        }

        instanced.setAttribute('aOffset', new THREE.InstancedBufferAttribute(new Float32Array(aOffset), 3, false));
        instanced.setAttribute('aMetrics', new THREE.InstancedBufferAttribute(new Float32Array(aMetrics), 4, false));

        const material = new THREE.ShaderMaterial({
          fragmentShader: sideSticksFragment,
          vertexShader: sideSticksVertex,
          glslVersion: THREE.GLSL1,
          transparent: true,
          uniforms: Object.assign(
            {
              uTime: { value: 0 },
              uTravelLength: { value: options.length },
              uColor: { value: new THREE.Color(options.colors.sticks) }
            },
            this.webgl.fogUniforms,
            options.distortion.uniforms
          )
        });

        material.onBeforeCompile = shader => {
          shader.vertexShader = shader.vertexShader.replace(
            '#include <getDistortion_vertex>',
            options.distortion.getDistortion
          );
        };

        const mesh = new THREE.Mesh(instanced, material);
        mesh.frustumCulled = false;
        this.webgl.scene.add(mesh);
        this.mesh = mesh;
      }

      update(time) {
        this.mesh.material.uniforms.uTime.value = time;
      }
    }

    const sideSticksFragment = `
      #define USE_FOG;
      ${THREE.ShaderChunk['fog_pars_fragment']}
      varying vec2 vUv; 
      uniform vec3 uColor;
      void main() {
        float alpha = smoothstep(0., 0.1, vUv.x) * smoothstep(1., 0.9, vUv.x);
        gl_FragColor = vec4(uColor, alpha);
        if (gl_FragColor.a < 0.0001) discard;
        ${THREE.ShaderChunk['fog_fragment']}
      }
    `;

    const sideSticksVertex = `
      #define USE_FOG;
      ${THREE.ShaderChunk['fog_pars_vertex']}
      attribute vec3 aOffset;
      attribute vec4 aMetrics;
      uniform float uTravelLength;
      uniform float uTime;
      varying vec2 vUv; 
      #include <getDistortion_vertex>
      void main() {
        vec3 transformed = position.xyz;
        float width = aMetrics.x;
        float height = aMetrics.y;
        float myLength = aMetrics.z;
        float speed = aMetrics.w;

        transformed.x *= width;
        transformed.y *= height;
        transformed.z *= myLength;

        vUv = uv;

        float zProgress = (aOffset.z - uTime * speed) / uTravelLength;
        zProgress = max(zProgress, 0.);
        zProgress = fract(zProgress);

        transformed.z += zProgress * uTravelLength;
        transformed.xyz += aOffset;

        float transformedProgress = transformed.z / uTravelLength;
        transformed.xyz += getDistortion(transformedProgress);

        vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        ${THREE.ShaderChunk['fog_vertex']}
      }
    `;

    class Road {
      constructor(webgl, options) {
        this.webgl = webgl;
        this.options = options;
      }

      init() {
        const options = this.options;
        const geometry = new THREE.PlaneGeometry(options.length, options.roadWidth, 80, 4);

        const material = new THREE.ShaderMaterial({
          fragmentShader: roadFragment,
          vertexShader: roadVertex,
          glslVersion: THREE.GLSL1,
          transparent: true,
          uniforms: Object.assign(
            {
              uTime: { value: 0 },
              uTravelLength: { value: options.length },
              uColors: {
                value: {
                  roadColor: new THREE.Color(options.colors.roadColor),
                  islandColor: new THREE.Color(options.colors.islandColor),
                  shoulderLines: new THREE.Color(options.colors.shoulderLines),
                  brokenLines: new THREE.Color(options.colors.brokenLines)
                }
              },
              uLanesPerRoad: { value: options.lanesPerRoad },
              uShoulderLinesWidthPercentage: { value: options.shoulderLinesWidthPercentage },
              uBrokenLinesWidthPercentage: { value: options.brokenLinesWidthPercentage },
              uBrokenLinesLengthPercentage: { value: options.brokenLinesLengthPercentage }
            },
            this.webgl.fogUniforms,
            options.distortion.uniforms
          )
        });

        material.onBeforeCompile = shader => {
          shader.vertexShader = shader.vertexShader.replace(
            '#include <getDistortion_vertex>',
            options.distortion.getDistortion
          );
        };

        const mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.x = -Math.PI / 2;
        mesh.rotation.z = -Math.PI / 2;
        mesh.position.z = -options.length / 2;
        mesh.frustumCulled = false;
        this.webgl.scene.add(mesh);
        this.mesh = mesh;
      }

      update(time) {
        this.mesh.material.uniforms.uTime.value = time;
      }
    }

    const roadFragment = `
      #define USE_FOG;
      ${THREE.ShaderChunk['fog_pars_fragment']}
      
      struct roadColors {
        vec3 roadColor;
        vec3 islandColor;
        vec3 shoulderLines;
        vec3 brokenLines;
      };
      
      uniform roadColors uColors;
      uniform float uLanesPerRoad;
      uniform float uShoulderLinesWidthPercentage;
      uniform float uBrokenLinesWidthPercentage;
      uniform float uBrokenLinesLengthPercentage;
      uniform float uTravelLength;
      uniform float uTime;
      
      varying vec2 vUv;
      
      void main() {
        vec2 uv = vUv;
        vec3 color = uColors.roadColor;
        
        float brokenLinesLength = 1.0 / 10.0;
        float brokenLineSign = mod(uv.y * uTravelLength * brokenLinesLength + uTime * 10.0, 1.0);
        float brokenLine = step(brokenLineSign, uBrokenLinesLengthPercentage);
        
        float laneWidth = 1.0 / uLanesPerRoad;
        float isLine = 0.0;
        
        for (float i = 1.0; i < 100.0; i++) {
          if (i >= uLanesPerRoad) break;
          float lineUv = i * laneWidth;
          isLine += step(lineUv - uBrokenLinesWidthPercentage * laneWidth, uv.x) * step(uv.x, lineUv + uBrokenLinesWidthPercentage * laneWidth);
        }
        
        isLine = clamp(isLine, 0.0, 1.0);
        color = mix(color, uColors.brokenLines, isLine * brokenLine);
        
        float leftShoulder = step(0.0, uv.x) * step(uv.x, uShoulderLinesWidthPercentage);
        float rightShoulder = step(1.0 - uShoulderLinesWidthPercentage, uv.x) * step(uv.x, 1.0);
        
        color = mix(color, uColors.shoulderLines, leftShoulder + rightShoulder);
        
        gl_FragColor = vec4(color, 1.0);
        ${THREE.ShaderChunk['fog_fragment']}
      }
    `;

    const roadVertex = `
      #define USE_FOG;
      ${THREE.ShaderChunk['fog_pars_vertex']}
      uniform float uTravelLength;
      varying vec2 vUv;
      #include <getDistortion_vertex>
      void main() {
        vec3 transformed = position.xyz;
        vUv = uv;
        float progress = (transformed.y + uTravelLength / 2.0) / uTravelLength;
        transformed.xyz += getDistortion(progress);
        vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        ${THREE.ShaderChunk['fog_pars_vertex']}
        ${THREE.ShaderChunk['fog_vertex']}
      }
    `;

    function resizeRendererToDisplaySize(renderer, setSize) {
      const canvas = renderer.domElement;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const needResize = canvas.width !== width || canvas.height !== height;
      if (needResize) {
        setSize(width, height, false);
      }
      return needResize;
    }

    const prepareDistortion = (distortion) => {
      if (!distortion?.getDistortion) return distortion;
      const needsTimeDecl =
        distortion.getDistortion.includes('uTime') &&
        !distortion.getDistortion.includes('uniform float uTime');
      return {
        ...distortion,
        uniforms: { uTime: { value: 0 }, ...(distortion.uniforms || {}) },
        getDistortion: needsTimeDecl
          ? `uniform float uTime;\n${distortion.getDistortion}`
          : distortion.getDistortion,
      };
    };

    const container = hyperspeed.current;
    const options = Object.assign({}, DEFAULT_EFFECT_OPTIONS, effectOptions);

    if (options.distortion === 'mountainDistortion') {
      options.distortion = distortions.mountainDistortion;
    } else if (options.distortion === 'xyDistortion') {
      options.distortion = distortions.xyDistortion;
    } else if (options.distortion === 'LongRaceDistortion') {
      options.distortion = distortions.LongRaceDistortion;
    } else if (options.distortion === 'turbulentDistortion') {
      options.distortion = distortions.turbulentDistortion;
    } else if (options.distortion === 'turbulentDistortionStill') {
      options.distortion = distortions.turbulentDistortionStill;
    } else if (options.distortion === 'deepDistortionStill') {
      options.distortion = distortions.deepDistortionStill;
    } else if (options.distortion === 'deepDistortion') {
      options.distortion = distortions.deepDistortion;
    } else {
      options.distortion = {
        uniforms: distortion_uniforms,
        getDistortion: distortion_vertex,
      };
    }

    options.distortion = prepareDistortion(options.distortion);

    const app = new App(container, options);
    appRef.current = app;
    app.loadAssets().then(app.init);

    return () => {
      if (appRef.current) {
        appRef.current.dispose();
        appRef.current = null;
      }
    };
  }, [effectOptions]);

  return (
    <div
      ref={hyperspeed}
      className="w-full h-full min-h-[300px]"
      style={{ background: 'black' }}
    />
  );
};


// ==========================================
// 2. FULLY UPDATED FOOTER WITH YOUR DOC DATA
// ==========================================

const Footer = () => {
  const footerRef = useRef(null);
  const isVisible = useSectionVisible(footerRef, { rootMargin: '120px 0px', threshold: 0.05 });

  return (
    <footer
      ref={footerRef}
      className="relative w-full bg-black text-zinc-400 overflow-hidden border-t border-zinc-900"
      id="footer"
    >
      
      {/* Dynamic Background — only runs when footer is near viewport */}
      <div className="absolute inset-0 z-0 opacity-60 min-h-[220px] sm:min-h-[280px]">
        {isVisible ? <Hyperspeed /> : <div className="w-full h-full bg-black" aria-hidden="true" />}
      </div>

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-6 sm:pb-8 pointer-events-none">
        
        {/* Footprint Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 mb-10 sm:mb-12">
          
          {/* Identity Capsule */}
          <div className="flex flex-col gap-4 pointer-events-auto">
            <h2 className="text-xl sm:text-2xl font-bold tracking-wider text-white bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent break-words">
              SefatUllahFahad
            </h2>
            <p className="text-sm leading-relaxed max-w-full sm:max-w-xs text-zinc-400">
              Hi, I am Sefatullah Fahad, a passionate Full-Stack Web Developer. I love building fast, scalable, and user-friendly web applications from scratch.
            </p>
          </div>

          {/* Quick-links Matrix */}
          <div className="flex flex-col gap-3 pointer-events-auto">
            <h3 className="text-white font-semibold tracking-wide uppercase text-xs mb-1">
              Navigation
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#about"
                  onClick={(e) => { e.preventDefault(); scrollToSectionId('about'); }}
                  className="hover:text-cyan-400 transition-colors duration-200"
                >
                  About Me
                </a>
              </li>
              <li>
                <a
                  href="#projects"
                  onClick={(e) => { e.preventDefault(); scrollToSectionId('projects'); }}
                  className="hover:text-cyan-400 transition-colors duration-200"
                >
                  Projects
                </a>
              </li>
              <li>
                <a
                  href="#experience"
                  onClick={(e) => { e.preventDefault(); scrollToSectionId('experience'); }}
                  className="hover:text-cyan-400 transition-colors duration-200"
                >
                  Experience
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  onClick={(e) => { e.preventDefault(); scrollToSectionId('contact'); }}
                  className="hover:text-cyan-400 transition-colors duration-200"
                >
                  Lets Talk
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Anchor */}
          <div className="flex flex-col gap-3 pointer-events-auto">
            <h3 className="text-white font-semibold tracking-wide uppercase text-xs mb-1">
              Contact
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-cyan-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.72l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.72.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
                <a href="tel:+8801943850789" className="hover:text-white transition-colors">+880 1943-850789</a>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-purple-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                <a href="mailto:fahad.web.code@gmail.com" className="hover:text-white transition-colors break-all">fahad.web.code@gmail.com</a>
              </li>
            </ul>
          </div>

          {/* Social Cluster */}
          <div className="flex flex-col gap-3 pointer-events-auto">
            <h3 className="text-white font-semibold tracking-wide uppercase text-xs mb-1">
              Connect with me
            </h3>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              {/* GitHub */}
              <a href="https://github.com/Sefat-Ullah-Fahad" target="_blank" rel="noreferrer" className="p-2 bg-zinc-900 hover:bg-zinc-800 rounded-lg text-zinc-300 hover:text-white transition-all duration-200" aria-label="GitHub">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.008.069-.008 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
              {/* LinkedIn */}
              <a href="https://www.linkedin.com/in/md-fahad-3a0910396/" target="_blank" rel="noreferrer" className="p-2 bg-zinc-900 hover:bg-zinc-800 rounded-lg text-zinc-300 hover:text-white transition-all duration-200" aria-label="LinkedIn">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                </svg>
              </a>
              {/* Facebook */}
              <a href="https://www.facebook.com/sefat.ullah.fahad" target="_blank" rel="noreferrer" className="p-2 bg-zinc-900 hover:bg-zinc-800 rounded-lg text-zinc-300 hover:text-white transition-all duration-200" aria-label="Facebook">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              {/* Instagram */}
              <a href="https://www.instagram.com/sifatullahfahad/" target="_blank" rel="noreferrer" className="p-2 bg-zinc-900 hover:bg-zinc-800 rounded-lg text-zinc-300 hover:text-white transition-all duration-200" aria-label="Instagram">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
            </div>
          </div>

        </div>

        {/* Divider Grid */}
        <hr className="border-zinc-900 my-6" />

        {/* Legal Node */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 text-xs text-zinc-500 text-center pointer-events-auto px-2">
          <p>&copy; {new Date().getFullYear()} SefatUllahFahad. All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;