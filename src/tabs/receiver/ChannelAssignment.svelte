<script>
  import { FC } from "@/js/fc.svelte.js";
  import { i18n } from "@/js/i18n.js";

  import Field from "@/components/Field.svelte";
  import NumberInput from "@/components/NumberInput.svelte";
  import Tooltip from "@/components/Tooltip.svelte";
  import Section from "@/components/Section.svelte";
  import SubSection from "@/components/SubSection.svelte";
  import Meter from "@/components/Meter.svelte";

  const channelNames = [
    "controlAxisRoll",
    "controlAxisPitch",
    "controlAxisYaw",
    "controlAxisCollective",
    "controlAxisThrottle",
    "controlAxisAux1",
    "controlAxisAux2",
    "controlAxisAux3",
    "controlAxisAux4",
    "controlAxisAux5",
    "controlAxisAux6",
    "controlAxisAux7",
    "controlAxisAux8",
    "controlAxisAux9",
    "controlAxisAux10",
    "controlAxisAux11",
    "controlAxisAux12",
    "controlAxisAux13",
    "controlAxisAux14",
    "controlAxisAux15",
    "controlAxisAux16",
    "controlAxisAux17",
    "controlAxisAux18",
    "controlAxisAux19",
    "controlAxisAux20",
    "controlAxisAux21",
    "controlAxisAux22",
    "controlAxisAux23",
    "controlAxisAux24",
    "controlAxisAux25",
    "controlAxisAux26",
    "controlAxisAux27",
  ];

  const channels = $state([]);
  FC.RC_MAP.length;
  FC.RC.active_channels;
</script>

<Section label="receiverBars" summary="receiverBarsHelp">
  <SubSection>
    <div class="channel-group">
      {#each { length: FC.RC_MAP.length } as _, i (i)}
        <span>CH{i + 1}</span>
        <span>{$i18n.t(channelNames[i])}</span>
        <Meter leftLabel="left" value={100} rightLabel="right"/>
      {/each}
    </div>
  </SubSection>
</Section>

<style lang="scss">
  .channel-group {
    display: grid;
    grid-template-columns: auto auto 1fr;
    column-gap: var(--section-gap);
    row-gap: 8px;
    align-items: center;
  }
</style>
