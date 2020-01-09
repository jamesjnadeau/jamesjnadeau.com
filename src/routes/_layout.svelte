<script>
  import Nav from '../components/Nav.svelte';
  import { pageIn, pageOut } from "./_page_transition";
  import { fly } from 'svelte/transition';

  export let segment;
</script>

<Nav {segment}/>

<main>
  <div id="wrap">
    <slot></slot>
  </div>
</main>