import { AudioHub } from "../models/audio-hub.class.js";
import { IntervalHub } from "../models/interval-hub.class.js";
import { Keyboard } from "../models/keyboard.class.js";
import { World } from "../models/world.class.js";

window.AudioHub = AudioHub;
let canvas;
let world;

function init() {
    canvas = document.getElementById('canvas');
    const world = new World(canvas);
    if(!isMobile()) {
        document.getElementById('mobileButtons').classList.add('d-none');
    }
}

function isMobile() {
    const regex = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    return regex.test(navigator.userAgent);
}

document.getElementById('audioBtn').addEventListener('click', function() {
    const audioImage = audioBtn.querySelector('img');
    const isMuted = AudioHub.toggleMute();
    if (isMuted) {
        audioImage.src = './assets/img/icons/stumm.png';
    } else {
        audioImage.src = './assets/img/icons/klang.png';
    }
});

document.getElementById('homeBtn').addEventListener('click', function() {
    AudioHub.stopAll();
    IntervalHub.stopAllInterval();
    world = null;
    document.getElementById('gameOverScreen').classList.add('d-none');
    document.getElementById('startScreen').classList.remove('d-none');
});

document.getElementById('startBtn').addEventListener ('click', function() {
    init();
    document.getElementById('startScreen').classList.add('d-none');
    document.getElementById('ingameOpt').classList.remove('d-none');
});

document.getElementById('restartBtn').addEventListener('click', function() {
    AudioHub.stopAll();
    document.getElementById('gameOverScreen').classList.add('d-none');
    init();
});

document.getElementById('optBtnStart').addEventListener('click', function() {
    document.getElementById('startBtn').classList.add('d-none');
    document.getElementById('optBtnStart').classList.add('d-none');
    document.getElementById('optModal').classList.remove('d-none');
    document.getElementById('startBtnOpt').classList.add('d-none');
});

document.getElementById('closeOptModalBtn').addEventListener('click', function() {
    document.getElementById('optModal').classList.add('d-none');
    document.getElementById('startBtn').classList.remove('d-none');
    document.getElementById('startBtnOpt').classList.remove('d-none');
    document.getElementById('optBtnStart').classList.remove('d-none');
    document.getElementById('closeOptBtnIngame').classList.add('d-none');
});

document.getElementById('closeOptBtnIngame').addEventListener('click', function() {
    document.getElementById('optModal').classList.add('d-none');
    document.getElementById('startBtn').classList.remove('d-none');
    document.getElementById('startBtnOpt').classList.remove('d-none');
    document.getElementById('optBtnStart').classList.remove('d-none');
    
    // continue game
    world.run();
    world.character.animate();
    world.character.applyGravity();
    world.level.enemies.forEach(enemy => {
        enemy.animate();
    });
    world.level.collectibles.forEach(object => {
        object.animate();
    })
});

document.getElementById('optBtnOverlay').addEventListener('click', function() {
    document.getElementById('optModal').classList.remove('d-none');
    document.getElementById('closeOptModalBtn').classList.add('d-none');
    document.getElementById('closeOptBtnIngame').classList.remove('d-none');
    // pause game
    IntervalHub.stopAllInterval();
});

document.getElementById('startBtnOpt').addEventListener('click', function() {
    AudioHub.allSounds.forEach(sound => sound.file.pause());
    IntervalHub.stopAllInterval();
    init();
    document.getElementById('startScreen').classList.add('d-none');
    document.getElementById('ingameOptOverlay').classList.remove('d-none');
    document.getElementById('optModal').classList.add('d-none');
});

document.getElementById('controlDescriptionBtn').addEventListener('click', function() {
    document.getElementById('optModal').classList.add('d-none');
    document.getElementById('controlDescription').classList.remove('d-none');
});

document.getElementById('closeCtrlDescBtn').addEventListener('click', function() {
    document.getElementById('controlDescription').classList.add('d-none');
    document.getElementById('optModal').classList.remove('d-none');
});

document.getElementById('gameDescriptionBtn').addEventListener('click', function() {
    document.getElementById('gameDescription').classList.remove('d-none');
    document.getElementById('optModal').classList.add('d-none');
});

document.getElementById('closeGameDescriptionBtn').addEventListener('click', function() {
    document.getElementById('gameDescription').classList.add('d-none');
    document.getElementById('optModal').classList.remove('d-none');
});

document.getElementById('creditsButton').addEventListener('click', function() {
    document.getElementById('credits').classList.remove('d-none');
    document.getElementById('optModal').classList.add('d-none');
    document.getElementById('credits').scrollTop = credits.scrollHeight;

    setTimeout(function(){
        document.getElementById('credits').style.scrollBehavior = 'smooth';
        document.getElementById('credits').scrollTop = 0;
    }, 200);
});

document.getElementById('closeCreditsBtn').addEventListener('click', function() {
    document.getElementById('credits').classList.add('d-none');
    document.getElementById('optModal').classList.remove('d-none');
});

document.getElementById('walkLeftButton').addEventListener('touchstart', function(event) {
    event.preventDefault();
    if (event.cancelable) event.preventDefault();
    Keyboard.LEFT = true;
});

