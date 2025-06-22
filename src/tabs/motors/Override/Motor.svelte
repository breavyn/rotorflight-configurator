<script>
  import { onDestroy } from "svelte";
  import { FC } from "@/js/fc.svelte.js";
  import Section from "@/components/Section.svelte";
  import Meter from "@/components/Meter.svelte";
  import Slider from "@/components/Slider.svelte";

  import { State } from "../state.svelte.js";

  let { index } = $props();

  let slider;
  let overrideValue = $state(0);

  let width = $state(0);
  let mobile = $derived(width <= 480);
  let sliderDensity = $derived(mobile ? 10 : 5);
  let sliderValues = $derived.by(() => {
    const values = [];
    const step = mobile ? 20 : 10;
    for (let i = 0; i <= 100; i += step) {
      values.push(i);
    }

    return values;
  });

  let sliderOpts = $derived({
    range: {
      min: 0,
      max: 100,
    },
    connect: [true, false],
    start: 0,
    step: 1,
    behaviour: "snap-drag",
    pips: {
      mode: "values",
      values: sliderValues,
      density: sliderDensity,
      stepped: true,
    },
  });

  $effect(() => {
    slider.update(sliderOpts);
  });

  let throttle = $derived.by(() => {
    const value = FC.MOTOR_DATA[index];

    if (value < 0) {
      return (value + 1000) / 10;
    }

    if (value > 0) {
      return (value - 1000) / 10;
    }

    return 0;
  });
  let rpm = $derived(FC.MOTOR_TELEMETRY_DATA.rpm[index] ?? 0);
  let voltage = $derived(FC.MOTOR_TELEMETRY_DATA.voltage[index] / 1000);
  let current = $derived(FC.MOTOR_TELEMETRY_DATA.current[index] / 1000);
  let temp1 = $derived(FC.MOTOR_TELEMETRY_DATA.temperature[index] / 10);
  let temp2 = $derived(FC.MOTOR_TELEMETRY_DATA.temperature2[index] / 10);
  let errors = $derived(FC.MOTOR_TELEMETRY_DATA.invalidPercent[index] / 100);

  let rpmMax = $state(5000);
  let voltageMax = $state(10);
  let currentMax = $state(10);
  let temp1Max = $state(100);
  let temp2Max = $state(100);

  // Limit how frequently the motor override can be updated
  let timeoutId;
  function updateThrottle() {
    if (!timeoutId) {
      timeoutId = setTimeout(() => {
        timeoutId = null;
        FC.MOTOR_OVERRIDE[index] = overrideValue * 10;
        mspHelper.sendMotorOverride(index);
      }, 100);
    }
  }

  onDestroy(() => {
    clearTimeout(timeoutId);
    timeoutId = null;
  });
</script>

<svelte:window bind:innerWidth={width} />

<Section>
  {#snippet header()}
    <div class="header">
      <span>Motor #{index + 1}</span>
      <span>-</span>
      <span>{overrideValue}%</span>
    </div>
  {/snippet}
  <div class="slider-container">
    <Slider
      bind:this={slider}
      bind:value={overrideValue}
      onchange={updateThrottle}
      opts={sliderOpts}
    />
  </div>
  <div class="bars-container">
    <Meter
      title="Throttle"
      rightLabel="100%"
      leftLabel={`${throttle}%`}
      value={throttle}
    />
    <Meter
      title="RPM"
      rightLabel={`${rpmMax.toLocaleString()} RPM`}
      leftLabel={`${rpm.toLocaleString()} RPM`}
      value={(100 * rpm) / rpmMax}
    />
    {#if State.telemEnabled}
      <Meter
        title="Voltage"
        rightLabel={`${voltageMax} V`}
        leftLabel={`${voltage.toFixed(2)} V`}
        value={(100 * voltage) / voltageMax}
      />
      <Meter
        title="Current"
        rightLabel={`${currentMax} A`}
        leftLabel={`${current.toFixed(2)} A`}
        value={(100 * current) / currentMax}
      />
      <Meter
        title="Temperature 1"
        rightLabel={`${temp1Max} °C`}
        leftLabel={`${temp1.toFixed(1)} °C`}
        value={(100 * temp1) / temp1Max}
      />
      <Meter
        title="Temperature 2"
        rightLabel={`${temp2Max} °C`}
        leftLabel={`${temp2.toFixed(1)} °C`}
        value={(100 * temp2) / temp2Max}
      />
    {/if}
    {#if FC.ESC_SENSOR_CONFIG.use_dshot_telemetry}
      <Meter title="Errors" max="100" label={`${errors} %`} value={errors} />
    {/if}
  </div>
</Section>

<style lang="scss">
  .bars-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 4px;
  }

  .slider-container {
    margin-bottom: 20px;
    padding: 16px;
  }

  .header {
    @extend %section-header;
    padding-left: 8px;
    gap: 8px;
  }

  @media only screen and (max-width: 480px) {
    .header {
      margin-top: 16px;

      :global(html[data-theme="light"]) & {
        background: none;
      }

      :global(html[data-theme="dark"]) & {
        background: none;
      }
    }
  }
</style>
