let defaults = {
    selector: '.texts',
    loop: false,
    minDisplayTime: 2000,
    initialDelay: 0,
    in: {
        effect: 'fadeInLeftBig',
        delayScale: 1.5,
        delay: 50,
        sync: false,
        reverse: false,
        shuffle: false,
        callback: function () { }
    },
    out: {
        effect: 'hinge',
        delayScale: 1.5,
        delay: 50,
        sync: false,
        reverse: false,
        shuffle: false,
        callback: function () { }
    },
    autoStart: true,
    inEffects: [],
    outEffects: ['hinge'],
    callback: function () { }
};

function injector(t, klass) {
    var a = t.textContent.split('');
    let inject = '';
    if (a.length) {
        a.forEach(function(item, i) {

            inject +=  '<span class="'+klass+(i+1)+'">'+item+'</span>';
        });
        while(t.firstChild)
            t.removeChild(t.firstChild);
        // .append(inject);
        t.appendChild(document.createRange().createContextualFragment(inject).firstChild);
    }
}

function lettering(e) {
    injector(e, 'char')
}

function isInEffect(effect) {
    // if (typeof effect === 'function') {
    //     effect = effect();
    // }
    // console.log(typeof effect);
    // return /In/.test(effect) || effect.indexOf(defaults.inEffects) >= 0;
    return true;
};

function isOutEffect(effect) {
    // return /Out/.test(effect) || effect.indexOf(defaults.outEffects) >= 0;
    return true;
};


function stringToBoolean(str) {
    if (str !== "true" && str !== "false") return str;
    return (str === "true");
};

// custom get data api method
function getData(node) {
    var attrs = node.attributes || []
        , data = {};

    if (!attrs.length) return data;

    attrs.forEach(function (attr, i) {
        var nodeName = attr.nodeName.replace(/delayscale/, 'delayScale');
        if (/^data-in-*/.test(nodeName)) {
            data.in = data.in || {};
            data.in[nodeName.replace(/data-in-/, '')] = stringToBoolean(attr.nodeValue);
        } else if (/^data-out-*/.test(nodeName)) {
            data.out = data.out || {};
            data.out[nodeName.replace(/data-out-/, '')] = stringToBoolean(attr.nodeValue);
        } else if (/^data-*/.test(nodeName)) {
            data[nodeName.replace(/data-/, '')] = stringToBoolean(attr.nodeValue);
        }
    })

    return data;
}

