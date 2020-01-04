

<script>
    import { fadeIn, fadeOut } from "./_page_fade";
    
</script>


<svelte:head>
	<title>Title</title>
</svelte:head>

<div in:fadeIn out:fadeOut>
	<div class='content'>
		<h1>Hi!</h1>
	</div>
</div>
