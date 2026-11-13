import { MyAudio } from "./audio.class.js";

/** Zentrale statische Verwaltung aller Spiel-Audios und ihrer Wiedergabe. */
export class AudioHub {
    static GAME_SOUND = new MyAudio('./assets/audio/background_music.mp3', true);
    static WALK_SOUND = new MyAudio('./assets/audio/walking.mp3', true);
    static JUMP_SOUND = new MyAudio('./assets/audio/jump.mp3', false);
    static HURT_SOUND = new MyAudio('./assets/audio/pepe_hurt.mp3', false);
    static DEAD_SOUND = new MyAudio('./assets/audio/pepe_dead.mp3', false);
    static SNOR_SOUND = new MyAudio('./assets/audio/pepe_snoring.mp3', true);
    static COIN_SOUND = new MyAudio('./assets/audio/pick_coin2.wav', false);
    static BOTL_PICK = new MyAudio('./assets/audio/pick_bottle.mp3', false);
    static BOTL_BREAK = new MyAudio('./assets/audio/bottleBreak.mp3', false);
    static CHIC_DEAD = new MyAudio('./assets/audio/enemy_dead.mp3', false);
    static BOSS_DEAD = new MyAudio('./assets/audio/endboss_dead.mp3', false);
    static BOSS_HURT = new MyAudio('./assets/audio/endboss_hurt.mp3', false);
    static BOSS_ALERT = new MyAudio('./assets/audio/endboss_alert.mp3', false);
    static BOSS_ATTACK = new MyAudio('./assets/audio/endboss_attack.mp3', false);

    static WIN_SOUND = new MyAudio('./assets/audio/win.mp3', false);
    static GAME_OVER = new MyAudio('', false);

    static allSounds = [
        AudioHub.GAME_SOUND, 
        AudioHub.WALK_SOUND, 
        AudioHub.JUMP_SOUND, 
        AudioHub.HURT_SOUND, 
        AudioHub.DEAD_SOUND, 
        AudioHub.SNOR_SOUND,
        AudioHub.COIN_SOUND,
        AudioHub.BOTL_PICK,
        AudioHub.BOTL_BREAK,
        AudioHub.CHIC_DEAD,
        AudioHub.BOSS_DEAD,
        AudioHub.BOSS_HURT,
        AudioHub.BOSS_ALERT,
        AudioHub.BOSS_ATTACK,
        AudioHub.WIN_SOUND
    ];

    static isMuted = true;

    /** Schaltet alle registrierten Audios gemeinsam stumm oder frei. @returns {boolean} Aktueller Stummschaltungsstatus. */
    static toggleMute() {
        AudioHub.isMuted = !AudioHub.isMuted;
        AudioHub.allSounds.forEach((sound) => {
            if (sound && sound.file) {
                sound.file.muted = this.isMuted;
            }
        });        
        return AudioHub.isMuted;
    }

    /** Startet ein Audio ab Position null, sofern eine gueltige Quelle vorliegt. @param {MyAudio} sound Audioobjekt. */
    static playOne(sound) {
        if (sound && sound.file) {
            sound.file.currentTime = 0;
            sound.file.volume = 0.3;
            let playPromise = sound.file.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                });
            }
        }
    }

    /** Pausiert alle registrierten Audioquellen. */
    static stopAll() {
        AudioHub.allSounds.forEach((sound) => {
            if (sound && sound.file) {
                sound.file.pause();
            }
        });
    }

    /** Pausiert eine einzelne Audioquelle. @param {MyAudio} sound Audioobjekt. */
    static stopOne(sound) {
        if (sound && sound.file) {
            sound.file.pause();
        }
    }
}