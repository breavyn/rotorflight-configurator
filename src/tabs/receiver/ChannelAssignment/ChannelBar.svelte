<script>
  import { FC } from "@/js/fc.svelte.js";

  import Meter from "@/components/Meter.svelte";

  let { channel } = $props();

  const min = 750;
  const max = 2250;

  let axis = $derived(
    // channel
    channel < FC.RC_MAP.length ? FC.RC_MAP.indexOf(channel) : channel,
  );

  let width = $derived(
    ((100 * (FC.RX_CHANNELS[channel] - min)) / (max - min)).clamp(0, 100),
  );

  let percent = $derived.by(() => {
    const pulse = FC.RX_CHANNELS[channel];

    let deflection = 0;
    let deadband = 0;
    let result = 0;
    let range = 0;
    if (axis > 4 || pulse < min || pulse > max) {
      return 0;
    }
    switch (axis) {
      case 0:
      case 1:
        // Cyclic
        deflection = pulse - FC.RC_CONFIG.rc_center;
        deadband = FC.RC_CONFIG.rc_deadband;
        range = FC.RC_CONFIG.rc_deflection - FC.RC_CONFIG.rc_deadband;
        break;
      case 2:
        // Yaw
        deflection = pulse - FC.RC_CONFIG.rc_center;
        deadband = FC.RC_CONFIG.rc_yaw_deadband;
        range = FC.RC_CONFIG.rc_deflection - FC.RC_CONFIG.rc_yaw_deadband;
        break;
      case 3:
        // Collective
        deflection = pulse - FC.RC_CONFIG.rc_center;
        deadband = 0;
        range = FC.RC_CONFIG.rc_deflection;
        break;
      case 4:
        // Throttle
        deflection = pulse - FC.RC_CONFIG.rc_min_throttle;
        deadband = 0;
        range = FC.RC_CONFIG.rc_max_throttle - FC.RC_CONFIG.rc_min_throttle;
        break;
    }

    if (deflection > deadband) {
      result = (deflection - deadband) / range;
    } else if (deflection < -deadband) {
      result = (deflection + deadband) / range;
    }

    return (result * 100).clamp(-100, 100);
  });

  let rightLabel = $derived(axis <= 4 ? `${percent.toFixed(1)}%` : "");
</script>

<Meter leftLabel={FC.RX_CHANNELS[channel]} value={width} {rightLabel} />

<style lang="scss">
</style>
