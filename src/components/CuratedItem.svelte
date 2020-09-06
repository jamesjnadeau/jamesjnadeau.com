<script>
export let item;
let url = item.canonicalUrl.replace('http:', '');
let visual_url = false;
if (!!item.visual && !!item.visual.url && item.visual.url != 'none') {
    visual_url = item.visual.url.replace('http:', '');
}
</script>

<div class="content">
    <h1 class="h-entry">{item.title}</h1>
    <div class="row justify-content-between p-1">
      <div class="col">
        {new Date(item.published).toLocaleDateString('en-US')}&emsp;-&emsp;
        <span title="Engagement metric from Feedly">
          <span class="glyphicon glyphicon-thumbs-up" />
          🖒&nbsp;{item.engagement}
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
        <a
          href={url}
          target="_blank"
          rel="noopener">
	        <img alt="article related image - sorry, alt not available from feedly" class="card-img-top" src={visual_url} />
        </a>
      {/if}
      
      <div class="card-body">
        <div class="e-content feedly-content" >
          <h4 class="text-center">
            {#if item.entities}
              {#each item.entities as entity}
                <span class="badge badge-secondary">
                  {entity.label}
                </span>
                &emsp;
              {/each}
            {/if}
            {#if item.categories}
              {#each item.categories as entity}
                <span class="badge badge-secondary">
                  {entity.label}
                </span>
                &emsp;
              {/each}
            {/if}
          </h4>
          <hr class="space" />
          <div class="text-center">
            <a href={url}
              class="btn btn-lg btn-primary"
              target="_blank"
              rel="noopener">
              View Source
            </a>
          </div>
        </div>
      </div>
    </div>
    <hr class="space" />
    
    <details>
      <summary class="small">view data</summary>
      <pre class="hidden">{JSON.stringify(item, null, 2)}</pre>
    </details>

  </div>
