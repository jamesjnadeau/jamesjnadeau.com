<script>
	import Nav from '../components/Nav.svelte';

	export let segment;
</script>

<Nav {segment}/>

<main>
	<div id="wrap">
		<div id="container" class="container">
			<slot></slot>
		</div>
	</div>
</main>