function shuffle(o) {
    for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

function animate($c, effect, cb) {
    $c.classList.add('animated');
    $c.classList.add(effect);
    $c.style.visibility = 'visible';
    $c.style.display = ''; // show
    
    let eventName = 'animationend webkitAnimationEnd oAnimationEnd';
    function afterAnimation() {
        $c.removeEventListener(eventName, foo);
        $c.removeClass('animated ' + effect);
        cb && cb();
    }

    $c.addEventListener(eventName, afterAnimation);
}

function animateChars($chars, options, cb) {
    var that = this
        , count = $chars.length;

    if (!count) {
        cb && cb();
        return;
    }

    if (options.shuffle) $chars = shuffle($chars);
    if (options.reverse) $chars = $chars.toArray().reverse();

    $chars.forEach(function ($char, i) {
        // var $char = $(c);

        function complete() {
            if (isInEffect(options.effect)) {
                $char.style.visibility = 'visible';
            } else if (isOutEffect(options.effect)) {
                $char.style.visibility = 'hidden';
            }
            count -= 1;
            if (!count && cb) cb();
        }

        var delay = options.sync ? options.delay : options.delay * i * options.delayScale;

        $char.textContent ?
            setTimeout(function () { animate($char, options.effect, complete) }, delay) :
            complete();
    });
};

var Textillate = function (element, options) {
    var base = this;
        // , $element = $(element);

    base.init = function () {
        base.texts = element.querySelectorAll(options.selector);

        if (!base.texts.length) {
            // base.$texts = $('<ul class="texts"><li>' + element.innerHTML + '</li></ul>');
            // $element.html(base.$texts);
            // base.texts = new DOMParser()
            //     .parseFromString('<ul class="texts"><li>' + element.innerHTML + '</li></ul>', "text/xml").firstChild.innerHTML;
            base.texts = '<ul class="texts" style="display: none;"><li>' + element.innerHTML + '</li></ul>';
            element.innerHTML = base.texts;



            // let ul = document.createElement('ul');
            // ul.classList.add('texts');
            // ul.innerHTML = '<li>' + element.innerHTML + '</li>>';
            // base.texts.push(ul);
            // element.innerHTML = base.texts;
        }
        console.log(element.children)
        base.texts = element.children[0];

        // hide
        // base.texts.style.display = 'none';
        // base.texts.forEach(function(text) {
        //     console.log(text)
        //     text.style.display = 'none';
        // });

        base.current = document.createElement('span')
        base.current.textContent = base.texts.querySelector(':first-child').innerHTML
        element.insertBefore(base.current, element.firstChild);

        if (isInEffect(options.in.effect)) {
            base.current.style.visibility = 'hidden';
        } else if (isOutEffect(options.out.effect)) {
            base.current.style.visibility = 'visible';
        }

        base.setOptions(options);

        base.timeoutRun = null;

        setTimeout(function () {
            base.options.autoStart && base.start();
        }, base.options.initialDelay)
    };

    base.setOptions = function (options) {
        base.options = options;
    };

    base.triggerEvent = function (name) {
        // var e = $.Event(name + '.tlt');
        // $element.trigger(e, base);

        let eventName = name + '.tlt';
        let event;
        if (window.CustomEvent && typeof window.CustomEvent === 'function') {
            event = new CustomEvent(eventName, {detail: base});
          } else {
            event = document.createEvent('CustomEvent');
            event.initCustomEvent(eventName, true, true, base);
          }
          
          element.dispatchEvent(event);
        return event;
    };

    base.in = function (index, cb) {
        index = index || 0;
        
        var elem = base.texts.querySelector(':nth-child(' + (index + 1) + ')')
            , options = Object.assign({}, base.options, elem.length ? getData(elem) : {})
            , $chars;

        elem.classList.add('current');

        base.triggerEvent('inAnimationBegin');

        base.current.textContent = elem.innerHTML;
        lettering(base.current);

        let transform = 'translate3d(0,0,0)';
        base.current.querySelectorAll('[class^="word"]').forEach(function(e){
            e.style.display = 'inline-block';

            e.style['-webkit-transform'] = transform;
            e.style['-moz-transform'] = transform;
            e.style['-o-transform'] = transform;
            e.style.transform = transform;
            lettering(e)

        })

        var chars = base.current.querySelectorAll('[class^="char"]');
        chars.forEach(function(e) {
            e.style.display =  'inline-block';
        });

        if (isInEffect(options.in.effect)) {
            chars.forEach(function(e) {
                e.style.visibility =  'hidden';
            });
        } else if (isOutEffect(options.in.effect)) {
            chars.forEach(function(e) {
                e.style.visibility =  'visible';
            });
        }

        base.currentIndex = index;
        if (typeof (options.in.effect) == "function") {
            options.in.effect = options.in.effect();
        }
        animateChars(chars, options.in, function () {
            base.triggerEvent('inAnimationEnd');
            if (options.in.callback) options.in.callback();
            if (cb) cb(base);
        });
    };

    base.out = function (cb) {
        var elem = base.texts.querySelector(':nth-child(' + (base.currentIndex + 1) + ')')
            , chars = base.$current.querySelectorAll('[class^="char"]')
            , options = Object.assign({}, base.options, $elem.length ? getData(elem) : {})

        base.triggerEvent('outAnimationBegin');
        if (typeof (options.out.effect) == "function") {
            options.out.effect = options.out.effect();
        }
        animateChars(chars, options.out, function () {
            $elem.classList.remove('current');
            base.triggerEvent('outAnimationEnd');
            if (options.out.callback) options.out.callback();
            if (cb) cb(base);
        });
    };

    base.start = function (index) {
        base.triggerEvent('start');

        (function run(index) {
            base.in(index, function () {
                var length = base.$texts.children().length;

                index += 1;

                if (!base.options.loop && index >= length) {
                    if (base.options.callback) base.options.callback();
                    base.triggerEvent('end');
                } else {
                    index = index % length;

                    base.timeoutRun = setTimeout(function () {
                        base.out(function () {
                            run(index)
                        });
                    }, base.options.minDisplayTime);
                }
            });
        }(index || 0));
    };

    base.stop = function () {
        if (base.timeoutRun) {
            clearInterval(base.timeoutRun);
            base.timeoutRun = null;
        }
    };

    base.init();
}

function textillate(e, settings, args) {
    
    var $this = e
        , data = $this.textillate
        , options = Object.assign({}, defaults, getData(e), typeof settings == 'object' && settings);

    if (!data) {
        $this.textillate = data = new Textillate(e, options);
    } else if (typeof settings == 'string') {
        data[settings].apply(data, [].concat(args));
    } else {
        data.setOptions.call(data, options);
    }
};

export default textillate;