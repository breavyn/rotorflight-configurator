<script>
  import { onMount } from "svelte";
  import { FC } from "@/js/fc.svelte.js";
  import Field from "@/components/Field.svelte";
  import Section from "@/components/Section.svelte";
  import SubSection from "@/components/SubSection.svelte";
  import Switch from "@/components/Switch.svelte";
  import WarningNote from "@/components/notes/WarningNote.svelte";
  import OverrideMotor from "./OverrideMotor.svelte";

  let isEnabled = $state(false);

  $effect(() => {
    console.log("effect", isEnabled);
    isEnabled;
    onEnable();
  });

  function onEnable(checked) {
    console.log("resetMotorOverrides");
    mspHelper.resetMotorOverrides();
  }

  onMount(() => {
    console.log("Override onMount");
  });
</script>

<Section label="motorOverride">
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
