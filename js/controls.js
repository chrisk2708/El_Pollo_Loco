import { Keyboard } from "../classes/keyboard.class.js";

const keyMap = {
    Space: 'SPACE',
    KeyB: 'B',
    ArrowLeft: 'LEFT',
    ArrowUp: 'UP',
    ArrowRight: 'RIGHT',
    ArrowDown: 'DOWN'
};

const touchButtons = {
    walkLeftButton: 'LEFT',
    walkRightButton: 'RIGHT',
    jumpButton: 'SPACE',
    throwButton: 'B'
};

/**
 * Sets the state of a key if it belongs to the game controls.
 * @param {KeyboardEvent} event Keyboard event.
 * @param {boolean} pressed Whether the key is pressed.
 */
function setKey(event, pressed) {
    const key = keyMap[event.code];
    if (!key) return;
    Keyboard[key] = pressed;
    if (event.code === 'Space' && event.target === document.body) event.preventDefault();
}


/** Resets all control flags, e.g. when pausing. */
export function releaseAllKeys() {
    Object.values(keyMap).forEach(key => Keyboard[key] = false);
}


/**
 * Connects a touch button to a control flag.
 * @param {string} id Button ID.
 * @param {string} key Name of the flag in Keyboard.
 */
function bindTouchButton(id, key) {
    const button = document.getElementById(id);
    const press = (pressed) => (event) => {
        if (event.cancelable) event.preventDefault();
        Keyboard[key] = pressed;
    };
    button.addEventListener('touchstart', press(true), { passive: false });
    button.addEventListener('touchend', press(false), { passive: false });
    button.addEventListener('touchcancel', press(false), { passive: false });
}


/** Registers keyboard and touch controls and blocks the context menu of the touch buttons. */
export function initControls() {
    window.addEventListener('keydown', (event) => setKey(event, true));
    window.addEventListener('keyup', (event) => setKey(event, false));
    Object.entries(touchButtons).forEach(([id, key]) => bindTouchButton(id, key));
    document.getElementById('mobileButtons').addEventListener('contextmenu', (event) => event.preventDefault());
}
