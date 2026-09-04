import { AudioHub } from "../models/AudioHub.class.js";
import { Keyboard } from "../models/keyboard.class.js";
import { World } from "../models/world.class.js";

window.AudioHub = AudioHub;
let canvas;
let world;
const audioButton = document.getElementById('audioBtn');
audioButton.textContent = "🔇 Sound Aus";

function init() {
    canvas = document.getElementById('canvas');
    world = new World(canvas);
}

audioButton.addEventListener('click', () => {
    const muted = AudioHub.toggleMute();
    if (muted) {
        audioButton.textContent = "🔇 Sound Aus";
    } else {
        audioButton.textContent = "🔊 Sound An";
    }
});

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

init();