<script context="module">
  export function preload({ params, query }) {
    return this.fetch(`curated/dev.json`)
      .then(r => r.json())
      .then(items => {
        return { items };
      });
  }
</script>

<script>
  import { pageIn, pageOut } from "../../_page_transition";
  import { fly } from 'svelte/transition';
  export let items;
  export let segment = 'dev';
</script>

<svelte:head>
  <title>Curated</title>
</svelte:head>

<div in:fly={pageIn} out:fly={pageOut}>
  <h1 class="h-entry">Dev</h1>
  <div class="row feedlyTagIndex">
    <div class="col">
      <ul class="list-group">
        {#each items as item}
          <a
            class="list-group-item"
            href="/curated/{segment}/{item.published}"
            title="item.title">
            <h5>{item.title}</h5>
            <small class="text-muted">
              &emsp;{new Date(item.published).toLocaleDateString('en-US')} | {item.origin.title}
            </small>
          </a>
        {/each}
      </ul>
    </div>
  </div>
</div>
