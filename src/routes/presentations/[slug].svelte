<script context="module"> 
  const Blob = require("blob");
  let directory = 'presentations'; 
  let slug; 
  export async function preload({ params, query }) { 
    slug = params.slug;

    const res = await this.fetch(directory + `/${params.slug}.json`); 
    const data = await res.json();

    if (res.status === 200) { 
    return { post: data }; 
   } else { 
     this.error(res.status, data.message); 
   } 
  }
  export const iframeDocStart = '<head><meta charset="utf-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=2.0, user-scalable=1"><meta name="author" content="James J Nadeau"><link href="/impress/built/impress_styles.css" rel="stylesheet" type="text/css">'
   + '<style>.step {width: 900px;}</style></head><body>';
  // post.html
  export const iframeDocEnd = '<div class="form-inline" id="impress-toolbar"></div><div class="impress-progressbar"><div></div></div><div class="impress-progress"></div>'
  + '<script src="/impress/built/impress.js" /></body>';
</script>

<script> 
  import { pageIn, pageOut } from "../_page_transition"; 
  import { fly } from 'svelte/transition'; 
  export let post;
  
</script>


<svelte:head> 
  <title>{post.title}</title>
</svelte:head>

<div in:fly={pageIn} out:fly={pageOut}> 
  
  <div class="card">
    <iframe 
      title="{post.title} | James J Nadeau"
      height="900vh" width="1000vw"
      src="{getSrcDoc(post)}"> 
    </iframe>  
  </div>
</div>
