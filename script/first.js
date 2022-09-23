const {
    gsap,
    gsap: { to, timeline, set, delayedCall },
    Splitting
} = window
const BTN = document.querySelector('.birthday-button__button')
const SOUNDS = {
    CHEER: new Audio('audio/cheer-done.mp3'),
    MATCH: new Audio('audio/match-done.mp3'),
    TUNE: new Audio('audio/tune-done.mp3'),
    ON: new Audio('audio/on-done.mp3'),
    BLOW: new Audio('audio/blow-done.mp3'),
    POP1: new Audio('audio/pop1.mp3'),
    POP2: new Audio('audio/pop2.mp3'),
    POP3: new Audio('audio/pop3.mp3'),
    HORN: new Audio('audio/horn-done.mp3')
}

// Import the data to customize and insert them into page
const fetchData = () => {
    fetch("customize.json")
        .then(data => data.json())
        .then(data => {
            dataArr = Object.keys(data);
            dataArr.map(customData => {
                if (data[customData] !== "") {
                    if (customData === "imagePath") {
                        document
                            .querySelector(`[data-node-name*="${customData}"]`)
                            .setAttribute("src", data[customData]);
                    } else {
                        document.querySelector(`[data-node-name*="${customData}"]`).innerText = data[customData];
                    }
                }

                // Check if the iteration is over
                // Run amimation if so
                if ( dataArr.length === dataArr.indexOf(customData) + 1 ) {
                    animationTimeline();
                }
            });
        });
};

const MASTER_TL = timeline()
// Run fetch and animation in sequence
fetchData();

Splitting()

const EYES = document.querySelector('.cake__eyes')
const BLINK = eyes => {
    gsap.set(eyes, { scaleY: 1 })
    if (eyes.BLINK_TL) eyes.BLINK_TL.kill()
    eyes.BLINK_TL = new gsap.timeline({
        delay: Math.floor(Math.random() * 4) + 1,
        onComplete: () => BLINK(eyes),
    })
    eyes.BLINK_TL.to(eyes, {
        duration: 0.05,
        transformOrigin: '50% 50%',
        scaleY: 0,
        yoyo: true,
        repeat: 1,
    })
}
BLINK(EYES)

const FROSTING_TL = () =>
    timeline()
        .to(
            '#frosting',
            {
                scaleX: 1.015,
                duration: 0.25,
            },
            0
        )
        .to(
            '#frosting',
            {
                scaleY: 1,
                duration: 1,
            },
            0
        )
        .to(
            '#frosting',
            {
                duration: 1,
                morphSVG: '.cake__frosting--end',
            },
            0
        )
// Extract to sprinkle
const SPRINKLES_TL = () =>
    timeline().to('.cake__sprinkle', { scale: 1, duration: 0.06, stagger: 0.02 })
// Extract out to your own timeline
const SPIN_TL = () =>
    timeline()
        .set('.cake__frosting-patch', { display: 'block' })
        .to(
            ['.cake__frosting--duplicate', '.cake__sprinkles--duplicate'],
            { x: 0, duration: 1 },
            0
        )
        .to(
            ['.cake__frosting--start', '.cake__sprinkles--initial'],
            { x: 65, duration: 1 },
            0
        )
        .to('.cake__face', { duration: 1, x: -48.82 }, 0)

const flickerSpeed = 0.1
const FLICKER_TL = timeline()
    .to('.candle__flame-outer', {
        duration: flickerSpeed,
        repeat: -1,
        yoyo: true,
        morphSVG: '#flame-outer',
    })
    .to(
        '.candle__flame-inner',
        {
            duration: flickerSpeed,
            repeat: -1,
            yoyo: true,
            morphSVG: '#flame-inner',
        },
        0
    )

const SHAKE_TL = () =>
    timeline({ delay: 0.5 })
        .set('.cake__face', { display: 'none' })
        .set('.cake__face--straining', { display: 'block' })
        .to(
            '.birthday-button',
            {
                onComplete: () => {
                    set('.cake__face--straining', { display: 'none' })
                    set('.cake__face', { display: 'block' })
                },
                x: 1,
                y: 1,
                repeat: 13,
                duration: 0.1,
            },
            0
        )
        .to(
            '.cake__candle',
            {
                onComplete: () => {
                    FLICKER_TL.play()
                },
                ease: 'Elastic.easeOut',
                duration: 0.2,
                stagger: 0.2,
                scaleY: 1,
            },
            0.2
        )
