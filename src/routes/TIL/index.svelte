<script context="module">
  export function preload({ params, query }) {
    return this.fetch(`TIL.json`)
      .then(r => r.json())
      .then(posts => {
        return { posts };
      });
  }
</script>

<script>
  import { fadeIn, fadeOut } from "../_page_fade";
  export let posts;
</script>

<style>
  ul {
    margin: 0 0 1em 0;
    line-height: 1.5;
  }
</style>

<svelte:head>
  <title>Today I ...</title>
</svelte:head>

<div in:fadeIn out:fadeOut>
  <h1 class="no-animation">
    Today I ...
    <br />
    <span class="lead">[ Found, Learned, Saw, Read, Experienced, Grew ]</span>
  </h1>
  <p class="lead text-center">
    A collection of things I found interesting at the time.
  </p>
  <!-- <p class="text-center">
    <a href="rss.xml" target="_blank">
      <img src="/files/rss.svg" height="20px" />
    </a>
  </p> -->
  <div class="row">
    <div class="col-md-8 offset-md-2">
      <ul class="list-group">
        {#each posts as post}
        <!-- <h3 class="list-group-item text-center">2019</h3> -->
          <a
            class="list-group-item"
            rel="prefetch" href="TIL/{post.slug}">
            <!-- <b>8/19</b> -->
            {post.title}
          </a>
        {/each}
      </ul>
    </div>
  </div>
</div>
