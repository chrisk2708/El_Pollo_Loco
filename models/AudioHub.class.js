import { MyAudio } from "./audio.class.js";

export class AudioHub {
    // Audiodateien
    static WALK_SOUND = new MyAudio('./audio/walking.mp3', true);
    static JUMP_SOUND = new MyAudio('./audio/jump.mp3', true);
    static HURT_SOUND = new MyAudio('./audio/pepe_hurt.mp3', true);
    static DEAD_SOUND = new MyAudio('./audio/pepe_dead.mp3', true);
    static SNOR_SOUND = new MyAudio('./audio/pepe_snoring.mp3', true);

    // Array, mit allen Audio-Dateien
    static allSounds = [AudioHub.WALK_SOUND, AudioHub.JUMP_SOUND, AudioHub.HURT_SOUND, AudioHub.DEAD_SOUND, AudioHub.SNOR_SOUND];

    // Stummschaltung
    static isMuted = true;

    // Schaltet den Mute-Status um
    static toggleMute() {
        AudioHub.isMuted = !AudioHub.isMuted;
        
        // Wenn stumm -> alle Sounds pausieren
        if (AudioHub.isMuted) {
            AudioHub.stopAll();
        }
        return AudioHub.isMuted;
    }

    // Spielt eine einzelne Audiodatei ab
    static playOne(sound) {
        // Wenn stumm, gar nicht erst abspielen
        if (AudioHub.isMuted) return;
            sound.file.currentTime = 0;

        if (sound.file.readyState === 4 || sound.isLoaded) {
            sound.isLoaded = true;
            sound.file.play();
        }

        // sound.file.play().catch((error) => {
        //     console.log("Audio konnte nicht abgespielt werden:", error);
        // });
    }

    // Stoppt das Abspielen aller Audiodateien
    static stopAll() {
        AudioHub.allSounds.forEach((sound) => {
            sound.file.pause();
        });
    }

    // Stoppt das Abspielen einer einzelnen Audiodatei
    static stopOne(sound) {
        sound.file.pause();
    }
}