<script>
  import Picker from "./Picker.svelte";
  import Order from "./Order.svelte";

  let { value = $bindable([]), sensors } = $props();

  const fields = {
    get items() {
      const items = [];
      for (let i = 0; i < value.length; i++) {
        if (value[i] > 0) {
          items.push({ value: value[i] });
        }
      }

      return items;
    },
    set items(items) {
      value = items.map((x) => x.value);
    },
  };

  let view = $state("pick");
</script>

<div class="container">
  <div>
    <button onclick={() => (view = "pick")}>Pick</button>
    <button onclick={() => (view = "sort")}>Order</button>
  </div>

  {#if view === "pick"}
    <Picker bind:value={fields.items} {sensors} />
  {:else if view === "sort"}
    <Order bind:value={fields.items} {sensors} />
  {/if}
</div>

<style lang="scss">
  .container {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
</style>
