/** Repraesentiert eine einzelne Audioquelle des Spiels und ihre Wiedergabeeinstellungen. */
export class MyAudio {
    file;

    /**
     * Erzeugt ein HTMLAudioElement und konfiguriert Schleife und Lautstaerke.
     * @param {string} path Audioquellpfad.
     * @param {boolean} loop Ob die Quelle wiederholt wird.
     * @param {number} volume Lautstaerke zwischen 0 und 1.
     */
    constructor(path, loop = false, volume = 0.3) {
        this.file = new Audio(path);
        this.file.loop = loop;
        this.file.volume = volume;
    }
}
