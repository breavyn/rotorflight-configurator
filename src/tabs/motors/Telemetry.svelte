<script>
  import semver from "semver";

  import { FC } from "@/js/fc.svelte.js";
  import { i18n } from "@/js/i18n.js";
  import Field from "@/components/Field.svelte";
  import Section from "@/components/Section.svelte";
  import SubSection from "@/components/SubSection.svelte";
  import Switch from "@/components/Switch.svelte";
  import Tooltip from "@/components/Tooltip.svelte";
  import NumberInput from "@/components/NumberInput.svelte";
  import { API_VERSION_12_8 } from "@/js/data_storage";

  const telemetryProtocols = [
    "Disabled",
    "BLHeli32",
    "Hobbywing Platinum V4 / FlyFun V5",
    "Hobbywing Platinum V5",
    "Scorpion",
    "Kontronik",
    "OMPHobby",
    "ZTW",
    "APD",
    "OpenYGE",
    "FLYROTOR",
    "Graupner",
    "XDFLY",
  ];

  let telemEnabled = $derived(FC.ESC_SENSOR_CONFIG.protocol > 0);
</script>

<Section label="Telemetry">
  <SubSection>
    <Field id="esc-telemetry-protocol" label="motorsEscTelemetryProtocol">
      {#snippet tooltip()}
        <Tooltip help="motorsEscTelemetryProtocolHelp" />
      {/snippet}
      <select
        id="esc-telemetry-protocol"
        bind:value={FC.ESC_SENSOR_CONFIG.protocol}
      >
        {#each telemetryProtocols as proto, index}
          <option value={index}>{proto}</option>
        {/each}
      </select>
    </Field>
  </SubSection>
  {#if telemEnabled}
    <SubSection label="Signaling">
      <Field
        id="esc-telemetry-half-duplex"
        label="motorsEscTelemetryHalfDuplex"
      >
        {#snippet tooltip()}
          <Tooltip help="motorsEscTelemetryHalfDuplexHelp" />
        {/snippet}
        <Switch
          id="esc-telemetry-half-duplex"
          bind:checked={FC.ESC_SENSOR_CONFIG.half_duplex}
        />
      </Field>

      <Field id="esc-telemetry-pinswap" label="motorsEscTelemetryPinswap">
        {#snippet tooltip()}
          <Tooltip help="motorsEscTelemetryPinswapHelp" />
        {/snippet}
        <Switch
          id="esc-telemetry-pinswap"
          bind:checked={FC.ESC_SENSOR_CONFIG.pinswap}
        />
      </Field>
    </SubSection>
    {#if semver.gte(FC.CONFIG.apiVersion, API_VERSION_12_8)}
      <SubSection label="Sensor Correction">
        <Field id="voltage-correction" label="motorsVoltageCorrection" unit="%">
          {#snippet tooltip()}
            <Tooltip
              help="motorsVoltageCorrectionHelp"
              attrs={[
                { name: "genericDefault", value: "0%" },
                { name: "genericRange", value: "-50% - 125%" },
              ]}
            />
          {/snippet}
          <NumberInput
            id="voltage-correction"
            min="-50"
            max="125"
            bind:value={FC.ESC_SENSOR_CONFIG.voltage_correction}
          />
        </Field>
        <Field id="current-correction" label="motorsCurrentCorrection" unit="%">
          {#snippet tooltip()}
            <Tooltip
              help="motorsCurrentCorrectionHelp"
              attrs={[
                { name: "genericDefault", value: "0%" },
                { name: "genericRange", value: "-50% - 125%" },
              ]}
            />
          {/snippet}
          <NumberInput
            id="current-correction"
            min="-50"
            max="125"
            bind:value={FC.ESC_SENSOR_CONFIG.current_correction}
          />
        </Field>
        <Field id="consumption-correction" label="motorsConsumptionCorrection" unit="%">
          {#snippet tooltip()}
            <Tooltip
              help="motorsConsumptionCorrectionHelp"
              attrs={[
                { name: "genericDefault", value: "0%" },
                { name: "genericRange", value: "-50% - 125%" },
              ]}
            />
          {/snippet}
          <NumberInput
            id="consumption-correction"
            min="-50"
            max="125"
            bind:value={FC.ESC_SENSOR_CONFIG.consumption_correction}
          />
        </Field>
      </SubSection>
    {/if}
  {/if}
</Section>

<style lang="scss">
</style>