const FLAME_TL = () =>
    timeline({})
        .to('.cake__candle', { '--flame': 1, stagger: 0.2, duration: 0.1 })
        .to('body', { '--flame': 1, '--lightness': 5, duration: 0.2, delay: 0.2 })
const LIGHTS_OUT = () =>
    timeline().to('body', {
        delay: 0.5,
        '--lightness': 0,
        duration: 0.1,
        '--glow-saturation': 0,
        '--glow-lightness': 0,
        '--glow-alpha': 1,
        '--transparency-alpha': 1,
    })

const CLICK_GO_ON = () => timeline()
    .to('.char', {
        color: 'hsl(var(--hue, 0), calc(var(--char-sat, 0) * 1%), calc(var(--char-light, 0) * 1%))'
    })
    .to(".six", 0.5, {
        opacity: 0,
        y: -30,
        zIndex: "-1"
    })
    .to('.birthday-button',
    {
        bottom: '45%',
        duration: 1.5,
    })

const LAST_TL = () => timeline().to('.body', {
    onStart: () => {
        set('.last', {
            display: 'block'
        })
        set('.birthday-button', {
            display: 'none'
        })
        anim();
        // delayedCall(2, RESET)
        // BTN.removeAttribute('disabled')
    }
})
const RESET = () => {
    set('.char', {
        '--hue': () => Math.random() * 360,
        '--char-sat': 0,
        '--char-light': 0,
        x: 0,
        y: 0,
        opacity: 1,
    })
    set('body', {
        '--frosting-hue': 14,
        '--glow-saturation': 50,
        '--glow-lightness': 35,
        '--glow-alpha': 0.4,
        '--transparency-alpha': 0,
        '--flame': 0,
    })
    set('.cake__candle', { '--flame': 0 })
    to('body', {
        '--lightness': 97,
        duration: 0.25,
    })
    // SET THESE
    set('.cake__frosting--end', { opacity: 0 })
    set('#frosting', {
        transformOrigin: '50% 10%',
        scaleX: 0,
        scaleY: 0,
    })
    set('.cake__frosting-patch', { display: 'none' })
    set(['.cake__frosting--duplicate', '.cake__sprinkles--duplicate'], { x: -65 })
    set('.cake__face', { x: -110 })
    set('.cake__face--straining', { display: 'none' })
    set('.cake__sprinkle', {
        '--sprinkle-hue': () => Math.random() * 360,
        scale: 0,
        transformOrigin: '50% 50%',
    })
    set('.birthday-button', { scale: 0.6, x: 0, y: 0 })
    set('.birthday-button__cake', { display: 'none' })
    set('.cake__candle', { scaleY: 0, transformOrigin: '50% 100%' })
}
RESET()
// Animation Timeline
const animationTimeline = () => {
    // Spit chars that needs to be animated individually
    const textBoxChars = document.getElementsByClassName("hbd-chatbox")[0];
    const hbd = document.getElementsByClassName("wish-hbd")[0];

    textBoxChars.innerHTML = `<span>${textBoxChars.innerHTML
        .split("")
        .join("</span><span>")}</span`;

    hbd.innerHTML = `<span>${hbd.innerHTML
        .split("")
        .join("</span><span>")}</span`;

    const ideaTextTrans = {
        opacity: 0,
        y: -20,
        rotationX: 5,
        skewX: "15deg"
    };

    const ideaTextTransLeave = {
        opacity: 0,
        y: 20,
        rotationY: 5,
        skewX: "-15deg"
    };

    MASTER_TL
        .to(".container", 0.1, {
            visibility: "visible"
        })
        .from(".one", 0.7, {
            opacity: 0,
            y: 10
        })
        .from(".two", 0.4, {
            opacity: 0,
            y: 10
        })
        .to(".one", 0.7, {
                opacity: 0,
                y: 10
            }, "+=2.5")
        .to(".two", 0.7, {
                opacity: 0,
                y: 10
            }, "-=1")
        .from(".three", 0.7, {
            opacity: 0,
            y: 10
            // scale: 0.7
        })
        .to(".three", 0.7, {
                opacity: 0,
                y: 10
            }, "+=2")
        .from(".four", 0.7, {
            scale: 0.2,
            opacity: 0
        })
        .from(".fake-btn", 0.3, {
            scale: 0.2,
            opacity: 0
        })
        .staggerTo(".hbd-chatbox span", 0.5, {
                visibility: "visible"
            }, 0.05)
        .to(".fake-btn", 0.1, {
            backgroundColor: "rgb(127, 206, 248)"
        })
        .to(".four", 0.5, {
                scale: 0.2,
                opacity: 0,
                y: -150
            }, "+=0.7")
        .from(".idea-1", 0.7, ideaTextTrans)
        .to(".idea-1", 0.7, ideaTextTransLeave, "+=1.5")
        .from(".idea-2", 0.7, ideaTextTrans)
        .to(".idea-2", 0.7, ideaTextTransLeave, "+=1.5")
        .from(".idea-3", 0.7, ideaTextTrans)
        .to(".idea-3 strong", 0.5, {
            scale: 1.2,
            x: 10,
            backgroundColor: "rgb(21, 161, 237)",
            color: "#fff"
        })
        .to(".idea-3", 0.7, ideaTextTransLeave, "+=1.5")
        .from(".idea-4", 0.7, ideaTextTrans)
        .to(".idea-4", 0.7, ideaTextTransLeave, "+=1.5")
        .from(".idea-5", 0.7, {
                rotationX: 15,
                rotationZ: -10,
                skewY: "-5deg",
                y: 50,
                z: 10,
                opacity: 0
            }, "+=0.5")
        .to(".idea-5 .smiley", 0.7, {
                rotation: 90,
                x: 8
            }, "+=0.4")
        .to(".idea-5", 0.7, {
                scale: 0.2,
                opacity: 0
            }, "+=2")
        .staggerFrom(".idea-6 span", 0.8, {
                scale: 3,
                opacity: 0,
                rotation: 15,
                ease: Expo.easeOut
            }, 0.2)
        .staggerTo(".idea-6 span", 0.8, {
                scale: 3,
                opacity: 0,
                rotation: -15,
                ease: Expo.easeOut
            }, 0.2, "+=1")
        .staggerFromTo(".baloons img", 2.5, {
                opacity: 0.9,
                y: 1400
            },
            {
                opacity: 1,
                y: -1000
            }, 0.2)
        .from(".lydia-dp", 0.5, {
                scale: 3.5,
                opacity: 0,
                x: 25,
                y: -25,
                rotationZ: -45
            }, "-=2")
        .from(".hat", 0.5, {
            x: -100,
            y: 350,
            rotation: -180,
            opacity: 0
        })
        .staggerFrom(".wish-hbd span", 0.7, {
                opacity: 0,
                y: -50,
                // scale: 0.3,
                rotation: 150,
                skewX: "30deg",
                ease: Elastic.easeOut.config(1, 0.5)
            }, 0.1
        )
        .staggerFromTo(".wish-hbd span", 0.7, {
                scale: 1.4,
                rotationY: 150
            },
            {
                scale: 1,
                rotationY: 0,
                color: "#ff69b4",
                ease: Expo.easeOut
            }, 0.1, "party")
        .from(".wish h5", 0.5, {
                opacity: 0,
                y: 10,
                skewX: "-15deg"
            }, "party")
        .to(".birthday-button", {
            opacity: 1,
            duration: 1
        })
        .add(CLICK_GO_ON(), 'CLICK_GO_ON')
        .set('.birthday-button__cake', { display: 'block' })
        .to('.birthday-button', {
            scale: 1,
            duration: 0.2,
        })
        .to('.char', { '--char-sat': 70, '--char-light': 65, duration: 0.2 }, 0)
        .to('.char', {
            delay: 0.75,
            y: () => gsap.utils.random(-100, -200),
            x: () => gsap.utils.random(-50, 50),
            duration: () => gsap.utils.random(0.5, 1),
        })
        .to('.char', { opacity: 0, duration: 0.25 }, '>-0.5')
        .add(FROSTING_TL())
        .add(SPRINKLES_TL())
        .add(SPIN_TL())
        .add(SHAKE_TL())
        .add(FLAME_TL(), 'FLAME_ON')
        .add(LIGHTS_OUT(), 'LIGHTS_OUT')
        .add(LAST_TL())

    SOUNDS.TUNE.onended = SOUNDS.MATCH.onended = () => MASTER_TL.play()

    MASTER_TL.addPause('CLICK_GO_ON')
    MASTER_TL.addPause('FLAME_ON')
    MASTER_TL.addPause('LIGHTS_OUT')
};


