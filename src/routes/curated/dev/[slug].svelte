<script context="module">
  import CuratedItem from '../../../components/CuratedItem.svelte';
  let directory = "curated";
  let segment = 'dev';
  export async function preload({ params, query }) {
    // the `slug` parameter is available because
    // this file is called [slug].svelte

    const res = await this.fetch(`${directory}/${segment}/${params.slug}.json`);
    const data = await res.json();

    if (res.status === 200) {
      return { item: data };
    } else {
      this.error(res.status, data.message);
    }
  }
</script>

<script>
  import PageTransition from "../../../components/PageTransition";
  export let item;
  
</script>

<svelte:head>
  <title>{item.title}</title>
</svelte:head>


<PageTransition>
  <CuratedItem item={item} />
</PageTransition>
