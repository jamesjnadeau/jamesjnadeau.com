import 'bootstrap';
import barba from '@barba/core';
import Headroom from "headroom.js";


//
// Headroom.js
// hide the header on scroll
let init_headroom = function() {
    // grab an element
    var myElement = document.querySelector("#header");

    // global Headroom
    // construct an instance of Headroom, passing the element
    var headroom = new Headroom(myElement); // eslint-disable-line
    // initialise
    headroom.init();
};
init_headroom();

//
// Barba
//
var inAnimationClass = 'fadeInRight';
var outAnimationClass = 'fadeOutLeft';
barba.init({
    transitions: [{
        name: 'default-transition',
        leave(data) {
            let target = data.current.container
            target.classList.remove(inAnimationClass);
            target.classList.add(outAnimationClass);
            var promise = new Promise(function(resolve, reject) {
                target.addEventListener('animationend', function(event) {
                    target.style.display = 'none'; // hide leaving page after animation is complete
                    resolve();
                },{once: true}); // remove event after run once
            });
            return promise;
        },
        enter(data) {
            let target = data.next.container
            target.classList.remove('animated');
            var promise = new Promise(function(resolve, reject) {
                target.addEventListener('animationend', function(event) {
                    resolve();
                },{once: true}); // remove event after run once
            });
            target.classList.add('animated')
            return promise;
        }
    }]
});

if(true) {
    import('../contentTools/editor.js').then(() => {
        console.log('Content tools loaded');
    });
} 