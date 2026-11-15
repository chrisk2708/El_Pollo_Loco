import { AudioHub } from "../classes/audio-hub.class.js";
import { IntervalHub } from "../classes/interval-hub.class.js";
import { World } from "../classes/world.class.js";
import { initControls, releaseAllKeys } from "./controls.js";

let world = null;
let optionsContext = 'start';
let pausedForPortrait = false;

/** Zuordnung der Menue-Buttons zu ihren Unterdialogen. */
const SUB_DIALOGS = {
    controlDescriptionBtn: 'controlDescription',
    gameDescriptionBtn: 'gameDescription',
    imprintBtn: 'imprintDialog',
    privacyBtn: 'privacyDialog'
};

/**
 * Kurzschreibweise fuer document.getElementById.
 * @param {string} id Element-ID.
 * @returns {HTMLElement} Gefundenes Element.
 */
function $(id) {
    return document.getElementById(id);
}


/**
 * Blendet ein Element ein oder aus.
 * @param {string} id Element-ID.
 * @param {boolean} visible Sichtbarkeit.
 */
function setVisible(id, visible) {
    $(id).classList.toggle('d-none', !visible);
}


/**
 * Prueft, ob ein Element sichtbar ist.
 * @param {string} id Element-ID.
 * @returns {boolean} Sichtbarkeit.
 */
function isVisible(id) {
    return !$(id).classList.contains('d-none');
}


/**
 * Erkennt Touch-Geraete anhand von Zeigertyp und User-Agent.
 * @returns {boolean} Ob ein mobiles Geraet erkannt wurde.
 */
function isMobile() {
    const regex = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    return window.matchMedia('(pointer: coarse)').matches || regex.test(navigator.userAgent);
}


/**
 * Zeigt die Touch-Steuerung nur im aktiven Spiel auf Touchgeraeten.
 * @param {boolean} visible Gewuenschte Sichtbarkeit.
 */
function setMobileControls(visible) {
    setVisible('mobileButtons', visible && isMobile());
}


/** Beendet ein laufendes Spiel samt Zeichenschleife, Timern und Sounds. */
function stopCurrentGame() {
    if (world) world.stop();
    world = null;
    IntervalHub.stopAllInterval();
    AudioHub.stopAll();
    releaseAllKeys();
    pausedForPortrait = false;
}


/** Startet ein neues Spiel und blendet alle Menues aus. */
function startGame() {
    stopCurrentGame();
    ['startScreen', 'gameOverScreen', 'optModal'].forEach(id => setVisible(id, false));
    setVisible('ingameOpt', true);
    setMobileControls(true);
    world = new World($('canvas'));
}


/** Beendet das Spiel und kehrt zum Startbildschirm zurueck. */
function goHome() {
    stopCurrentGame();
    ['gameOverScreen', 'ingameOpt', 'optModal'].forEach(id => setVisible(id, false));
    setMobileControls(false);
    setVisible('startScreen', true);
    setStartButtonsVisible(true);
}


/**
 * Blendet die Buttons des Startbildschirms ein oder aus.
 * @param {boolean} visible Sichtbarkeit.
 */
function setStartButtonsVisible(visible) {
    setVisible('startBtn', visible);
    setVisible('optBtnStart', visible);
}


/** Pausiert Timer, Sounds und Touch-Steuerung des laufenden Spiels. */
function pauseGame() {
    IntervalHub.pauseAllInterval();
    AudioHub.stopAll();
    releaseAllKeys();
    setMobileControls(false);
}


/** Setzt ein pausiertes Spiel fort. */
function resumeGame() {
    IntervalHub.resumeAllInterval();
    AudioHub.resume(AudioHub.GAME_SOUND);
    setMobileControls(true);
}


/**
 * Oeffnet das Optionsmenue im Start-, Spiel- oder Endkontext.
 * @param {'start'|'ingame'|'ended'} context Kontext, aus dem das Menue geoeffnet wird.
 */
function openOptions(context) {
    optionsContext = context;
    setVisible('startBtnOpt', context !== 'start');
    setVisible('leaveBtnOpt', context !== 'start');
    if (context === 'start') setStartButtonsVisible(false);
    if (context === 'ingame') pauseGame();
    setVisible('optModal', true);
}


/** Schliesst das Optionsmenue und stellt den vorherigen Zustand wieder her. */
function closeOptions() {
    setVisible('optModal', false);
    if (optionsContext === 'start') setStartButtonsVisible(true);
    if (optionsContext === 'ingame') resumeGame();
}


