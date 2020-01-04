<script>
  export let segment;
</script>

<!-- <nav>
  <ul>
    <li>
      <a class:selected={segment === undefined} href=".">home</a>
    </li>
    <li>
      <a class:selected={segment === 'projects'} href="projects">projects</a>
    </li>

    <li>
      <a rel="prefetch" class:selected={segment === 'TIL'} href="TIL">
        Today I ...
      </a>
    </li>
  </ul>
</nav> -->

<nav class="navbar navbar-expand-lg navbar-dark fixed-top" id="header">
  <div class="container p-2">
    <a class="brand navbar-brand" href="/">
      <span
        class="h-card u-url u-uid"
        rel="me"
        href="https://jamesjnadeau.com/">
        James J Nadeau
      </span>
    </a>
    <button
      class="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent"
      aria-expanded="false"
      aria-label="Toggle navigation">
      <span class="navbar-toggler-icon" />
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul
        class="navbar-nav d-flex justify-content-around align-items-center w-100">
        <a class="nav-item text-white p1" href="/projects/" class:selected={segment === 'projects'}>Projects</a>
        <a class="nav-item text-white p1" href="/TIL/" class:selected={segment === 'TIL'}>Today I ...</a>
        <a class="nav-item text-white p1" href="/curated/" class:selected={segment === 'curated'}>Curated</a>
        <a class="nav-item text-white p1" href="/reference/" class:selected={segment === 'reference'}>Reference</a>
        <a
          class="nav-item text-white p1"
          href="https://github.com/jamesjnadeau/"
          rel="me">
          <img
            class="github-logo img-fluid"
            src="/files/GitHub-Mark-Light-120px-plus.png" />
        </a>
      </ul>
    </div>
  </div>
</nav>
