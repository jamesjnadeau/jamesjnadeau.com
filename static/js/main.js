import 'bootstrap';
import barba from '@barba/core';
import Headroom from "headroom.js";
import Combokeys from "combokeys";


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

/*
    Content Editor section
*/
const start_editor = function() {
    import('../contentTools/editor.js').then(() => {
        console.log('Content tools loaded');
    });
};
const start_login = function() {
    import('netlify-identity-widget').then((netlifyIdentity) => {
        netlifyIdentity.init();
        
        // netlifyIdentity.open(); // open the modal
        netlifyIdentity.open('login'); // open the modal to the login tab
        // netlifyIdentity.open('signup'); // open the modal to the signup tab
        
        netlifyIdentity.on('init', user => console.log('init', user));
        netlifyIdentity.on('login', user => {
            console.log('login', user);
            start_editor();
        });
        netlifyIdentity.on('logout', () => console.log('Logged out'));
        netlifyIdentity.on('error', err => console.error('Error', err));
        netlifyIdentity.on('open', () => console.log('Widget opened'));
        netlifyIdentity.on('close', () => console.log('Widget closed'));
    });
};


var combokeys = new Combokeys(document.documentElement);
combokeys.bind(['command+l', 'ctrl+l'], function() {
    console.log('command l or control l');
    // return false to prevent default browser behavior
    // and stop event from bubbling
    start_login();
    return false;
});

// konami code!
combokeys.bind('up up down down left right left right b a enter', function() {
    console.log('konami code');
});