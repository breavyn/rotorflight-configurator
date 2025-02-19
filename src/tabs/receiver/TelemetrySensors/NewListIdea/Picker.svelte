<script>
  import { i18n } from "@/js/i18n.js";
  import { TELEMETRY_SENSORS } from "../../telemetry/sensors.js";
  import Field from "@/components/Field.svelte";
  import Switch from "@/components/Switch.svelte";
  import Details from "./Details.svelte";

  let { value = $bindable([]), sensors } = $props();

  const MAX_SENSORS = 40;

  let lookup = $derived.by(() => {
    const s = new Set();
    for (const item of value) {
      if (item.value !== 0) {
        s.add(item.value);
      }
    }

    return s;
  });

  let enabledCount = $derived(lookup.size);

  let options = $derived.by(() => {
    let count = 0;
    const options = [];
    for (const group of sensors) {
      const optGroup = { title: group.title, sensors: [], count: 0 };

      for (const sensor of group.sensors) {
        const escNum = sensor.name.match(/^ESC(\d)/);
        const id = TELEMETRY_SENSORS[sensor.name];
        const enabled = lookup.has(id);
        optGroup.sensors.push({
          id,
          name: escNum ? sensor.name.replace(/^ESC\d/, "ESC") : sensor.name,
          esc: escNum && escNum[1],
          conflicts: sensor.conflicts,
          enabled,
        });
        count++;
        if (enabled) {
          optGroup.count++;
        }
      }

      options.push(optGroup);
    }

    return { groups: options, count };
  });

  function checkConflict(sensor) {
    if (!sensor.conflicts) {
      return false;
    }

    for (const conflict of sensor.conflicts) {
      return lookup.has(TELEMETRY_SENSORS[conflict]);
    }
  }

  function toggleSensor(id, enable) {
    const newValue = $state.snapshot(value);
    if (enable) {
      newValue.push({ value: id });
    } else {
      const index = newValue.findIndex((x) => x.value === id);
      newValue.splice(index, 1);
    }

    value = newValue;
  }
</script>

{#if options.count > MAX_SENSORS}
  <div>
    <span>{enabledCount}/{MAX_SENSORS}</span>
  </div>
{/if}
<div>
  {#each options.groups as optionGroup}
    <Details>
      {#snippet summary()}
        <span class="title">
          {$i18n.t(`receiverTelemetryGroup_${optionGroup.title}`)}
        </span>
        <span class="count">
          {optionGroup.count} / {optionGroup.sensors.length}
        </span>
      {/snippet}
      <div class="switch-group">
        {#each optionGroup.sensors as sensor}
          <Field
            id={`telemetry-sensor-${sensor.id}`}
            label={`receiverTelemetrySensor_${sensor.name}`}
          >
            <Switch
              id={`telemetry-sensor-${sensor.id}`}
              disabled={checkConflict(sensor)}
              bind:checked={
                () => sensor.enabled, (v) => toggleSensor(sensor.id, v)
              }
            />
          </Field>
        {/each}
      </div>
    </Details>
  {/each}
</div>

<style lang="scss">
  .title {
    flex-grow: 1;
  }

  .switch-group {
    padding: 0 4px;
    margin-bottom: 4px;
  }
</style>
