<script>
  import { untrack } from "svelte";
  import { FC } from "@/js/fc.svelte.js";
  import Field from "@/components/Field.svelte";
  import Section from "@/components/Section.svelte";
  import SubSection from "@/components/SubSection.svelte";
  import Switch from "@/components/Switch.svelte";
  import WarningNote from "@/components/notes/WarningNote.svelte";
  import OverrideMotor from "./OverrideMotor.svelte";

  let isEnabled = $state(false);
  let pollerInterval;

  $effect(() => {
    // call resetMotorOverrides each time isEnabled is modified
    if (!isEnabled) {
      clearInterval(pollerInterval);
      pollerInterval = null;
    } else if (!pollerInterval) {
      pollerInterval = setInterval(async () => {
        await MSP.promise(MSPCodes.MSP_MOTOR);
        await MSP.promise(MSPCodes.MSP_MOTOR_TELEMETRY);
        await MSP.promise(MSPCodes.MSP_BATTERY_STATE);
      }, 100);
    }
    untrack(() => mspHelper.resetMotorOverrides());
  });
</script>

<Section label="motorOverrideTitle">
  <WarningNote message="motorOverrideNote" />
  <SubSection>
    <Field id="motor-override-enable" label="genericEnable">
      <Switch id="motor-override-enable" bind:checked={isEnabled} />
    </Field>
  </SubSection>
</Section>

{#if isEnabled}
  {#each { length: FC.CONFIG.motorCount } as _, i (i)}
    <OverrideMotor index={i} />
  {/each}
{/if}

<style lang="scss">
</style>
