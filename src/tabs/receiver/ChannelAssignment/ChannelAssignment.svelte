<script>
  import { FC } from "@/js/fc.svelte.js";
  import { i18n } from "@/js/i18n.js";

  import Section from "@/components/Section.svelte";
  import SubSection from "@/components/SubSection.svelte";
  import ChannelBar from "./ChannelBar.svelte";

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

  // FC.RC_MAP
  // FC.RC.active_channels
  // FC.RC.channels

  function swapAssignment(a, b) {
    const current = FC.RC_MAP[a];
    FC.RC_MAP[FC.RC_MAP.indexOf(b)] = current;
    FC.RC_MAP[a] = b;
  }
</script>

<Section label="receiverBars" summary="receiverBarsHelp">
  <SubSection>
    <div class="channel-group">
      {#each { length: FC.RC_MAP.length } as _, i (i)}
        <span class="channel-index">{i + 1}</span>
        <select bind:value={() => FC.RC_MAP[i], (x) => swapAssignment(i, x)}>
          {#each channelNames.slice(0, FC.RC_MAP.length) as channel, i (i)}
            <option value={i}>{$i18n.t(channel)}</option>
          {/each}
        </select>
        <!-- <span>{$i18n.t(channelNames[i])}</span> -->
        <ChannelBar channel={i} />
      {/each}
      {#each { length: FC.RC.active_channels - FC.RC_MAP.length } as _, i (i)}
        {@const channel = i + FC.RC_MAP.length}
        <span class="channel-index">{channel + 1}</span>
        <span class="channel-assignment">{$i18n.t(channelNames[channel])}</span>
        <ChannelBar {channel} />
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
    padding: 4px;
  }

  .channel-index {
    text-align: right;
  }

  .channel-assignment {
    padding-left: 8px;
  }
</style>
