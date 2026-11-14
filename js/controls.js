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
 * Setzt den Zustand einer Taste, sofern sie zur Spielsteuerung gehoert.
 * @param {KeyboardEvent} event Tastaturereignis.
 * @param {boolean} pressed Ob die Taste gedrueckt ist.
 */
function setKey(event, pressed) {
    const key = keyMap[event.code];
    if (!key) return;
    Keyboard[key] = pressed;
    if (event.code === 'Space' && event.target === document.body) event.preventDefault();
}


/** Setzt alle Steuerungsflags zurueck, z. B. beim Pausieren. */
export function releaseAllKeys() {
    Object.values(keyMap).forEach(key => Keyboard[key] = false);
}


/**
 * Verbindet einen Touch-Button mit einem Steuerungsflag.
 * @param {string} id ID des Buttons.
 * @param {string} key Name des Flags in Keyboard.
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


/** Registriert Tastatur- und Touch-Steuerung und sperrt das Kontextmenue der Touch-Buttons. */
export function initControls() {
    window.addEventListener('keydown', (event) => setKey(event, true));
    window.addEventListener('keyup', (event) => setKey(event, false));
    Object.entries(touchButtons).forEach(([id, key]) => bindTouchButton(id, key));
    document.getElementById('mobileButtons').addEventListener('contextmenu', (event) => event.preventDefault());
}