document.getElementById('walkLeftButton').addEventListener('touchend', function(event) {
    event.preventDefault();
    if (event.cancelable) event.preventDefault();
    Keyboard.LEFT = false;
});

document.getElementById('walkRightButton').addEventListener('touchstart', function(event) {
    event.preventDefault();
    if (event.cancelable) event.preventDefault();
    Keyboard.RIGHT = true;
});

document.getElementById('walkRightButton').addEventListener('touchend', function(event) {
    event.preventDefault();
    if (event.cancelable) event.preventDefault();
    Keyboard.RIGHT = false;
});

document.getElementById('jumpButton').addEventListener('touchstart', function(event) {
    event.preventDefault();
    if (event.cancelable) event.preventDefault();
    Keyboard.SPACE = true;
});

document.getElementById('jumpButton').addEventListener('touchend', function(event) {
    event.preventDefault();
    if (event.cancelable) event.preventDefault();
    Keyboard.SPACE = false;
});

document.getElementById('throwButton').addEventListener('touchstart', function(event) {
    event.preventDefault();
    if (event.cancelable) event.preventDefault();
    Keyboard.B = true;
});

document.getElementById('throwButton').addEventListener('touchend', function(event) {
    event.preventDefault();
    if (event.cancelable) event.preventDefault();
    Keyboard.B = false;
});

window.addEventListener('resize', function() {
    if(isMobile()) {
        document.getElementById('walkLeftButton-image').src = './assets/img/icons/mobile_left.png';
        document.getElementById('walkLeftButton-image').style.backgroundColor = 'rgb(238, 166, 32)';
        document.getElementById('walkRightButton-image').src = './assets/img/icons/mobile_right.png';
        document.getElementById('walkRightButton-image').style.backgroundColor = 'rgb(238, 166, 32)';
        document.getElementById('jumpButton-image').src = './assets/img/icons/mobile_jump.png';
        document.getElementById('jumpButton-image').style.backgroundColor = 'rgb(238, 166, 32)';
        document.getElementById('throwButton-image').src = './assets/img/icons/mobile_throw.png';
        document.getElementById('throwButton-image').style.backgroundColor = 'rgb(238, 166, 32)';
    }
});

window.addEventListener('orientationchange', function() {
    if(screen.orientation.type == 'portrait-primary') {
        document.getElementById('rotateDeviceMsg').classList.remove('d-none');
        document.getElementById('startScreen').classList.add('d-none');
        document.getElementById('startBtn').classList.add('d-none');
        document.getElementById('optBtnStart').classList.add('d-none');
        document.getElementById('mobileButtons').classList.add('d-none');
    } else if(screen.orientation.type == 'landscape-primary' || screen.orientation.type == 'landscape-secondary') {
        document.getElementById('rotateDeviceMsg').classList.add('d-none');
        document.getElementById('startScreen').classList.remove('d-none');
        document.getElementById('startBtn').classList.remove('d-none');
        document.getElementById('optBtnStart').classList.remove('d-none');
        document.getElementById('mobileButtons').classList.remove('d-none');
    }
});

if(screen.orientation.type == 'portrait-primary') {
    document.getElementById('rotateDeviceMsg').classList.remove('d-none');
    document.getElementById('startScreen').classList.add('d-none');
    document.getElementById('startBtn').classList.add('d-none');
    document.getElementById('optBtnStart').classList.add('d-none');
    document.getElementById('mobileButtons').classList.add('d-none');
}

if(screen.orientation.type == 'landscape-primary') {
    document.getElementById('rotateDeviceMsg').classList.add('d-none');
    document.getElementById('startScreen').classList.remove('d-none');
    document.getElementById('startBtn').classList.remove('d-none');
    document.getElementById('optBtnStart').classList.remove('d-none');
    document.getElementById('mobileButtons').classList.remove('d-none');
}

window.addEventListener("keyup", (e) => {
    // console.log(e.code); 
    
    if (e.code == "Space") {
        Keyboard.SPACE = false;
    }

    if (e.code == "KeyB") {
        Keyboard.B = false;
    }
    
    if (e.code == "ArrowLeft") {
        Keyboard.LEFT = false;
    }

    if (e.code == "ArrowUp") {
        Keyboard.UP = false;
    }

    if (e.code == "ArrowRight") {
        Keyboard.RIGHT = false;
    }

    if (e.code == "ArrowDown") {
        Keyboard.DOWN = false;
    }
});

window.addEventListener("keydown", (e) => {
    if (e.code == "Space") {
        Keyboard.SPACE = true;
    }

    if (e.code == "KeyB") {
        Keyboard.B = true;
    }
    
    if (e.code == "ArrowLeft") {
        Keyboard.LEFT = true;
    }

    if (e.code == "ArrowUp") {
        Keyboard.UP = true;
    }

    if (e.code == "ArrowRight") {
        Keyboard.RIGHT = true;
    }

    if (e.code == "ArrowDown") {
        Keyboard.DOWN = true;
    }
});

// init();