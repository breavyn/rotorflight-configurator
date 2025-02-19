<script>
  import { slide } from "svelte/transition";

  let { children, summary } = $props();

  let open = $state(false);
</script>

<div class="container" class:open>
  <!-- eslint-disable-next-line svelte/valid-compile -->
  <div class="summary" onclick={() => (open = !open)}>
    {@render summary()}
  </div>
  {#if open}
    <div class="content" transition:slide>
      {@render children?.()}
    </div>
  {/if}
</div>

<style lang="scss">
  .summary {
    font-weight: 600;
    display: flex;
    height: 2rem;
    padding: 0 4px;
    align-items: center;
    border-bottom: 1px solid var(--color-neutral-800);
    border-radius: 2px;

    cursor: pointer;
  }

  .open .summary {
    background-color: var(--color-neutral-700);
    margin-bottom: 4px;
  }

  @media (hover: hover) {
    .summary:hover {
      background-color: var(--color-neutral-800);
    }
  }
</style>
