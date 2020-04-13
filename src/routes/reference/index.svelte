
<script context="module">
	let directory = 'reference';
	export async function preload({ params, query }) {
		// the `slug` parameter is available because
		// this file is called [slug].svelte
		
		const res = await this.fetch(`${directory}.json`);
		const data = await res.json();

		if (res.status === 200) {
			return { post: data };
		} else {
			this.error(res.status, data.message);
		}
	}
</script>


<script>
  import PageTransition from "src/components/PageTransition";

  let activeTab = "quotes";
  export let post;
</script>

<svelte:head>
  <title>Reference</title>
</svelte:head>

<PageTransition>
  <h1 class="text-center">Reference</h1>
  <div class="card">
    <!-- Nav tabs-->
    <ul class="nav nav-tabs" role="tablist">
      <li class="nav-item">
        <a
          class="nav-link"
          href="#quotes"
          role="tab"
          class:active={activeTab === 'quotes'}
          on:click|preventDefault={() => (activeTab = 'quotes')}>
          quotes
        </a>
      </li>
      <li class="nav-item">
        <a
          class="nav-link"
          href="#js"
          role="tab"
          class:active={activeTab === 'js'}
          on:click|preventDefault={() => (activeTab = 'js')}>
          JS
        </a>
      </li>
      <li class="nav-item">
        <a
          class="nav-link"
          href="#git"
          role="tab"
          class:active={activeTab === 'git'}
          on:click|preventDefault={() => (activeTab = 'git')}>
          Git
        </a>
      </li>
      <li class="nav-item">
        <a
          class="nav-link"
          href="#shell"
          role="tab"
          class:active={activeTab === 'shell'}
          on:click|preventDefault={() => (activeTab = 'shell')}>
          Shell
        </a>
      </li>
      <li class="nav-item">
        <a
          class="nav-link"
          href="#php"
          role="tab"
          class:active={activeTab === 'php'}
          on:click|preventDefault={() => (activeTab = 'php')}>
          PHP
        </a>
      </li>
      <li class="nav-item">
        <a
          class="nav-link"
          href="#misc"
          role="tab"
          class:active={activeTab === 'misc'}
          on:click|preventDefault={() => (activeTab = 'misc')}>
          Misc
        </a>
      </li>
      <i class="nav-item">
        <a class="nav-link" href="/reference/windows">Windows</a>
      </i>
      <i class="nav-item">
        <a class="nav-link" href="/reference/Jupyter">Jupyter</a>
      </i>
      <i class="nav-item">
        <a class="nav-link" href="/presentations">Slides</a>
      </i>
    </ul>
    <!-- Tab panes-->
    <div class="tab-content bg-light py-3">
      {#if activeTab === 'js'}
        <div
          class="tab-pane"
          id="js"
          class:active={activeTab === 'js'}>
          <ul class="list-group m-3">
            <a class="list-group-item" href="/reference/js_backtrace">
              Backtrace
            </a>
            <a class="list-group-item" href="/reference/js_callback">
              Callback
            </a>
            <a class="list-group-item" href="/reference/js_debounce">
              Debounce
            </a>
            <a class="list-group-item" href="/reference/js_Angular">Angular</a>
            <a class="list-group-item" href="/reference/jqm_google_analytics">
              jQuery Mobile Google Analytics
            </a>
          </ul>
        </div>
      {:else if activeTab === 'git'}
        <div class="tab-pane" id="git" class:active={activeTab === 'git'}>
          <ul class="list-group m-3">
            <a class="list-group-item" href="/reference/git_flow">Flow</a>
            <a class="list-group-item" href="/reference/git_autocomplete">
              Autocomplete
            </a>
            <a class="list-group-item" href="/reference/git_local_ignore">
              Local .gitignore
            </a>
            <a class="list-group-item" href="/reference/git_theirs">
              Rebase Theirs
            </a>
          </ul>
        </div>
      {:else if activeTab === 'shell'}
        <div
          class="tab-pane"
          id="shell"
          class:active={activeTab === 'shell'}>
          <ul class="list-group m-3">
            <a class="list-group-item" href="/reference/ssh_tunnel">
              SSH Tunneling
            </a>
            <a class="list-group-item" href="/reference/bash_profile">
              Bash Profile
            </a>
            <a class="list-group-item" href="/reference/counting_log_ips">
              Counting IP Addresses in Log Files
            </a>
            <a class="list-group-item" href="/reference/yum_history">
              Yum History/Undo
            </a>
            <a class="list-group-item" href="/reference/svn_add">SVN Add</a>
          </ul>
        </div>
      {:else if activeTab === 'php'}
        <div class="tab-pane show" id="php" class:active={activeTab === 'php'}>
          <ul class="list-group m-3">
            <li class="list-group-item">
              <a href="/reference/php_backtrace">Backtrace</a>
            </li>
            <li class="list-group-item">
              <a href="/reference/php_cake_query_log">CakePHP 1.2 query log</a>
            </li>
          </ul>
        </div>
      {:else if activeTab === 'misc'}
        <div
          class="tab-pane show"
          id="misc"
          class:active={activeTab === 'misc'}>
          <ul class="list-group m-3">
            <a class="list-group-item" href="/reference/letsencrypt">
              Lets Encrypt
            </a>
            <a class="list-group-item" href="/reference/stock_photos">
              Stock Photos
            </a>
            <a
              class="list-group-item"
              href="http://www.w3.org/TR/html5/forms.html#valid-e-mail-address">
              Email Addresses
            </a>
            <a class="list-group-item" href="/reference/chromebook">
              Chromebook Crouton
            </a>
            <a class="list-group-item" href="/reference/asus_laptop">
              Asus Laptop
            </a>
            <a class="list-group-item" href="/reference/gnome3_monitor_config">
              Gnome 3 Master Monitor
            </a>
            <a class="list-group-item" href="/reference/evoulent_mouse_config">
              Evoluent Mouse config for Linux
            </a>
            <a class="list-group-item" href="/reference/gource">
              Gource defaults
            </a>
            <a class="list-group-item" href="/reference/convert-video-to-png">
              Convert Video to png
            </a>
          </ul>
        </div>
      {:else if activeTab === 'quotes'}
        <div
          class="tab-pane active"
          id="quotes">
          <div class="row justify-content-center">
            {@html post.html}  
          </div>
        </div>
      {/if}
    </div>
  </div>
</PageTransition>