/** Oeffnet das Optionsmenue waehrend oder nach einer Partie. */
function openGameOptions() {
    openOptions(world && world.isStopped ? 'ended' : 'ingame');
}


/**
 * Wechselt vom Optionsmenue in einen Unterdialog.
 * @param {string} id ID des Unterdialogs.
 */
function openSubDialog(id) {
    setVisible('optModal', false);
    setVisible(id, true);
}


/**
 * Schliesst einen Unterdialog und kehrt zum Optionsmenue zurueck.
 * @param {string} id ID des Unterdialogs.
 */
function closeSubDialog(id) {
    setVisible(id, false);
    setVisible('optModal', true);
}


/**
 * Schliesst den gerade offenen Dialog, wenn ausserhalb davon geklickt wird.
 * @param {PointerEvent} event Zeigerereignis.
 */
function closeDialogOnOutsideClick(event) {
    const openSub = Object.values(SUB_DIALOGS).find(isVisible);
    if (openSub && !$(openSub).contains(event.target)) return closeSubDialog(openSub);
    if (isVisible('optModal') && !$('optModal').contains(event.target)) closeOptions();
}


/** Aktualisiert das Lautsprecher-Icon passend zum Stummschaltungsstatus. */
function updateAudioIcon() {
    const icon = AudioHub.isMuted ? 'stumm.png' : 'klang.png';
    $('audioBtn').querySelector('img').src = `./assets/img/icons/${icon}`;
}


/** Schaltet alle Sounds stumm oder frei und speichert den Status. */
function toggleMute() {
    AudioHub.toggleMute();
    updateAudioIcon();
}


/**
 * Prueft, ob gerade eine Partie aktiv und nicht pausiert ist.
 * @returns {boolean} Ob das Spiel laeuft.
 */
function isGameRunning() {
    return world !== null && !world.isStopped && !isVisible('optModal') && !pausedForPortrait;
}


/** Pausiert eine aktive Partie im Hochformat und setzt sie im Querformat fort. */
function syncGameOrientation() {
    if (!isMobile()) return;
    const isPortrait = window.matchMedia('(orientation: portrait)').matches;
    if (isPortrait && isGameRunning()) {
        pauseGame();
        pausedForPortrait = true;
    } else if (!isPortrait && pausedForPortrait) {
        pausedForPortrait = false;
        resumeGame();
    }
}


/** Zeigt in der Steuerungsbeschreibung auf Touchgeraeten die Touch-Symbole. */
function updateControlIcons() {
    if (!isMobile()) return;
    ['walkLeftButton', 'walkRightButton', 'jumpButton', 'throwButton'].forEach(id => {
        const image = $(`${id}-image`);
        image.src = $(id).querySelector('img').src;
        image.classList.add('touch-icon');
    });
}


/** Blendet nach Spielende die Touch-Steuerung aus; Menue- und Ton-Button bleiben sichtbar. */
function handleGameEnded() {
    setMobileControls(false);
}


/** Registriert alle Klick-Handler der Menues und Dialoge. */
function bindMenuButtons() {
    $('startBtn').addEventListener('click', startGame);
    $('restartBtn').addEventListener('click', startGame);
    $('startBtnOpt').addEventListener('click', startGame);
    $('homeBtn').addEventListener('click', goHome);
    $('leaveBtnOpt').addEventListener('click', goHome);
    $('audioBtn').addEventListener('click', toggleMute);
    $('optBtnStart').addEventListener('click', () => openOptions('start'));
    $('optBtnOverlay').addEventListener('click', openGameOptions);
    bindDialogButtons();
}


/** Registriert die Buttons zum Oeffnen und Schliessen der Unterdialoge. */
function bindDialogButtons() {
    document.querySelectorAll('[data-close-options]').forEach(btn => btn.addEventListener('click', closeOptions));
    Object.entries(SUB_DIALOGS).forEach(([btnId, dialogId]) =>
        $(btnId).addEventListener('click', () => openSubDialog(dialogId)));
    document.querySelectorAll('[data-close-dialog]').forEach(btn => btn.addEventListener('click',
        () => closeSubDialog(btn.dataset.closeDialog)));
}


/** Initialisiert Menues, Steuerung, Audio-Status und Orientierungspruefung. */
function initPage() {
    bindMenuButtons();
    initControls();
    AudioHub.loadMuteState();
    updateAudioIcon();
    updateControlIcons();
    document.addEventListener('pointerdown', closeDialogOnOutsideClick);
    window.addEventListener('gameended', handleGameEnded);
    window.addEventListener('resize', syncGameOrientation);
    window.addEventListener('orientationchange', syncGameOrientation);
}

initPage();
