import { AudioHub } from "../models/audio-hub.class.js";
import { IntervalHub } from "../models/interval-hub.class.js";
import { Keyboard } from "../models/keyboard.class.js";
import { World } from "../models/world.class.js";

window.AudioHub = AudioHub;
let canvas;
let world;

/** Initialisiert Canvas und Welt; blendet mobile Bedienelemente auf Desktop aus. */
function init() {
    canvas = document.getElementById('canvas');
    const world = new World(canvas);
    if(!isMobile()) {
        document.getElementById('mobileButtons').classList.add('d-none');
    }
}

/** Erkennt mobile Browser anhand des User-Agent-Strings. @returns {boolean} Ob ein mobiles Geraet erkannt wurde. */
function isMobile() {
    const regex = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    return regex.test(navigator.userAgent);
}

/** Click-Handler fuer Stummschaltung und Audio-Icon. */
document.getElementById('audioBtn').addEventListener('click', function() {
    const audioImage = audioBtn.querySelector('img');
    const isMuted = AudioHub.toggleMute();
    if (isMuted) {
        audioImage.src = './assets/img/icons/stumm.png';
    } else {
        audioImage.src = './assets/img/icons/klang.png';
    }
});

/** Click-Handler fuer die Rueckkehr vom Spiel zum Startbildschirm. */
document.getElementById('homeBtn').addEventListener('click', function() {
    AudioHub.stopAll();
    IntervalHub.stopAllInterval();
    world = null;
    document.getElementById('gameOverScreen').classList.add('d-none');
    document.getElementById('startScreen').classList.remove('d-none');
});

/** Click-Handler zum Starten eines neuen Spiels. */
document.getElementById('startBtn').addEventListener ('click', function() {
    init();
    document.getElementById('startScreen').classList.add('d-none');
    document.getElementById('ingameOpt').classList.remove('d-none');
});

/** Click-Handler zum Neustart nach einem Spielende. */
document.getElementById('restartBtn').addEventListener('click', function() {
    AudioHub.stopAll();
    document.getElementById('gameOverScreen').classList.add('d-none');
    init();
});

/** Oeffnet das Optionsfenster vom Startbildschirm. */
document.getElementById('optBtnStart').addEventListener('click', function() {
    document.getElementById('startBtn').classList.add('d-none');
    document.getElementById('optBtnStart').classList.add('d-none');
    document.getElementById('optModal').classList.remove('d-none');
    document.getElementById('startBtnOpt').classList.add('d-none');
});

/** Schliesst Optionen aus dem Startkontext und stellt Startbuttons wieder her. */
document.getElementById('closeOptModalBtn').addEventListener('click', function() {
    document.getElementById('optModal').classList.add('d-none');
    document.getElementById('startBtn').classList.remove('d-none');
    document.getElementById('startBtnOpt').classList.remove('d-none');
    document.getElementById('optBtnStart').classList.remove('d-none');
    document.getElementById('closeOptBtnIngame').classList.add('d-none');
});

/** Schliesst Optionen aus dem laufenden Spielkontext. */
document.getElementById('closeOptBtnIngame').addEventListener('click', function() {
    document.getElementById('optModal').classList.add('d-none');
    document.getElementById('startBtn').classList.remove('d-none');
    document.getElementById('startBtnOpt').classList.remove('d-none');
    document.getElementById('optBtnStart').classList.remove('d-none');
});

/** Oeffnet Optionen als Overlay und pausiert die Spieltimer. */
document.getElementById('optBtnOverlay').addEventListener('click', function() {
    document.getElementById('optModal').classList.remove('d-none');
    document.getElementById('closeOptModalBtn').classList.add('d-none');
    document.getElementById('closeOptBtnIngame').classList.remove('d-none');
    IntervalHub.stopAllInterval();
});

/** Startet das Spiel aus dem Optionsfenster neu und zeigt das Ingame-Overlay. */
document.getElementById('startBtnOpt').addEventListener('click', function() {
    AudioHub.allSounds.forEach(sound => sound.file.pause());
    IntervalHub.stopAllInterval();
    init();
    document.getElementById('startScreen').classList.add('d-none');
    document.getElementById('ingameOptOverlay').classList.remove('d-none');
    document.getElementById('optModal').classList.add('d-none');
});

/** Zeigt die Beschreibung der Spielsteuerung. */
document.getElementById('controlDescriptionBtn').addEventListener('click', function() {
    document.getElementById('optModal').classList.add('d-none');
    document.getElementById('controlDescription').classList.remove('d-none');
});

/** Schliesst die Steuerungsbeschreibung und kehrt zu den Optionen zurueck. */
document.getElementById('closeCtrlDescBtn').addEventListener('click', function() {
    document.getElementById('controlDescription').classList.add('d-none');
    document.getElementById('optModal').classList.remove('d-none');
});

/** Zeigt die Spielbeschreibung. */
document.getElementById('gameDescriptionBtn').addEventListener('click', function() {
    document.getElementById('gameDescription').classList.remove('d-none');
    document.getElementById('optModal').classList.add('d-none');
});

/** Schliesst die Spielbeschreibung und kehrt zu den Optionen zurueck. */
document.getElementById('closeGameDescriptionBtn').addEventListener('click', function() {
    document.getElementById('gameDescription').classList.add('d-none');
    document.getElementById('optModal').classList.remove('d-none');
});

