<script>
    // from https://stackoverflow.com/a/57539275
	import { fly } from 'svelte/transition';

    import { sineOut } from "svelte/easing";

    let duration = 500;
    let delay = duration + 50;

    let delayZero = 0;


    export const pageIn = {
    x: 600,
    duration,
    delay,
    }


    export const pageOut = {
    x: -600,
    duration,
    delay: delayZero,
    }
</script>

<div in:fly={pageIn} out:fly={pageOut} >
    <slot></slot>
</div>