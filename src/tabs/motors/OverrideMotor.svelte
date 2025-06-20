<script>
  import { FC } from "@/js/fc.svelte.js";
  import Section from "@/components/Section.svelte";
  import Meter from "@/components/Meter.svelte";
  import Slider from "@/components/Slider.svelte";

  let { index } = $props();

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

  let rpm = $derived(FC.MOTOR_TELEMETRY_DATA.rpm[index] ?? 0);
  let voltage = $derived(FC.MOTOR_TELEMETRY_DATA.voltage[index] / 1000);
  let current = $derived(FC.MOTOR_TELEMETRY_DATA.current[index] / 1000);
  let temp1 = $derived(FC.MOTOR_TELEMETRY_DATA.temperature[index] / 10);
  let temp2 = $derived(FC.MOTOR_TELEMETRY_DATA.temperature2[index] / 10);
  let errors = $derived(FC.MOTOR_TELEMETRY_DATA.invalidPercent[index] / 100);

  let voltageMax = $state(10);
  let currentMax = $state(10);
  let temp1Max = $state(100);
  let temp2Max = $state(100);
</script>

<svelte:window bind:innerWidth={width} />

<Section label={`Motor #${index + 1} - Throttle ${FC.MOTOR_OVERRIDE[index]}%`}>
  <div class="slider-container">
    <Slider
      bind:value={FC.MOTOR_OVERRIDE[index]}
      onchange={() => {
      console.log("onchange", FC.MOTOR_OVERRIDE[index])
        mspHelper.sendMotorOverride(index);
      }}
      opts={{
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
      }}
    />
  </div>
  <div class="bars-container">
    <Meter
      title="RPM"
      rightLabel={`${(5000).toLocaleString()} RPM`}
      leftLabel={`${rpm.toLocaleString()} RPM`}
    />
    {#if FC.FEATURE_CONFIG.features.ESC_SENSOR}
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
</style>
