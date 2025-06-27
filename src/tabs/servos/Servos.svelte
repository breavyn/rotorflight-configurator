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
      BOARD_ALIGNMENT_CONFIG: FC.BOARD_ALIGNMENT_CONFIG,
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
    await MSP.promise(MSPCodes.MSP_BOARD_ALIGNMENT_CONFIG);

    initialState = snapshotState();
    loading = false;
  });

  export async function onSave() {
    function save(code) {
      return MSP.promise(code, mspHelper.crunch(code));
    }

    await save(MSPCodes.MSP_SET_FEATURE_CONFIG);
    await save(MSPCodes.MSP_SET_PILOT_CONFIG);
    await save(MSPCodes.MSP_SET_SENSOR_CONFIG);
    await save(MSPCodes.MSP_SET_NAME);
    await save(MSPCodes.MSP_SET_BOARD_ALIGNMENT_CONFIG);

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
    Object.assign(
      FC.BOARD_ALIGNMENT_CONFIG,
      initialState.BOARD_ALIGNMENT_CONFIG,
    );
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
  <h1>{$i18n.t("tabServos")}</h1>
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
      <Section label="Servo Config">
        <SubSection label="Swash">
          <Field label="Pulse Width" unit="μs">
            <select>
              <option>1500μs</option>
              <option>750μs</option>
            </select>
          </Field>
          <Field label="Frequency" unit="Hz">
            <select>
              <optgroup label="Analog">
                <option>50Hz</option>
              </optgroup>
              <optgroup label="Digital">
                <option>250Hz</option>
                <option>333Hz</option>
                <option>560Hz</option>
                <option>800Hz</option>
                <option>1000Hz</option>
              </optgroup>
            </select>
          </Field>
        </SubSection>
        <SubSection label="Tail">
          <Field label="Pulse Width" unit="μs">
            <select>
              <option>1500μs</option>
              <option>750μs</option>
            </select>
          </Field>
          <Field label="Frequency" unit="Hz">
            <select>
              <optgroup label="Analog">
                <option>50Hz</option>
              </optgroup>
              <optgroup label="Digital">
                <option>250Hz</option>
                <option>333Hz</option>
                <option>560Hz</option>
                <option>800Hz</option>
                <option>1000Hz</option>
              </optgroup>
            </select>
          </Field>
        </SubSection>
        <SubSection label="Extra"></SubSection>
      </Section>
    </div>
    <div class="column"></div>
    <div class="column"></div>
    <div class="column"></div>
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
