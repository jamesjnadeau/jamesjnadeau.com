<script context="module">
  export function preload({ params, query }) {
    return this.fetch(`curated/walter.json`)
      .then(r => r.json())
      .then(items => {
        return { items };
      });
  }
</script>

<script>
  import PageTransition from "../../../components/PageTransition";
  import CuratedList from '../../../components/CuratedList.svelte';
  export let items;
  export let segment = 'walter';
</script>

<svelte:head>
  <title>Curated</title>
</svelte:head>

<PageTransition>
  <h1 class="h-entry">Cute Things</h1>
  <CuratedList items={items} segment={segment} />
</PageTransition>
