<script>
  import { onMount } from "svelte";
  import diff from "microdiff";

  import { FC } from "@/js/fc.svelte.js";
  import { i18n } from "@/js/i18n.js";
  import { reinitialiseConnection } from "@/js/serial_backend.js";
  import { MSPCodes } from "@/js/msp/MSPCodes.js";

  import Field from "@/components/Field.svelte";
  import Page from "@/components/Page.svelte";
  import Section from "@/components/Section.svelte";
  import SubSection from "@/components/SubSection.svelte";
  import NumberInput from "@/components/NumberInput.svelte";
  import Switch from "@/components/Switch.svelte";
  import Tooltip from "@/components/Tooltip.svelte";

  let loading = $state(true);
  let initialState;

  function snapshotState() {
    return $state.snapshot({
      CONFIG: FC.CONFIG,
      PILOT_CONFIG: FC.PILOT_CONFIG,
      SENSOR_CONFIG: FC.SENSOR_CONFIG,
      features: FC.FEATURE_CONFIG.features.bitfield,
    });
  }

  let changes = $derived.by(() => {
    if (!initialState) {
      return [];
    }

    return diff(initialState, snapshotState());
  });
  let showToolbar = $derived(!loading && changes.length > 0);

  onMount(async () => {
    await MSP.promise(MSPCodes.MSP_FEATURE_CONFIG);
    await MSP.promise(MSPCodes.MSP_PILOT_CONFIG);
    await MSP.promise(MSPCodes.MSP_SENSOR_CONFIG);
    await MSP.promise(MSPCodes.MSP_NAME);

    initialState = snapshotState();
    loading = false;
  });

  export async function onSave() {
    // function save(code) {
    //   return MSP.promise(code, mspHelper.crunch(code));
    // }

    await MSP.promise(MSPCodes.MSP_EEPROM_WRITE);
    GUI.log($i18n.t("eepromSaved"));
    MSP.send_message(MSPCodes.MSP_SET_REBOOT);
    GUI.log($i18n.t("deviceRebooting"));
    reinitialiseConnection();
  }

  export function onRevert() {
    Object.assign(FC.CONFIG, initialState.CONFIG);
    Object.assign(FC.PILOT_CONFIG, initialState.PILOT_CONFIG);
    Object.assign(FC.SENSOR_CONFIG, initialState.SENSOR_CONFIG);
    FC.FEATURE_CONFIG.features.bitfield = initialState.features;
  }

  function onClickHelp() {
    window.open(getTabHelpURL("tabConfiguration"), "_system");
  }

  export function isDirty() {
    return changes.length > 0;
  }
</script>

{#snippet header()}
  <h1>{$i18n.t("tabFailsafe")}</h1>
  <div class="grow"></div>
  <button class="help-btn" onclick={onClickHelp}>Help</button>
{/snippet}

{#snippet toolbar()}
  <button onclick={onRevert}>{$i18n.t("buttonRevert")}</button>
  <button onclick={onSave}>
    {$i18n.t("buttonSaveReboot")}
  </button>
{/snippet}

<Page {header} {loading} toolbar={showToolbar && toolbar}>
  <div class="content">
    <div class="column">
      <Section label="configurationPersonalization">
        <SubSection>
          <Field id="craft-name" label="craftName">
            <input id="craft-name" maxlength="32" bind:value={FC.CONFIG.name} />
          </Field>
          <Field id="model-id" label="Model Id">
            <NumberInput
              id="model-id"
              min="0"
              max="255"
              bind:value={FC.PILOT_CONFIG.model_id}
            />
          </Field>
        </SubSection>
      </Section>
      <Section label="configurationSystem">
        <SubSection>
          <Field id="accel-hw" label="configurationAccHardware">
            {#snippet tooltip()}
              <Tooltip help="configurationAccHardwareHelp" />
            {/snippet}
            <Switch
              id="accel-hw"
              bind:checked={
                () => !FC.SENSOR_CONFIG.acc_hardware,
                (v) => (FC.SENSOR_CONFIG.acc_hardware = Number(!v))
              }
            />
          </Field>
          <Field id="baro-hw" label="configurationBaroHardware">
            {#snippet tooltip()}
              <Tooltip help="configurationBaroHardwareHelp" />
            {/snippet}
            <Switch
              id="baro-hw"
              bind:checked={
                () => !FC.SENSOR_CONFIG.baro_hardware,
                (v) => (FC.SENSOR_CONFIG.baro_hardware = Number(!v))
              }
            />
          </Field>
          <Field id="mag-hw" label="configurationMagHardware">
            {#snippet tooltip()}
              <Tooltip help="configurationMagHardwareHelp" />
            {/snippet}
            <Switch
              id="mag-hw"
              bind:checked={
                () => !FC.SENSOR_CONFIG.mag_hardware,
                (v) => (FC.SENSOR_CONFIG.mag_hardware = Number(!v))
              }
            />
          </Field>
        </SubSection>
      </Section>
      <Section
        label="configurationFeatures"
        summary="configurationFeaturesHelp"
      >
        <SubSection>
          {#each Features.GROUPS.OTHER as f (f)}
            <Field id={`feature-${f}`} label={f}>
              {#snippet tooltip()}
                <Tooltip help={`featureTip_${f}`} />
              {/snippet}
              <Switch
                id={`feature-${f}`}
                bind:checked={FC.FEATURE_CONFIG.features[f]}
              />
            </Field>
          {/each}
        </SubSection>
      </Section>
    </div>
    <div class="column">
      <Section
        label="configurationSerialPorts"
        summary="configurationSerialPortsHelp"
      ></Section>
      <Section
        label="configurationBoardAlignment"
        summary="configurationBoardAlignmentHelp"
      ></Section>
    </div>
  </div>
</Page>

<style lang="scss">
  .content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    column-gap: var(--section-gap);
    row-gap: var(--section-gap);
  }

  .column {
    display: flex;
    flex-direction: column;
    gap: var(--section-gap);
  }

  .grow {
    flex-grow: 1;
  }

  button {
    @extend %button;
  }
</style>
