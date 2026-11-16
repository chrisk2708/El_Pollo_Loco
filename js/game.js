import { AudioHub } from "../classes/audio-hub.class.js";
import { IntervalHub } from "../classes/interval-hub.class.js";
import { World } from "../classes/world.class.js";
import { initControls, releaseAllKeys } from "./controls.js";

let world = null;
let optionsContext = 'start';
let pausedForPortrait = false;

/** Maps the menu buttons to their sub dialogs. */
const SUB_DIALOGS = {
    controlDescriptionBtn: 'controlDescription',
    gameDescriptionBtn: 'gameDescription',
    imprintBtn: 'imprintDialog',
    privacyBtn: 'privacyDialog'
};

/**
 * Shorthand for document.getElementById.
 * @param {string} id Element ID.
 * @returns {HTMLElement} Found element.
 */
function $(id) {
    return document.getElementById(id);
}


/**
 * Shows or hides an element.
 * @param {string} id Element ID.
 * @param {boolean} visible Visibility.
 */
function setVisible(id, visible) {
    $(id).classList.toggle('d-none', !visible);
}


/**
 * Checks whether an element is visible.
 * @param {string} id Element ID.
 * @returns {boolean} Visibility.
 */
function isVisible(id) {
    return !$(id).classList.contains('d-none');
}


/**
 * Detects touch devices by pointer type and user agent.
 * @returns {boolean} Whether a mobile device was detected.
 */
function isMobile() {
    const regex = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    return window.matchMedia('(pointer: coarse)').matches || regex.test(navigator.userAgent);
}


/**
 * Shows the touch controls only during an active game on touch devices.
 * @param {boolean} visible Desired visibility.
 */
function setMobileControls(visible) {
    setVisible('mobileButtons', visible && isMobile());
}


/** Stops a running game including render loop, timers and sounds. */
function stopCurrentGame() {
    if (world) world.stop();
    world = null;
    IntervalHub.stopAllInterval();
    AudioHub.stopAll();
    releaseAllKeys();
    pausedForPortrait = false;
}


/** Starts a new game and hides all menus. */
function startGame() {
    stopCurrentGame();
    ['startScreen', 'gameOverScreen', 'optModal'].forEach(id => setVisible(id, false));
    setVisible('ingameOpt', true);
    setMobileControls(true);
    world = new World($('canvas'));
}


/** Ends the game and returns to the start screen. */
function goHome() {
    stopCurrentGame();
    ['gameOverScreen', 'ingameOpt', 'optModal'].forEach(id => setVisible(id, false));
    setMobileControls(false);
    setVisible('startScreen', true);
    setStartButtonsVisible(true);
}


/**
 * Shows or hides the buttons of the start screen.
 * @param {boolean} visible Visibility.
 */
function setStartButtonsVisible(visible) {
    setVisible('startBtn', visible);
    setVisible('optBtnStart', visible);
    setVisible('fullscreenBtnStart', visible);
}


/** Pauses timers, sounds and touch controls of the running game. */
function pauseGame() {
    IntervalHub.pauseAllInterval();
    AudioHub.stopAll();
    releaseAllKeys();
    setMobileControls(false);
}


/** Resumes a paused game. */
function resumeGame() {
    IntervalHub.resumeAllInterval();
    AudioHub.resume(AudioHub.GAME_SOUND);
    setMobileControls(true);
}


/**
 * Opens the options menu in the start, ingame or ended context.
 * @param {'start'|'ingame'|'ended'} context Context from which the menu is opened.
 */
function openOptions(context) {
    optionsContext = context;
    setVisible('startBtnOpt', context !== 'start');
    setVisible('leaveBtnOpt', context !== 'start');
    if (context === 'start') setStartButtonsVisible(false);
    if (context === 'ingame') pauseGame();
    setVisible('optModal', true);
}


/** Closes the options menu and restores the previous state. */
function closeOptions() {
    setVisible('optModal', false);
    if (optionsContext === 'start') setStartButtonsVisible(true);
    if (optionsContext === 'ingame') resumeGame();
}


/** Opens the options menu during or after a game. */
function openGameOptions() {
    openOptions(world && world.isStopped ? 'ended' : 'ingame');
}


/**
 * Switches from the options menu to a sub dialog.
 * @param {string} id ID of the sub dialog.
 */
function openSubDialog(id) {
    setVisible('optModal', false);
    setVisible(id, true);
}


/**
 * Closes a sub dialog and returns to the options menu.
 * @param {string} id ID of the sub dialog.
 */
function closeSubDialog(id) {
    setVisible(id, false);
    setVisible('optModal', true);
}


