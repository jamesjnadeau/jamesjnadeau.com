<script>
  // from https://stackoverflow.com/a/57539275
	import { fly } from 'svelte/transition';
  import { sineOut } from "svelte/easing";
  import { onMount } from "svelte";
  import textillate from '../utils/textilate';
  let page;

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

  onMount(() => {
    let   h1s = page.querySelectorAll('h1:not(.no-animation)')
    console.log('h1s', h1s);
    const animations = ['rubberBand', 'bounce', 'tada', 'shake', 'flash', 'pulse',
      'shake', 'swing', 'wobble'];
    const animation_delay = 42;
    const get_animation = function() {
      return animations[Math.floor(Math.random() * animations.length)];
    };
    h1s.forEach(function(h1) {
      textillate(h1, {
        // initialDelay: 9000,
        initialDelay: 0,
        loop: true,
        minDisplayTime: 7000,
        in: {
          effect: get_animation,
          delay: animation_delay,
        },
        out: {
          effect: get_animation,
          reverse: true,
          delay: animation_delay,
        },
      })
    });
  });
</script>

<div in:fly={pageIn} out:fly={pageOut} bind:this={page}>
  <slot></slot>
</div>