BTN.addEventListener('click', () => {
    SOUNDS.BLOW.play()
    SOUNDS.CHEER.play()
    SOUNDS.TUNE.play()
    SOUNDS.MATCH.play()
    SOUNDS.POP1.play()
    SOUNDS.POP2.play()
    SOUNDS.POP3.play()
    SOUNDS.ON.play()
    SOUNDS.HORN.play()
    BTN.setAttribute('disabled', true)
    MASTER_TL.resume()
})


// last.js
var w = c.width = window.innerWidth,
    h = c.height = window.innerHeight,
    ctx = c.getContext( '2d' ),

    hw = w / 2, // half-width
    hh = h / 2,

    opts = {
        strings: [ '小侯', '生日快乐!' ],
        charSize: 30,
        charSpacing: 35,
        lineHeight: 40,

        cx: w / 2,
        cy: h / 2,

        fireworkPrevPoints: 10,
        fireworkBaseLineWidth: 5,
        fireworkAddedLineWidth: 8,
        fireworkSpawnTime: 200,
        fireworkBaseReachTime: 30,
        fireworkAddedReachTime: 30,
        fireworkCircleBaseSize: 20,
        fireworkCircleAddedSize: 10,
        fireworkCircleBaseTime: 30,
        fireworkCircleAddedTime: 30,
        fireworkCircleFadeBaseTime: 10,
        fireworkCircleFadeAddedTime: 5,
        fireworkBaseShards: 5,
        fireworkAddedShards: 5,
        fireworkShardPrevPoints: 3,
        fireworkShardBaseVel: 4,
        fireworkShardAddedVel: 2,
        fireworkShardBaseSize: 3,
        fireworkShardAddedSize: 3,
        gravity: .1,
        upFlow: -.1,
        letterContemplatingWaitTime: 360,
        balloonSpawnTime: 20,
        balloonBaseInflateTime: 10,
        balloonAddedInflateTime: 10,
        balloonBaseSize: 20,
        balloonAddedSize: 20,
        balloonBaseVel: .4,
        balloonAddedVel: .4,
        balloonBaseRadian: -( Math.PI / 2 - .5 ),
        balloonAddedRadian: -1,
    },
    calc = {
        totalWidth: opts.charSpacing * Math.max( opts.strings[0].length, opts.strings[1].length )
    },

    Tau = Math.PI * 2,
    TauQuarter = Tau / 4,

    letters = [];

