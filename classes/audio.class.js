/** Represents a single audio source of the game and its playback settings. */
export class MyAudio {
    file;

    /**
     * Creates an HTMLAudioElement and configures loop and volume.
     * @param {string} path Audio source path.
     * @param {boolean} loop Whether the source is looped.
     * @param {number} volume Volume between 0 and 1.
     */
    constructor(path, loop = false, volume = 0.3) {
        this.file = new Audio(path);
        this.file.loop = loop;
        this.file.volume = volume;
    }
}
