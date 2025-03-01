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
  import PageTransition from "../../../components/PageTransition";
  export let item;
  let url = item.origin.htmlUrl.replace('http:', '');
</script>

<svelte:head>
  <title>{item.title}</title>
</svelte:head>

<PageTransition>
  <CuratedItem item={item} />
</PageTransition>
