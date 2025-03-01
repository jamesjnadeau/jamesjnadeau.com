// from https://stackoverflow.com/a/57539275

import { sineOut } from "svelte/easing";

let duration = 500;
let delay = duration + 50;

let delayZero = 0;

// export const fadeIn = _ => ({
//   duration,
//   delay,
//   easing: sineOut,
//   css: t => `opacity: ${t}; x: ${t};`
// });
// export const fadeOut = _ => ({
//   duration,
//   delayZero,
//   easing: sineOut,
//   css: t => `opacity: ${t}; x: ${t};`
// });

// export const fadeIn = _ => ({
//   duration,
//   delay,
//   easing: sineOut,
//   css: t => `opacity: ${t}; x: ${t};`
// });
// export const fadeOut = _ => ({
//   duration,
//   delayZero,
//   easing: sineOut,
//   css: t => `opacity: ${t}; x: ${t};`
// });

// import { fly } from 'svelte/transition';


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