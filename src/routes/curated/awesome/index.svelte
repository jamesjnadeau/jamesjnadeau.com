<script context="module">
  export function preload({ params, query }) {
    return this.fetch(`curated/awesome.json`)
      .then(r => r.json())
      .then(items => {
        return { items };
      });
  }
</script>

<script>
  import { fadeIn, fadeOut } from "../../_page_fade";
  export let items;
  export let segment = 'awesome';
</script>

<svelte:head>
  <title>Curated</title>
</svelte:head>

<div in:fadeIn out:fadeOut>
  <h1 class="h-entry">Awesome</h1>
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
