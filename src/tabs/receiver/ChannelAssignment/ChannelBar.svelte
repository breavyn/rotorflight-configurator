<script>
  import { FC } from "@/js/fc.svelte.js";

  import Meter from "@/components/Meter.svelte";

  let { channel } = $props();

  let percent = $derived.by(() => {
    return (FC.RX_CHANNELS[channel] - 1000) / 10;
  });
</script>

<Meter
  leftLabel={FC.RX_CHANNELS[channel]}
  value={percent}
  rightLabel={`${percent.toFixed(0)}%`}
/>

<style lang="scss">
</style>
