<script>
  import { i18n } from "@/js/i18n.js";

  import Page from "@/components/Page.svelte";
</script>

{#snippet header()}
  <h1>{$i18n.t("tabEscProg")}</h1>
  <div class="grow"></div>
  <button class="help-btn" onclick={onClickHelp}>Help</button>
{/snippet}

<Page {header}></Page>

<style lang="scss">
  button {
    border-radius: 2px;
    padding: 8px;
    transition: var(--animation-speed);

    :global(html[data-theme="light"]) & {
      border: none;
      color: var(--color-neutral-800);
      background-color: var(--color-neutral-300);

      &:hover {
        background-color: var(--color-neutral-200);
      }

      &:active {
        background-color: var(--color-neutral-400);
      }

      &:disabled {
        color: var(--color-neutral-500);
        background-color: var(--color-neutral-200);
        cursor: not-allowed;
      }
    }

    :global(html[data-theme="dark"]) & {
      border: none;
      color: var(--color-neutral-900);
      background-color: var(--color-neutral-200);

      &:hover {
        background-color: var(--color-neutral-300);
      }

      &:active {
        background-color: var(--color-neutral-400);
      }

      &:disabled {
        color: var(--color-neutral-700);
        background-color: var(--color-neutral-500);
        cursor: not-allowed;
      }
    }
  }

  .grow {
    flex-grow: 1;
  }
</style>
