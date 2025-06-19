<script>
  import { onMount, onDestroy } from "svelte";
  import * as noUiSlider from "nouislider";

  let { value = $bindable(), opts, onchange } = $props();

  let node;
  let slider;

  $effect(() => {
    slider?.set(value);
  });

  $effect(() => {
    slider?.updateOptions(opts);
  });

  onMount(() => {
    slider = noUiSlider.create(node, { ...opts, cssPrefix: "svelte-slide-" });
    slider.on("slide", (values) => {
      value = Number(values[0]);
      onchange?.(value);
    });
    slider.set(value);
  });

  onDestroy(() => {
    slider.destroy();
  });
</script>

<div bind:this={node}></div>

<style lang="scss">
</style>
