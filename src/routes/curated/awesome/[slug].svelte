<script context="module">
  let directory = "curated";
  let segment = 'awesome';
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
  import { fadeIn, fadeOut } from "../../_page_fade";
  export let item;
  let url = item.origin.htmlUrl.replace('http:', '');
</script>

<svelte:head>
  <title>{item.title}</title>
</svelte:head>

<div in:fadeIn out:fadeOut>
  <div class="content">
    <h1 class="h-entry">{item.title}</h1>
    <div class="row justify-content-between p-1">
      <div class="col">
        {new Date(item.published).toLocaleDateString('en-US')}&emsp;|&emsp;
        <span title="Engagement metric from Feedly">
          <span class="glyphicon glyphicon-thumbs-up" />
          &nbsp;{item.engagement}
        </span>
      </div>
      <div class="col text-right">
        <span>
          &emsp; Published by
          <span class="p-author h-card" rel="author">
            {item.author} |&nbsp;
          </span>
          <a href={url} rel="noopener">
            {item.origin.title}
          </a>
        </span>
      </div>
    </div>
    <hr class="space" />
    <div class="card card-default">
      <var>
        
      </var>
	  <img class="card-img-top" src={item.visual.url.replace('http:', '')} />
      <div class="card-body">
        <div class="e-content feedly-content" />
      </div>
    </div>
    <hr class="space" />
    <a
	  href={url}
      class="btn btn-sm btn-primary float-right"
      target="_blank"
      rel="noopener">
      View Source
    </a>
    <details>
      <summary class="small">view data</summary>
      <pre class="hidden">{JSON.stringify(item, null, 2)}</pre>
    </details>

  </div>
</div>
