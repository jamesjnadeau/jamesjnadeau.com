<script context="module"> 
  const directory = 'presentations'; 
  export async function preload({ params, query }) { 
    const slug = params.slug;

    const res = await this.fetch(directory + `/${params.slug}.json`); 
    const post = await res.json();

    if (res.status === 200) { 
    return { 
      post, 
      slug, 
      directory 
    }; 
   } else { 
     this.error(res.status, data.message); 
   } 
  }
</script>

<script> 
  import { pageIn, pageOut } from "../_page_transition"; 
  import { fly } from 'svelte/transition'; 
  export let post;
  export let slug;
  export let directory;
  console.log(slug);
</script>


<svelte:head> 
  <title>{post.title}</title>
</svelte:head>

<PageTransition> 
  
  <div class="card">
    <iframe 
      title="{post.title} | James J Nadeau"
      height="800vh" width="100%"
      src="/{directory}/iframe-{slug}"> 
    </iframe>  
  </div>
  <div class="text-center mt-3">
      <a class="btn btn-primary btn-lg" href="/{directory}/iframe-{slug}" target="_blank" >View Fullscreen</a>
    </div>
</div>