ctx.font = opts.charSize + 'px Verdana';

function Letter( char, x, y ){
    this.char = char;
    this.x = x;
    this.y = y;

    this.dx = -ctx.measureText( char ).width / 2;
    this.dy = +opts.charSize / 2;

    this.fireworkDy = this.y - hh;

    var hue = x / calc.totalWidth * 360;

    this.color = 'hsl(hue,80%,50%)'.replace( 'hue', hue );
    this.lightAlphaColor = 'hsla(hue,80%,light%,alp)'.replace( 'hue', hue );
    this.lightColor = 'hsl(hue,80%,light%)'.replace( 'hue', hue );
    this.alphaColor = 'hsla(hue,80%,50%,alp)'.replace( 'hue', hue );

    this.reset();
}
Letter.prototype.reset = function(){

    this.phase = 'firework';
    this.tick = 0;
    this.spawned = false;
    this.spawningTime = opts.fireworkSpawnTime * Math.random() |0;
    this.reachTime = opts.fireworkBaseReachTime + opts.fireworkAddedReachTime * Math.random() |0;
    this.lineWidth = opts.fireworkBaseLineWidth + opts.fireworkAddedLineWidth * Math.random();
    this.prevPoints = [ [ 0, hh, 0 ] ];
}
Letter.prototype.step = function(){

    if( this.phase === 'firework' ){

        if( !this.spawned ){

            ++this.tick;
            if( this.tick >= this.spawningTime ){

                this.tick = 0;
                this.spawned = true;
            }

        } else {

            ++this.tick;

            var linearProportion = this.tick / this.reachTime,
                armonicProportion = Math.sin( linearProportion * TauQuarter ),

                x = linearProportion * this.x,
                y = hh + armonicProportion * this.fireworkDy;

            if( this.prevPoints.length > opts.fireworkPrevPoints )
                this.prevPoints.shift();

            this.prevPoints.push( [ x, y, linearProportion * this.lineWidth ] );

            var lineWidthProportion = 1 / ( this.prevPoints.length - 1 );

            for( var i = 1; i < this.prevPoints.length; ++i ){

                var point = this.prevPoints[ i ],
                    point2 = this.prevPoints[ i - 1 ];

                ctx.strokeStyle = this.alphaColor.replace( 'alp', i / this.prevPoints.length );
                ctx.lineWidth = point[ 2 ] * lineWidthProportion * i;
                ctx.beginPath();
                ctx.moveTo( point[ 0 ], point[ 1 ] );
                ctx.lineTo( point2[ 0 ], point2[ 1 ] );
                ctx.stroke();

            }

            if( this.tick >= this.reachTime ){

                this.phase = 'contemplate';

                this.circleFinalSize = opts.fireworkCircleBaseSize + opts.fireworkCircleAddedSize * Math.random();
                this.circleCompleteTime = opts.fireworkCircleBaseTime + opts.fireworkCircleAddedTime * Math.random() |0;
                this.circleCreating = true;
                this.circleFading = false;

                this.circleFadeTime = opts.fireworkCircleFadeBaseTime + opts.fireworkCircleFadeAddedTime * Math.random() |0;
                this.tick = 0;
                this.tick2 = 0;

                this.shards = [];

                var shardCount = opts.fireworkBaseShards + opts.fireworkAddedShards * Math.random() |0,
                    angle = Tau / shardCount,
                    cos = Math.cos( angle ),
                    sin = Math.sin( angle ),

                    x = 1,
                    y = 0;

                for( var i = 0; i < shardCount; ++i ){
                    var x1 = x;
                    x = x * cos - y * sin;
                    y = y * cos + x1 * sin;

                    this.shards.push( new Shard( this.x, this.y, x, y, this.alphaColor ) );
                }
            }

        }
    } else if( this.phase === 'contemplate' ){

        ++this.tick;

        if( this.circleCreating ){

            ++this.tick2;
            var proportion = this.tick2 / this.circleCompleteTime,
                armonic = -Math.cos( proportion * Math.PI ) / 2 + .5;

            ctx.beginPath();
            ctx.fillStyle = this.lightAlphaColor.replace( 'light', 50 + 50 * proportion ).replace( 'alp', proportion );
            ctx.beginPath();
            ctx.arc( this.x, this.y, armonic * this.circleFinalSize, 0, Tau );
            ctx.fill();

            if( this.tick2 > this.circleCompleteTime ){
                this.tick2 = 0;
                this.circleCreating = false;
                this.circleFading = true;
            }
        } else if( this.circleFading ){

            ctx.fillStyle = this.lightColor.replace( 'light', 70 );
            ctx.fillText( this.char, this.x + this.dx, this.y + this.dy );

            ++this.tick2;
            var proportion = this.tick2 / this.circleFadeTime,
                armonic = -Math.cos( proportion * Math.PI ) / 2 + .5;

            ctx.beginPath();
            ctx.fillStyle = this.lightAlphaColor.replace( 'light', 100 ).replace( 'alp', 1 - armonic );
            ctx.arc( this.x, this.y, this.circleFinalSize, 0, Tau );
            ctx.fill();

            if( this.tick2 >= this.circleFadeTime )
                this.circleFading = false;

        } else {

            ctx.fillStyle = this.lightColor.replace( 'light', 70 );
            ctx.fillText( this.char, this.x + this.dx, this.y + this.dy );
        }

        for( var i = 0; i < this.shards.length; ++i ){

            this.shards[ i ].step();

            if( !this.shards[ i ].alive ){
                this.shards.splice( i, 1 );
                --i;
            }
        }

        if( this.tick > opts.letterContemplatingWaitTime ){

            this.phase = 'balloon';

            this.tick = 0;
            this.spawning = true;
            this.spawnTime = opts.balloonSpawnTime * Math.random() |0;
            this.inflating = false;
            this.inflateTime = opts.balloonBaseInflateTime + opts.balloonAddedInflateTime * Math.random() |0;
            this.size = opts.balloonBaseSize + opts.balloonAddedSize * Math.random() |0;

            var rad = opts.balloonBaseRadian + opts.balloonAddedRadian * Math.random(),
                vel = opts.balloonBaseVel + opts.balloonAddedVel * Math.random();

            this.vx = Math.cos( rad ) * vel;
            this.vy = Math.sin( rad ) * vel;
        }
    } else if( this.phase === 'balloon' ){

        ctx.strokeStyle = this.lightColor.replace( 'light', 80 );

        if( this.spawning ){

            ++this.tick;
            ctx.fillStyle = this.lightColor.replace( 'light', 70 );
            ctx.fillText( this.char, this.x + this.dx, this.y + this.dy );

            if( this.tick >= this.spawnTime ){
                this.tick = 0;
                this.spawning = false;
                this.inflating = true;
            }
        } else if( this.inflating ){

            ++this.tick;

            var proportion = this.tick / this.inflateTime,
                x = this.cx = this.x,
                y = this.cy = this.y - this.size * proportion;

            ctx.fillStyle = this.alphaColor.replace( 'alp', proportion );
            ctx.beginPath();
            generateBalloonPath( x, y, this.size * proportion );
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo( x, y );
            ctx.lineTo( x, this.y );
            ctx.stroke();

            ctx.fillStyle = this.lightColor.replace( 'light', 70 );
            ctx.fillText( this.char, this.x + this.dx, this.y + this.dy );

            if( this.tick >= this.inflateTime ){
                this.tick = 0;
                this.inflating = false;
            }

        } else {

            this.cx += this.vx;
            this.cy += this.vy += opts.upFlow;

            ctx.fillStyle = this.color;
            ctx.beginPath();
            generateBalloonPath( this.cx, this.cy, this.size );
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo( this.cx, this.cy );
            ctx.lineTo( this.cx, this.cy + this.size );
            ctx.stroke();

            ctx.fillStyle = this.lightColor.replace( 'light', 70 );
            ctx.fillText( this.char, this.cx + this.dx, this.cy + this.dy + this.size );

            if( this.cy + this.size < -hh || this.cx < -hw || this.cy > hw  )
                this.phase = 'done';

        }
    }
}
function Shard( x, y, vx, vy, color ){

    var vel = opts.fireworkShardBaseVel + opts.fireworkShardAddedVel * Math.random();

    this.vx = vx * vel;
    this.vy = vy * vel;

    this.x = x;
    this.y = y;

    this.prevPoints = [ [ x, y ] ];
    this.color = color;

    this.alive = true;

    this.size = opts.fireworkShardBaseSize + opts.fireworkShardAddedSize * Math.random();
}
Shard.prototype.step = function(){

    this.x += this.vx;
    this.y += this.vy += opts.gravity;

    if( this.prevPoints.length > opts.fireworkShardPrevPoints )
        this.prevPoints.shift();

    this.prevPoints.push( [ this.x, this.y ] );

    var lineWidthProportion = this.size / this.prevPoints.length;

    for( var k = 0; k < this.prevPoints.length - 1; ++k ){

        var point = this.prevPoints[ k ],
            point2 = this.prevPoints[ k + 1 ];

        ctx.strokeStyle = this.color.replace( 'alp', k / this.prevPoints.length );
        ctx.lineWidth = k * lineWidthProportion;
        ctx.beginPath();
        ctx.moveTo( point[ 0 ], point[ 1 ] );
        ctx.lineTo( point2[ 0 ], point2[ 1 ] );
        ctx.stroke();

    }

    if( this.prevPoints[ 0 ][ 1 ] > hh )
        this.alive = false;
}
function generateBalloonPath( x, y, size ){

    ctx.moveTo( x, y );
    ctx.bezierCurveTo( x - size / 2, y - size / 2,
        x - size / 4, y - size,
        x,            y - size );
    ctx.bezierCurveTo( x + size / 4, y - size,
        x + size / 2, y - size / 2,
        x,            y );
}

function anim(){

    window.requestAnimationFrame( anim );

    ctx.fillStyle = '#111';
    ctx.fillRect( 0, 0, w, h );

    ctx.translate( hw, hh );

    var done = true;
    for( var l = 0; l < letters.length; ++l ){

        letters[ l ].step();
        if( letters[ l ].phase !== 'done' )
            done = false;
    }

    ctx.translate( -hw, -hh );

    if( done )
        for( var l = 0; l < letters.length; ++l )
            letters[ l ].reset();
}

for( var i = 0; i < opts.strings.length; ++i ){
    for( var j = 0; j < opts.strings[ i ].length; ++j ){
        letters.push( new Letter( opts.strings[ i ][ j ],
            j * opts.charSpacing + opts.charSpacing / 2 - opts.strings[ i ].length * opts.charSize / 2,
            i * opts.lineHeight + opts.lineHeight / 2 - opts.strings.length * opts.lineHeight / 2 ) );
    }
}

window.addEventListener( 'resize', function(){

    w = c.width = window.innerWidth;
    h = c.height = window.innerHeight;

    hw = w / 2;
    hh = h / 2;

    ctx.font = opts.charSize + 'px Verdana';
})
