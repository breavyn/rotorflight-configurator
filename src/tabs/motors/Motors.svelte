<script>
  import { onMount } from "svelte";
  import diff from "microdiff";

  import { i18n } from "@/js/i18n.js";
  import { FC } from "@/js/fc.svelte.js";
  import { reinitialiseConnection } from "@/js/serial_backend";

  import Page from "@/components/Page.svelte";
  import Throttle from "./Throttle.svelte";
  import RPM from "./RPM.svelte";
  import Telemetry from "./Telemetry.svelte";
  import Governor from "./Governor.svelte";
  import RotorSpeed from "./RotorSpeed.svelte";
  import Override from "./Override.svelte";

  let loading = $state(true);
  let initialState;

  let protocol = $derived(FC.MOTOR_CONFIG.motor_pwm_protocol);
  let isDshot = $derived(protocol >= 5 && protocol < 9);
  let isEnabled = $derived(protocol < 9 && FC.CONFIG.motorCount > 0);

  function snapshotState() {
    return $state.snapshot({
      RX_CONFIG: FC.RX_CONFIG,
      RXFAIL_CONFIG: FC.RXFAIL_CONFIG,
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
    await MSP.promise(MSPCodes.MSP_STATUS);
    await MSP.promise(MSPCodes.MSP_ARMING_CONFIG);
    await MSP.promise(MSPCodes.MSP_FEATURE_CONFIG);
    await MSP.promise(MSPCodes.MSP_ADVANCED_CONFIG);
    await MSP.promise(MSPCodes.MSP_BATTERY_CONFIG);
    await MSP.promise(MSPCodes.MSP_MIXER_CONFIG);
    await MSP.promise(MSPCodes.MSP_MOTOR_CONFIG);
    await MSP.promise(MSPCodes.MSP_MOTOR_OVERRIDE);
    await MSP.promise(MSPCodes.MSP_GOVERNOR_CONFIG);
    await MSP.promise(MSPCodes.MSP_GOVERNOR_PROFILE);
    await MSP.promise(MSPCodes.MSP_ESC_SENSOR_CONFIG);
    await MSP.promise(MSPCodes.MSP_SERIAL_CONFIG);

    initialState = snapshotState();
    loading = false;
  });

  export async function onSave() {
    function save(code) {
      return MSP.promise(code, mspHelper.crunch(code));
    }

    await mspHelper.sendRxFailConfig();
    await save(MSPCodes.MSP_SET_FAILSAFE_CONFIG);
    await save(MSPCodes.MSP_SET_RX_CONFIG);

    await MSP.promise(MSPCodes.MSP_EEPROM_WRITE);
    GUI.log($i18n.t("eepromSaved"));
    MSP.send_message(MSPCodes.MSP_SET_REBOOT);
    GUI.log($i18n.t("deviceRebooting"));
    reinitialiseConnection();
  }

  export function onRevert() {
    Object.assign(FC.RX_CONFIG, initialState.RX_CONFIG);
    Object.assign(FC.RXFAIL_CONFIG, initialState.RXFAIL_CONFIG);
    FC.FEATURE_CONFIG.features.bitfield = initialState.features;
  }

  function onClickHelp() {
    window.open(getTabHelpURL("tabMotors"), "_system");
  }

  export function isDirty() {
    return changes.length > 0;
  }
</script>

{#snippet header()}
  <h1>{$i18n.t("tabMotors")}</h1>
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
      <Throttle />
      {#if isEnabled}
        <Telemetry />
        <RPM />
        <Governor />
      {/if}
    </div>
    <div class="column">
      {#if isEnabled}
        <RotorSpeed />
        <Override />
      {/if}
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

  .fallback-group {
    display: flex;
    flex-direction: row;
    gap: 8px;
  }

  .help-btn {
    padding: 4px 8px;
    min-width: 60px;
  }

  .grow {
    flex-grow: 1;
  }

  button {
    @extend %button;
  }
</style>
