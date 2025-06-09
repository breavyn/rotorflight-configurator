<script>
  let { title, leftLabel, rightLabel, value, max } = $props();
</script>

<div>
  <div class="top-container">
    <div class="title grow">{title}</div>
    <div>{max}</div>
  </div>
  <div class="meter">
    <div class="left-label">{leftLabel}</div>
    <div class="right-label">{rightLabel}</div>
    <div class="fill" style:width={`${value.clamp(0, 100)}%`}></div>
  </div>
</div>

<style lang="scss">
  *,
  *::before,
  *::after {
    box-sizing: content-box;
  }

  .meter {
    position: relative;
    height: 20px;
    border-radius: 2px;
    container-type: size;

    :global(html[data-theme="light"]) & {
      background: var(--color-neutral-200);
      border: 1px solid var(--color-neutral-400);
    }

    :global(html[data-theme="dark"]) & {
      background: var(--color-neutral-700);
      border: 1px solid var(--color-neutral-400);
    }
  }

  .left-label {
    position: absolute;
    height: 20px;
    line-height: 20px;
    font-weight: 600;
    z-index: 1;
    left: 8px;
  }

  .right-label {
    position: absolute;
    height: 20px;
    line-height: 20px;
    font-weight: 600;
    z-index: 1;
    right: 8px;
  }

  .fill {
    position: absolute;
    margin-top: -0.5px;
    margin-left: -0.5px;
    top: 0px;
    left: 0px;
    height: 20px;
    border-radius: 2px;

    :global(html[data-theme="light"]) & {
      background: var(--color-accent-600);
      border: 1px solid var(--color-accent-500);
    }

    :global(html[data-theme="dark"]) & {
      background: var(--color-accent-300);
      border: 1px solid var(--color-accent-400);
    }
  }

  .title {
    font-weight: 600;
  }

  .top-container {
    display: flex;
  }
</style>
