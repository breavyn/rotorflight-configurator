<script>
  import semver from "semver";
  import { onMount } from "svelte";
  import diff from "microdiff";

  import { i18n } from "@/js/i18n.js";
  import { FC } from "@/js/fc.svelte.js";
  import { reinitialiseConnection } from "@/js/serial_backend";
  import { MSPCodes } from "@/js/msp/MSPCodes.js";

  import Field from "@/components/Field.svelte";
  import NumberInput from "@/components/NumberInput.svelte";
  import Page from "@/components/Page.svelte";
  import Section from "@/components/Section.svelte";
  import SubSection from "@/components/SubSection.svelte";
  import Tooltip from "@/components/Tooltip.svelte";
  import { API_VERSION_12_8 } from "@/js/data_storage";

  let loading = $state(true);
  let initialState;

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
    await MSP.promise(MSPCodes.MSP_FEATURE_CONFIG);
    await MSP.promise(MSPCodes.MSP_RXFAIL_CONFIG);
    await MSP.promise(MSPCodes.MSP_RX_CONFIG);

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
    window.open(getTabHelpURL("tabFailsafe"), "_system");
  }

  export function isDirty() {
    return changes.length > 0;
  }
</script>

{#snippet header()}
  <h1>{$i18n.t("tabMixer")}</h1>
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
      <Section label="mixerMainRotorSettings">
        <SubSection>
          <Field label="mixerSwashType">
            {#snippet tooltip()}
              <Tooltip help="mixerSwashTypeHelp" />
            {/snippet}
            <select></select>
          </Field>
          <Field label="mixerMainRotorDirection">
            {#snippet tooltip()}
              <Tooltip help="mixerMainRotorDirectionHelp" />
            {/snippet}
            <select bind:value={FC.MIXER_CONFIG.main_rotor_dir}>
              <option value={0}>{$i18n.t("mixerClockwise")}</option>
              <option value={1}>{$i18n.t("mixerCounterClockwise")}</option>
            </select>
          </Field>
          <Field label="mixerAileronDirection">
            {#snippet tooltip()}
              <Tooltip help="mixerAileronDirectionHelp" />
            {/snippet}
            <select>
              <option value={1}>{$i18n.t("mixerDirectionNormal")}</option>
              <option value={-1}>{$i18n.t("mixerDirectionReverse")}</option>
            </select>
          </Field>
          <Field label="mixerElevatorDirection">
            {#snippet tooltip()}
              <Tooltip help="mixerElevatorDirectionHelp" />
            {/snippet}
            <select>
              <option value={1}>{$i18n.t("mixerDirectionNormal")}</option>
              <option value={-1}>{$i18n.t("mixerDirectionReverse")}</option>
            </select>
          </Field>
          <Field label="mixerCollectiveDirection">
            {#snippet tooltip()}
              <Tooltip help="mixerCollectiveDirectionHelp" />
            {/snippet}
            <select>
              <option value={1}>{$i18n.t("mixerDirectionNormal")}</option>
              <option value={-1}>{$i18n.t("mixerDirectionReverse")}</option>
            </select>
          </Field>
        </SubSection>
      </Section>
      <Section label="mixerGeometrySettings">
        <SubSection>
          <Field
            id="cyclic-calibration"
            label="mixerCyclicCalibration"
            unit="%"
          >
            {#snippet tooltip()}
              <Tooltip help="mixerCyclicCalibrationHelp" />
            {/snippet}
            <NumberInput
              id="cyclic-calibration"
              min="20"
              max="200"
              step="0.1"
              bind:value={
                () => FC.MIXER_INPUTS[1].rate * 0.1,
                (v) => (FC.MIXER_INPUTS[1].rate = v * 10)
              }
            />
          </Field>
          <Field
            id="collective-calibration"
            label="mixerCollectiveCalibration"
            unit="%"
          >
            {#snippet tooltip()}
              <Tooltip help="mixerCollectiveCalibrationHelp" />
            {/snippet}
            <NumberInput
              id="collective-calibration"
              min="20"
              max="200"
              step="0.1"
              bind:value={
                () => FC.MIXER_INPUTS[4].rate * 0.1,
                (v) => (FC.MIXER_INPUTS[4].rate = v * 10)
              }
            />
          </Field>
          <Field
            id="collective-geo-correction"
            label="mixerCollectiveGeoCorrection"
            unit="%"
          >
            {#snippet tooltip()}
              <Tooltip help="mixerCollectiveGeoCorrectionHelp" />
            {/snippet}
            <NumberInput
              id="collective-geo-correction"
              min="-25"
              max="25"
              step="0.2"
              bind:value={
                () => FC.MIXER_CONFIG.coll_geo_correction * 0.2,
                (v) => (FC.MIXER_CONFIG.coll_geo_correction = v * 5)
              }
            />
          </Field>
          <Field id="cyclic-limit" label="mixerCyclicLimit" unit="°">
            {#snippet tooltip()}
              <Tooltip help="mixerCyclicLimitHelp" />
            {/snippet}
            <NumberInput
              id="cyclic-limit"
              min="0"
              max="20"
              step="0.1"
              bind:value={
                () => (FC.MIXER_INPUTS[2].max * 12) / 1000,
                (v) => (FC.MIXER_INPUTS[2].max = (v * 1000) / 12)
              }
            />
          </Field>
          <Field id="collective-limit" label="mixerCollectiveLimit" unit="°">
            {#snippet tooltip()}
              <Tooltip help="mixerCollectiveLimitHelp" />
            {/snippet}
            <NumberInput
              id="collective-limit"
              min="0"
              max="20"
              step="0.1"
              bind:value={
                () => (FC.MIXER_INPUTS[4].max * 12) / 1000,
                (v) => (FC.MIXER_INPUTS[4].max = (v * 1000) / 12)
              }
            />
          </Field>
          <Field label="mixerTotalPitchLimit" unit="°">
            {#snippet tooltip()}
              <Tooltip help="mixerTotalPitchLimitHelp" />
            {/snippet}
            <NumberInput
              min="0"
              max="36"
              step="0.1"
              bind:value={
                () => (FC.MIXER_CONFIG.blade_pitch_limit * 12) / 1000,
                (v) => (FC.MIXER_CONFIG.blade_pitch_limit = (v * 1000) / 12)
              }
            />
          </Field>
          <Field label="mixerSwashPhase" unit="°">
            {#snippet tooltip()}
              <Tooltip help="mixerSwashPhaseHelp" />
            {/snippet}
            <NumberInput
              min="-180"
              max="180"
              step="0.1"
              bind:value={
                () => FC.MIXER_CONFIG.swash_phase * 0.1,
                (v) => (FC.MIXER_CONFIG.swash_phase = v * 10)
              }
            />
          </Field>
          {#if semver.gte(FC.CONFIG.apiVersion, API_VERSION_12_8)}
            <Field label="mixerCollectiveTiltCorrectionPos" unit="%">
              {#snippet tooltip()}
                <Tooltip help="mixerCollectiveTiltCorrectionHelp" />
              {/snippet}
              <NumberInput
                min="-100"
                max="100"
                step="1"
                bind:value={FC.MIXER_CONFIG.coll_tilt_correction_pos}
              />
            </Field>
            <Field label="mixerCollectiveTiltCorrectionNeg" unit="%">
              {#snippet tooltip()}
                <Tooltip help="mixerCollectiveTiltCorrectionHelp" />
              {/snippet}
              <NumberInput
                min="-100"
                max="100"
                step="1"
                bind:value={FC.MIXER_CONFIG.coll_tilt_correction_neg}
              />
            </Field>
          {/if}
        </SubSection>
      </Section>
    </div>
    <div class="column">
      <Section label="mixerSwashLinkTrim" summary="mixerSwashTrimHelp">
        <SubSection>
          <Field label="mixerSwashRollTrim" unit="%">
            <NumberInput min="-100" max="100" step="0.1" />
          </Field>
          <Field label="mixerSwashPitchTrim" unit="%">
            <NumberInput min="-100" max="100" step="0.1" />
          </Field>
          <Field label="mixerSwashCollectiveTrim" unit="%">
            <NumberInput min="-100" max="100" step="0.1" />
          </Field>
        </SubSection>
      </Section>
      <Section label="mixerTailRotorSettings">
        <SubSection>
          <Field label="mixerTailRotorMode">
            {#snippet tooltip()}
              <Tooltip help="mixerTailRotorModeHelp" />
            {/snippet}
            <select>
              <option value={0}>{$i18n.t("mixerTailVariablePitch")}</option>
              <option value={1}>{$i18n.t("mixerTailMotorized")}</option>
              <option value={2}>{$i18n.t("mixerTailBidirectional")}</option>
            </select>
          </Field>
          <Field label="mixerTailRotorDirection">
            {#snippet tooltip()}
              <Tooltip help="mixerTailRotorDirectionHelp" />
            {/snippet}
            <select>
              <option value={1}>{$i18n.t("mixerDirectionNormal")}</option>
              <option value={-1}>{$i18n.t("mixerDirectionReverse")}</option>
            </select>
          </Field>
          <Field label="mixerTailRotorCenterTrim">
            {#snippet tooltip()}
              <Tooltip help="mixerTailRotorCenterTrimHelp" />
            {/snippet}
            <NumberInput min="-25" max="25" step="0.1" />
          </Field>
          <Field label="mixerTailMotorCenterTrim" unit="%">
            {#snippet tooltip()}
              <Tooltip help="mixerTailMotorCenterTrimHelp" />
            {/snippet}
            <NumberInput min="-50" max="50" step="0.1" />
          </Field>
          <Field label="mixerTailRotorCalibration" unit="%">
            {#snippet tooltip()}
              <Tooltip help="mixerTailRotorCalibrationHelp" />
            {/snippet}
            <NumberInput min="10" max="500" step="0.1" />
          </Field>
          <Field label="mixerTailRotorMinYaw" unit="°">
            {#snippet tooltip()}
              <Tooltip help="mixerTailRotorMinYawHelp" />
            {/snippet}
            <NumberInput min="0" max="60" step="0.1" />
          </Field>
          <Field label="mixerTailRotorMaxYaw" unit="°">
            {#snippet tooltip()}
              <Tooltip help="mixerTailRotorMaxYawHelp" />
            {/snippet}
            <NumberInput min="0" max="60" step="0.1" />
          </Field>
          <Field label="mixerTailMotorMinYaw" unit="%">
            {#snippet tooltip()}
              <Tooltip help="mixerTailMotorMinYawHelp" />
            {/snippet}
            <NumberInput min="0" max="200" step="1" />
          </Field>
          <Field label="mixerTailMotorMaxYaw" unit="%">
            {#snippet tooltip()}
              <Tooltip help="mixerTailMotorMaxYawHelp" />
            {/snippet}
            <NumberInput min="0" max="200" step="1" />
          </Field>
          <Field label="mixerTailMotorIdle" unit="%">
            {#snippet tooltip()}
              <Tooltip help="mixerTailMotorIdleHelp" />
            {/snippet}
            <NumberInput min="0" max="25" step="0.1" />
          </Field>
        </SubSection>
      </Section>
    </div>
    <div class="override-container">
      <Section label="mixerOverride" summary="mixerOverrideHelp"></Section>
    </div>
  </div>
</Page>

<style lang="scss">
  .content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: var(--section-gap);
  }

  .column {
    display: flex;
    flex-direction: column;
    gap: var(--section-gap);
  }

  .override-container {
    grid-column: 1 / -1;
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