/** Zeigt die Credits und setzt deren Scrollposition per Timeout zurueck. */
document.getElementById('creditsButton').addEventListener('click', function() {
    document.getElementById('credits').classList.remove('d-none');
    document.getElementById('optModal').classList.add('d-none');
    document.getElementById('credits').scrollTop = credits.scrollHeight;

    setTimeout(function(){
        document.getElementById('credits').style.scrollBehavior = 'smooth';
        document.getElementById('credits').scrollTop = 0;
    }, 200);
});

/** Schliesst die Credits und kehrt zu den Optionen zurueck. */
document.getElementById('closeCreditsBtn').addEventListener('click', function() {
    document.getElementById('credits').classList.add('d-none');
    document.getElementById('optModal').classList.remove('d-none');
});

/** Touch-Handler zum Aktivieren der Bewegung nach links. @param {TouchEvent} event Touch-Ereignis. */
document.getElementById('walkLeftButton').addEventListener('touchstart', function(event) {
    event.preventDefault();
    if (event.cancelable) event.preventDefault();
    Keyboard.LEFT = true;
});

/** Touch-Handler zum Beenden der Bewegung nach links. @param {TouchEvent} event Touch-Ereignis. */
document.getElementById('walkLeftButton').addEventListener('touchend', function(event) {
    event.preventDefault();
    if (event.cancelable) event.preventDefault();
    Keyboard.LEFT = false;
});

/** Touch-Handler zum Aktivieren der Bewegung nach rechts. @param {TouchEvent} event Touch-Ereignis. */
document.getElementById('walkRightButton').addEventListener('touchstart', function(event) {
    event.preventDefault();
    if (event.cancelable) event.preventDefault();
    Keyboard.RIGHT = true;
});

/** Touch-Handler zum Beenden der Bewegung nach rechts. @param {TouchEvent} event Touch-Ereignis. */
document.getElementById('walkRightButton').addEventListener('touchend', function(event) {
    event.preventDefault();
    if (event.cancelable) event.preventDefault();
    Keyboard.RIGHT = false;
});

/** Touch-Handler zum Aktivieren des Sprungs. @param {TouchEvent} event Touch-Ereignis. */
document.getElementById('jumpButton').addEventListener('touchstart', function(event) {
    event.preventDefault();
    if (event.cancelable) event.preventDefault();
    Keyboard.SPACE = true;
});

/** Touch-Handler zum Beenden des Sprungeingangs. @param {TouchEvent} event Touch-Ereignis. */
document.getElementById('jumpButton').addEventListener('touchend', function(event) {
    event.preventDefault();
    if (event.cancelable) event.preventDefault();
    Keyboard.SPACE = false;
});

/** Touch-Handler zum Aktivieren des Flaschenwurfs. @param {TouchEvent} event Touch-Ereignis. */
document.getElementById('throwButton').addEventListener('touchstart', function(event) {
    event.preventDefault();
    if (event.cancelable) event.preventDefault();
    Keyboard.B = true;
});

/** Touch-Handler zum Beenden des Flaschenwurfs. @param {TouchEvent} event Touch-Ereignis. */
document.getElementById('throwButton').addEventListener('touchend', function(event) {
    event.preventDefault();
    if (event.cancelable) event.preventDefault();
    Keyboard.B = false;
});

/** Resize-Handler, der auf mobilen Geraeten die Touch-Icons aktualisiert. */
window.addEventListener('resize', function() {
    if(isMobile()) {
        document.getElementById('walkLeftButton-image').src = './assets/img/icons/mobile_left.png';
        document.getElementById('walkLeftButton-image').style.backgroundColor = 'rgb(245, 245, 245)';
        document.getElementById('walkRightButton-image').src = './assets/img/icons/mobile_right.png';
        document.getElementById('walkRightButton-image').style.backgroundColor = 'rgb(245, 245, 245)';
        document.getElementById('jumpButton-image').src = './assets/img/icons/mobile_jump.png';
        document.getElementById('jumpButton-image').style.backgroundColor = 'rgb(245, 245, 245)';
        document.getElementById('throwButton-image').src = './assets/img/icons/mobile_throw.png';
        document.getElementById('throwButton-image').style.backgroundColor = 'rgb(245, 245, 245)';
    }
});

/** Orientation-Handler fuer Hoch- und Querformatanzeige. */
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

/** Tastatur-Handler zum Zuruecksetzen der gedrueckten Steuerungsflags. @param {KeyboardEvent} e Tastaturereignis. */
window.addEventListener("keyup", (e) => {
    if (e.code == "Space") Keyboard.SPACE = false;
    if (e.code == "KeyB") Keyboard.B = false;
    if (e.code == "ArrowLeft") Keyboard.LEFT = false;
    if (e.code == "ArrowUp") Keyboard.UP = false;
    if (e.code == "ArrowRight") Keyboard.RIGHT = false;
    if (e.code == "ArrowDown") Keyboard.DOWN = false;
});

/** Tastatur-Handler zum Setzen der gedrueckten Steuerungsflags. @param {KeyboardEvent} e Tastaturereignis. */
window.addEventListener("keydown", (e) => {
    if (e.code == "Space") Keyboard.SPACE = true;
    if (e.code == "KeyB") Keyboard.B = true;
    if (e.code == "ArrowLeft") Keyboard.LEFT = true;
    if (e.code == "ArrowUp") Keyboard.UP = true;
    if (e.code == "ArrowRight") Keyboard.RIGHT = true;
    if (e.code == "ArrowDown") Keyboard.DOWN = true;
});