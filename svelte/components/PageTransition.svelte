<script>
  // from https://stackoverflow.com/a/57539275
	import { fly } from 'svelte/transition';

  import { sineOut } from "svelte/easing";

  let duration = 500;
  let distance = 1000

  let inDelay = duration + 100;
  let outDelay = 0;


  export const pageIn = {
    x: distance,
    duration,
    delay: inDelay,
  }


  export const pageOut = {
    x: -distance,
    duration,
    delay: outDelay,
  }
</script>

<div in:fly={pageIn} out:fly={pageOut} >
  <slot></slot>
</div>