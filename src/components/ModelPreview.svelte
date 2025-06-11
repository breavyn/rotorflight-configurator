<script>
  import { onMount, onDestroy, tick } from "svelte";
  import * as THREE from "three";
  import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

  import { FC } from "@/js/fc.svelte.js";

  let container;
  let canvas;
  let renderer;
  let width = $state();
  let height = $state();
  let error = $state(false);

  let o = $state({});

  $effect(() => {
    resize(width, height);
  });

  onMount(async () => {
    const clockwise = FC.MIXER_CONFIG.main_rotor_dir === 0;

    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
      });
    } catch (err) {
      console.log("Failed to create WebGLRenderer", err);
      error = true;
      return;
    }

    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    o.scene = new THREE.Scene();
    o.modelWrapper = new THREE.Object3D();
    o.camera = new THREE.PerspectiveCamera(10, width / height, 1, 10000);
    o.camera.position.z = 800;
    o.light = new THREE.AmbientLight(0xffffff, 1.2);
    o.light2 = new THREE.DirectionalLight(new THREE.Color(1, 1, 1), 3.0);
    o.light2.position.set(0, 600, 800);

    o.scene.add(o.light);
    o.scene.add(o.light2);
    o.scene.add(o.camera);
    o.scene.add(o.modelWrapper);

    o.model = await loadGLTF(`bell_${clockwise ? "cw" : "ccw"}`);
    o.modelWrapper.add(o.model);
    o.scene.add(o.modelWrapper);
    await tick();
    render();
  });

  onDestroy(() => {
    if (!renderer) {
      return;
    }

    renderer.forceContextLoss();
    renderer.dispose();
  });

  function loadGLTF(modelName) {
    const loader = new GLTFLoader();
    return new Promise((resolve) => {
      loader.load(`/resources/models/${modelName}.gltf`, (gltf) =>
        resolve(gltf.scene),
      );
    });
  }

  function render() {
    if (!o.model) {
      return;
    }

    renderer.render(o.scene, o.camera);
  }

  function resize(w, h) {
    if (!renderer) {
      return;
    }

    renderer.setSize(w, h);
    o.camera.aspect = w / h;
    o.camera.updateProjectionMatrix();
    render();
  }

  export function rotateTo(x, y, z) {
    if (!o.model) {
      return;
    }

    o.model.rotation.x = x;
    o.modelWrapper.rotation.y = y;
    o.model.rotation.z = z;
    render();
  }

  export function rotateBy(x, y, z) {
    if (!o.model) {
      return;
    }

    o.model.rotateX(x);
    o.model.rotateY(y);
    o.model.rotateZ(z);
    render();
  }
</script>

<div
  bind:this={container}
  class="container background_paper"
  bind:clientWidth={width}
  bind:clientHeight={height}
>
  <canvas bind:this={canvas} {width} {height} />
  <button class="reset-btn">Reset</button>
  {#if error}
    <div class="webgl-error">WebGL Context Error</div>
  {/if}
</div>

<style lang="scss">
  .container {
    position: relative;
    height: 400px;
    border-radius: 4px;

    :global(html[data-theme="light"]) & {
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
  }

  .webgl-error {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: var(--mutedText);
    font-size: 16px;
    font-weight: 600;
  }

  canvas {
    border-radius: 4px;
  }

  .reset-btn {
    position: absolute;
    top: 0;
    right: 0;
    margin: 8px;
    font-weight: 400;
    font-size: 14px;
    padding: 6px 12px;
    transition: var(--animation-speed);

    :global(html[data-theme="light"]) & {
      color: var(--color-neutral-900);
      background-color: var(--color-neutral-200);
      border: 1px solid var(--color-neutral-400);
    }

    :global(html[data-theme="dark"]) & {
      color: var(--color-neutral-100);
      background-color: var(--color-neutral-800);
      border: 1px solid var(--color-neutral-500);
    }
  }

  @media (hover: hover) {
    .reset-btn:hover {
      :global(html[data-theme="light"]) & {
        background-color: var(--color-neutral-300);
      }

      :global(html[data-theme="dark"]) & {
        background-color: var(--color-neutral-700);
      }
    }
  }
</style>
