<script context="module">
	let directory = 'projects';
	export async function preload({ params, query }) {
		// the `slug` parameter is available because
		// this file is called [slug].svelte
		
		const res = await this.fetch(directory + `/${params.slug}.json`);
		const data = await res.json();

		if (res.status === 200) {
			return { post: data };
		} else {
			this.error(res.status, data.message);
		}
	}
</script>

<script>
	import { fadeIn, fadeOut } from "../_page_fade";
	export let post;
</script>


<svelte:head>
	<title>{post.title}</title>
</svelte:head>

<div in:fadeIn out:fadeOut>
	<div class='content'>
		{@html post.html}
	</div>
</div>
