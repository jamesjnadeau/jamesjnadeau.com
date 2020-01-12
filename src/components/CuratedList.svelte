<script>
    export let items;
    export let segment;
</script>

<div class="row feedlyTagIndex">
    <div class="col">
      <ul class="list-group">
        {#each items as item}
          <a
            class="list-group-item"
            href="/curated/{segment}/{item.published}"
            title={item.title}>
            <h5>{item.title}</h5>
            <small class="text-muted">
              &emsp;{new Date(item.published).toLocaleDateString('en-US')} | {item.origin.title}
              &emsp;&emsp;&emsp;
              {#if item.entities}
                {#each item.entities as entity}
                  <span class="badge badge-secondary">
                    {entity.label}
                  </span>
                  &emsp;
                {/each}
              {/if}
            </small>
          </a>
        {/each}
      </ul>
    </div>
  </div>