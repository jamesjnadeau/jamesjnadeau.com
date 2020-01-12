<script>
export let item;
let url = item.origin.htmlUrl.replace('http:', '');
let visual_url = false;
if (!!item.visual.url) {
    visual_url = item.visual.url.replace('http:', '');
}
</script>

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
      {#if visual_url}
	    <img alt="article related image - sorry, alt not available from feedly" class="card-img-top" src={visual_url} />
      {/if}
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