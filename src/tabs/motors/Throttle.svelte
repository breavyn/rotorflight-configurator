<script>
  import { FC } from "@/js/fc.svelte.js";
  import { i18n } from "@/js/i18n.js";
  import Field from "@/components/Field.svelte";
  import Section from "@/components/Section.svelte";
  import SubSection from "@/components/SubSection.svelte";
  import Switch from "@/components/Switch.svelte";
  import Tooltip from "@/components/Tooltip.svelte";
  import NumberInput from "@/components/NumberInput.svelte";

  const escProtocols = [
    "PWM",
    "ONESHOT125",
    "ONESHOT42",
    "MULTISHOT",
    "BRUSHED",
    "DSHOT150",
    "DSHOT300",
    "DSHOT600",
    "PROSHOT",
    "DISABLED",
  ];

  let protocol = $derived(FC.MOTOR_CONFIG.motor_pwm_protocol);
  let isEnabled = $derived(protocol < 9 && FC.CONFIG.motorCount > 0);
  let isDshot = $derived(protocol >= 5 && protocol < 9);
</script>

<Section label="Throttle">
  <SubSection>
    <Field id="esc-protocol" label="motorsEscProtocol">
      {#snippet tooltip()}
        <Tooltip help="motorsEscProtocolHelp" />
      {/snippet}
      <select id="esc-protocol" bind:value={FC.MOTOR_CONFIG.motor_pwm_protocol}>
        {#each escProtocols as proto, index}
          <option value={index}>{proto}</option>
        {/each}
      </select>
    </Field>

    {#if isEnabled && !isDshot}
      <Field id="pwm-freq" label="motorsUnsyncedPWMFreq" unit="Hz">
        {#snippet tooltip()}
          <Tooltip
            help="motorsUnsyncedPWMFreqHelp"
            attrs={[
              { name: "genericDefault", value: "250Hz" },
              { name: "genericRange", value: "0Hz - 250Hz" },
            ]}
          />
        {/snippet}
        <NumberInput
          id="pwm-freq"
          min="0"
          max="250"
          step="10"
          bind:value={FC.MOTOR_CONFIG.motor_pwm_rate}
        />
      </Field>

      <Field
        id="throttle-off-pwm"
        label="motorsThrottleMinimumCommand"
        unit="μs"
      >
        {#snippet tooltip()}
          <Tooltip
            help="motorsThrottleMinimumCommandHelp"
            attrs={[
              { name: "genericDefault", value: "1000μs" },
              { name: "genericRange", value: "50μs - 2250μs" },
            ]}
          />
        {/snippet}
        <NumberInput
          id="throttle-off-pwm"
          min="50"
          max="2250"
          bind:value={FC.MOTOR_CONFIG.mincommand}
        />
      </Field>

      <Field id="throttle-min-pwm" label="motorsThrottleMinimum" unit="μs">
        {#snippet tooltip()}
          <Tooltip
            help="motorsThrottleMinimumHelp"
            attrs={[
              { name: "genericDefault", value: "1070μs" },
              { name: "genericRange", value: "50μs - 2250μs" },
            ]}
          />
        {/snippet}
        <NumberInput
          id="throttle-min-pwm"
          min="50"
          max="2250"
          bind:value={FC.MOTOR_CONFIG.minthrottle}
        />
      </Field>

      <Field id="throttle-max-pwm" label="motorsThrottleMaximum" unit="μs">
        {#snippet tooltip()}
          <Tooltip
            help="motorsThrottleMaximumHelp"
            attrs={[
              { name: "genericDefault", value: "2000μs" },
              { name: "genericRange", value: "50μs - 2250μs" },
            ]}
          />
        {/snippet}
        <NumberInput
          id="throttle-max-pwm"
          min="50"
          max="2250"
          bind:value={FC.MOTOR_CONFIG.maxthrottle}
        />
      </Field>
    {/if}

    {#if isEnabled && !isDshot && protocol !== 0}
      <Field id="throttle-unsynced-pwm" label="motorsUnsyncedPwm">
        {#snippet tooltip()}
          <Tooltip help="motorsUnsyncedPwmHelp" />
        {/snippet}
        <Switch
          id="throttle-unsynced-pwm"
          bind:checked={FC.ESC_SENSOR_CONFIG.use_unsynced_pwm}
        />
      </Field>
    {/if}
  </SubSection>
</Section>

<style lang="scss">
</style>
