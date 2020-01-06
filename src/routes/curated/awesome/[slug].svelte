<script context="module">
  let directory = "curated";
  let segment = 'awesome';
  export async function preload({ params, query }) {
    

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
  import CuratedItem from '../../../components/CuratedItem.svelte';
  import { pageIn, pageOut } from "../../_page_transition";
  import { fly } from 'svelte/transition';
  export let item;
  let url = item.origin.htmlUrl.replace('http:', '');
</script>

<svelte:head>
  <title>{item.title}</title>
</svelte:head>

<div in:fly={pageIn} out:fly={pageOut}>
  <CuratedItem item={item} />
</div>
