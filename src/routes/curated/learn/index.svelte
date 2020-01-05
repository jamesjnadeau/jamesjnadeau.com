<script context="module">
  export function preload({ params, query }) {
    return this.fetch(`curated/learn.json`)
      .then(r => r.json())
      .then(items => {
        return { items };
      });
  }
</script>

<script>
  import { pageIn, pageOut } from "../../_page_transition";
  import { fly } from 'svelte/transition';
  import CuratedList from '../../../components/CuratedList.svelte';
  export let items;
  export let segment = 'learn';
</script>

<svelte:head>
  <title>Curated</title>
</svelte:head>

<div in:fly={pageIn} out:fly={pageOut}>
  <h1 class="h-entry">Learn</h1>
  <CuratedList items={items} segment={segment} />
</div>
