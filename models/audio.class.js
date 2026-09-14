/** Repraesentiert eine einzelne Audioquelle des Spiels und ihre Wiedergabeeinstellungen. */
export class MyAudio {
    file;
    isLoaded = false;

    /** Erzeugt ein HTMLAudioElement und konfiguriert Schleife und Stummschaltung. @param {string} _file Audioquellpfad. @param {boolean} loop Ob die Quelle wiederholt wird. @param {boolean} isMuted Anfangsstatus der Stummschaltung. */
    constructor(_file, loop = false, isMuted = true){
        this.file = new Audio(_file);
        this.file.loop = loop;
        this.file.muted = isMuted;
    }
}