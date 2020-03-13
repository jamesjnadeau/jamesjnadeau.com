<script context="module">
	let directory = 'projects';
	export async function preload({ params, query }) {
		const res = await this.fetch(directory + `.json`);
		const data = await res.json();

		if (res.status === 200) {
			return { post: data };
		} else {
			this.error(res.status, data.message);
		}
	}
</script>

<script>
  import PageTransition from "../../components/PageTransition";
  export let post;
</script>

<svelte:head>
  <title>James J Nadeau: Projects I've Worked on</title>
</svelte:head>

<PageTransition>
  {@html post.html}
</PageTransition>