/**
 * Closes the currently open dialog when clicking outside of it.
 * @param {PointerEvent} event Pointer event.
 */
function closeDialogOnOutsideClick(event) {
    const openSub = Object.values(SUB_DIALOGS).find(isVisible);
    if (openSub && !$(openSub).contains(event.target)) return closeSubDialog(openSub);
    if (isVisible('optModal') && !$('optModal').contains(event.target)) closeOptions();
}


/** Updates the speaker icon according to the mute state. */
function updateAudioIcon() {
    const icon = AudioHub.isMuted ? 'stumm.png' : 'klang.png';
    $('audioBtn').querySelector('img').src = `./assets/img/icons/${icon}`;
}


/** Mutes or unmutes all sounds and saves the state. */
function toggleMute() {
    AudioHub.toggleMute();
    updateAudioIcon();
}


/**
 * Checks whether a game is currently active and not paused.
 * @returns {boolean} Whether the game is running.
 */
function isGameRunning() {
    return world !== null && !world.isStopped && !isVisible('optModal') && !pausedForPortrait;
}


/** Pauses an active game in portrait mode and resumes it in landscape mode. */
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


/** Shows the touch icons in the control description on touch devices. */
function updateControlIcons() {
    if (!isMobile()) return;
    ['walkLeftButton', 'walkRightButton', 'jumpButton', 'throwButton'].forEach(id => {
        const image = $(`${id}-image`);
        image.src = $(id).querySelector('img').src;
        image.classList.add('touch-icon');
    });
}


/**
 * Checks whether fullscreen mode is active (native or as CSS fallback).
 * @returns {boolean} Fullscreen state.
 */
function isFullscreen() {
    return document.body.classList.contains('fullscreen');
}


/**
 * Toggles the fullscreen layout and updates the buttons.
 * @param {boolean} active Desired state.
 */
function setFullscreenClass(active) {
    document.body.classList.toggle('fullscreen', active);
    const icon = active ? 'fullscreen_exit.svg' : 'fullscreen.svg';
    $('fullscreenBtn').querySelector('img').src = `./assets/img/icons/${icon}`;
    $('fullscreenBtn').setAttribute('aria-label', active ? 'Vollbild beenden' : 'Vollbild');
    $('fullscreenBtnStart').textContent = active ? 'Vollbild beenden' : 'Vollbild';
}


/**
 * Starts or exits fullscreen mode. Without the Fullscreen API (e.g. iPhone)
 * only the CSS layout is toggled.
 */
function toggleFullscreen() {
    const root = document.documentElement;
    if (document.fullscreenElement) return document.exitFullscreen().catch(() => setFullscreenClass(false));
    if (isFullscreen()) return setFullscreenClass(false);
    if (!document.fullscreenEnabled || !root.requestFullscreen) return setFullscreenClass(true);
    root.requestFullscreen().catch(() => setFullscreenClass(true));
}


/** Syncs the CSS class when the browser exits fullscreen itself (e.g. via Esc). */
function syncFullscreenState() {
    setFullscreenClass(Boolean(document.fullscreenElement));
}


/** Hides the touch controls after the game ends; menu and sound buttons stay visible. */
function handleGameEnded() {
    setMobileControls(false);
}


/** Registers all click handlers of the menus and dialogs. */
function bindMenuButtons() {
    $('startBtn').addEventListener('click', startGame);
    $('restartBtn').addEventListener('click', startGame);
    $('startBtnOpt').addEventListener('click', startGame);
    $('homeBtn').addEventListener('click', goHome);
    $('leaveBtnOpt').addEventListener('click', goHome);
    $('audioBtn').addEventListener('click', toggleMute);
    $('optBtnStart').addEventListener('click', () => openOptions('start'));
    $('optBtnOverlay').addEventListener('click', openGameOptions);
    document.querySelectorAll('[data-fullscreen-toggle]').forEach(btn => btn.addEventListener('click', toggleFullscreen));
    bindDialogButtons();
}


/** Registers the buttons for opening and closing the sub dialogs. */
function bindDialogButtons() {
    document.querySelectorAll('[data-close-options]').forEach(btn => btn.addEventListener('click', closeOptions));
    Object.entries(SUB_DIALOGS).forEach(([btnId, dialogId]) =>
        $(btnId).addEventListener('click', () => openSubDialog(dialogId)));
    document.querySelectorAll('[data-close-dialog]').forEach(btn => btn.addEventListener('click',
        () => closeSubDialog(btn.dataset.closeDialog)));
}


/** Initializes menus, controls, audio state and orientation check. */
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
    document.addEventListener('fullscreenchange', syncFullscreenState);
}

initPage();
