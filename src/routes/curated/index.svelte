
<script>
  import { pageIn, pageOut } from "../_page_transition";
  import { fly } from 'svelte/transition';
</script>

<svelte:head>
  <title>Curated</title>
</svelte:head>

<div in:fly={pageIn} out:fly={pageOut}>
  <h1 class="no-animation">Curated</h1>
  <hr class="space" />
  <h5 class="text-center">Here's the latest articles I've tagged in feedly.</h5>
  <hr class="space" />
  <div class="row">
    <div class="col-md-4 offset-md-4">
      <ul class="list-group text-center">
        <a class="list-group-item" href="/curated/awesome">Awesome</a>
        <a class="list-group-item" href="/curated/dev">Dev</a>
        <!-- <a class="list-group-item" href="/curated/laugh">Laugh</a>
        <a class="list-group-item" href="/curated/learn">Learn</a>
        <a class="list-group-item" href="/curated/walter">Cute Things</a> -->
      </ul>
    </div>
  </div>

</div>
