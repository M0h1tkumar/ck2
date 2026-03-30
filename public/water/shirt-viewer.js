import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const viewerRoots = document.querySelectorAll('[data-shirt-viewer]');

viewerRoots.forEach((root) => {
  const canvasHost = root.querySelector('[data-shirt-canvas]');
  const overlay = root.querySelector('[data-shirt-overlay]');
  const backdrop = root.querySelector('.shirt-stage-backdrop');
  const status = root.querySelector('[data-shirt-status]');
  const hint = root.querySelector('[data-shirt-hint]');
  const modelUrl = root.getAttribute('data-model-url');

  if (!canvasHost || !overlay || !status || !hint || !modelUrl) {
    return;
  }

  let started = false;

  function setStatus(message) {
    status.textContent = message;
  }

  async function startViewer() {
    if (started) return;
    started = true;
    setStatus('Loading 3D preview...');

    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 1.3, 4.4);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearAlpha(0);
    renderer.domElement.style.touchAction = 'pan-y';
    canvasHost.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xdff7ff, 0x0d1822, 1.7));

    const keyLight = new THREE.DirectionalLight(0xf7fbff, 2.4);
    keyLight.position.set(3.8, 5.2, 4.2);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x64c9ff, 1.8);
    rimLight.position.set(-4.6, 3.2, -2.5);
    scene.add(rimLight);

    const fillLight = new THREE.PointLight(0x43d6ff, 1.2, 15);
    fillLight.position.set(0, 1.5, 2.8);
    scene.add(fillLight);

    const shirtPivot = new THREE.Group();
    shirtPivot.position.set(0, 0.32, 0);
    scene.add(shirtPivot);

    const loader = new GLTFLoader();
    let spinVelocity = 0.0025;
    let modelRoot = null;
    let dragActive = false;
    let activePointerId = null;
    let lastPointerX = 0;

    function onPointerDown(event) {
      if (!modelRoot) return;
      activePointerId = event.pointerId;
      dragActive = true;
      lastPointerX = event.clientX;
      spinVelocity = 0;
      event.preventDefault();
      renderer.domElement.setPointerCapture(event.pointerId);
      renderer.domElement.style.cursor = 'grabbing';
    }

    function onPointerMove(event) {
      if (!dragActive || !modelRoot || event.pointerId !== activePointerId) return;
      event.preventDefault();
      const deltaX = event.clientX - lastPointerX;
      lastPointerX = event.clientX;
      modelRoot.rotation.y += deltaX * 0.024;
    }

    function onPointerUp(event) {
      if (activePointerId !== null && event.pointerId === activePointerId) {
        renderer.domElement.releasePointerCapture(event.pointerId);
      }
      activePointerId = null;
      dragActive = false;
      renderer.domElement.style.cursor = 'grab';
    }

    function resize() {
      const rect = canvasHost.getBoundingClientRect();
      const width = Math.max(1, Math.round(rect.width));
      const height = Math.max(1, Math.round(rect.height));
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvasHost);
    resize();

    try {
      const gltf = await loader.loadAsync(modelUrl);
      const model = gltf.scene;
      model.updateMatrixWorld(true);

      const overallBox = new THREE.Box3().setFromObject(model);
      const overallSize = overallBox.getSize(new THREE.Vector3());
      const overallCenter = overallBox.getCenter(new THREE.Vector3());
      const meshesToRemove = [];

      model.traverse((child) => {
        if (child.isMesh) {
          const childBox = new THREE.Box3().setFromObject(child);
          const childSize = childBox.getSize(new THREE.Vector3());
          const childCenter = childBox.getCenter(new THREE.Vector3());
          const childName = `${child.name || ''} ${(child.material && !Array.isArray(child.material) && child.material.name) || ''}`.toLowerCase();
          const wideSpan = Math.max(childSize.x, childSize.z);
          const isNamedBase = /(floor|ground|base|plane|shadow)/.test(childName);
          const isFlatBase =
            childSize.y < overallSize.y * 0.08 &&
            wideSpan > Math.max(overallSize.x, overallSize.z) * 0.55 &&
            childCenter.y < overallCenter.y - overallSize.y * 0.22;

          if (isNamedBase || isFlatBase) {
            meshesToRemove.push(child);
            return;
          }

          child.castShadow = true;
          child.receiveShadow = true;
          const materials = Array.isArray(child.material) ? child.material : [child.material];
          materials.forEach((material) => {
            if (!material) return;
            material.transparent = false;
            material.opacity = 1;
            material.depthWrite = true;
            material.depthTest = true;
            material.alphaTest = 0;
            material.side = THREE.DoubleSide;
            if ('transmission' in material) material.transmission = 0;
            if ('thickness' in material) material.thickness = 0;
            if ('attenuationDistance' in material) material.attenuationDistance = 0;
            if ('metalness' in material) material.metalness = Math.min(material.metalness ?? 0, 0.18);
            if ('roughness' in material) material.roughness = Math.max(material.roughness ?? 0.6, 0.58);
            material.needsUpdate = true;
          });
        }
      });

      meshesToRemove.forEach((mesh) => {
        mesh.parent?.remove(mesh);
      });

      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const maxAxis = Math.max(size.x, size.y, size.z) || 1;
      const scale = 2.1 / maxAxis;

      model.scale.setScalar(scale);
      model.updateMatrixWorld(true);

      const scaledBox = new THREE.Box3().setFromObject(model);
      const scaledSize = scaledBox.getSize(new THREE.Vector3());
      const scaledCenter = scaledBox.getCenter(new THREE.Vector3());

      model.position.x -= scaledCenter.x;
      model.position.y -= scaledCenter.y - scaledSize.y * 0.06;
      model.position.z -= scaledCenter.z;
      shirtPivot.add(model);
      modelRoot = shirtPivot;
      shirtPivot.rotation.y = -0.2;

      camera.position.set(0, 0.8, 3.55);

      overlay.hidden = true;
      if (backdrop) {
        backdrop.hidden = true;
      }
      hint.hidden = false;
      setStatus('3D preview loaded');
      renderer.domElement.style.cursor = 'grab';
      renderer.domElement.addEventListener('pointerdown', onPointerDown);
      renderer.domElement.addEventListener('pointermove', onPointerMove);
      renderer.domElement.addEventListener('pointerup', onPointerUp);
      renderer.domElement.addEventListener('pointercancel', onPointerUp);
      renderer.domElement.addEventListener('pointerleave', onPointerUp);

      const clock = new THREE.Clock();

      function animate() {
        requestAnimationFrame(animate);
        clock.getElapsedTime();
        if (modelRoot && !dragActive) {
          modelRoot.rotation.y += spinVelocity;
        }
        renderer.render(scene, camera);
      }

      animate();
    } catch (error) {
      console.error('Failed to load GLB preview', error);
      started = false;
      setStatus('Could not load the 3D preview');
    }
  }

  startViewer();
});
