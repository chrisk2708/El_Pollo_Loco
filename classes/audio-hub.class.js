import { MyAudio } from "./audio.class.js";

/** Central static management of all game sounds, their playback and muting. */
export class AudioHub {
    static GAME_SOUND = new MyAudio('./assets/audio/background_music.mp3', true, 0.2);
    static WALK_SOUND = new MyAudio('./assets/audio/walking.mp3', true, 0.25);
    static JUMP_SOUND = new MyAudio('./assets/audio/jump.mp3');
    static HURT_SOUND = new MyAudio('./assets/audio/pepe_hurt.mp3');
    static DEAD_SOUND = new MyAudio('./assets/audio/pepe_dead.mp3');
    static SNOR_SOUND = new MyAudio('./assets/audio/pepe_snoring.mp3', true);
    static COIN_SOUND = new MyAudio('./assets/audio/pick_coin2.wav', false, 0.2);
    static BOTL_PICK = new MyAudio('./assets/audio/pick_bottle.mp3');
    static BOTL_BREAK = new MyAudio('./assets/audio/bottleBreak.mp3');
    static CHIC_DEAD = new MyAudio('./assets/audio/enemy_dead.mp3', false, 0.2);
    static BOSS_DEAD = new MyAudio('./assets/audio/endboss_dead.mp3');
    static BOSS_HURT = new MyAudio('./assets/audio/endboss_hurt.mp3', false, 0.2);
    static BOSS_ALERT = new MyAudio('./assets/audio/endboss_alert.mp3');
    static BOSS_ATTACK = new MyAudio('./assets/audio/endboss_attack.mp3');
    static WIN_SOUND = new MyAudio('./assets/audio/win.mp3', false, 0.2);

    static allSounds = [
        AudioHub.GAME_SOUND, AudioHub.WALK_SOUND, AudioHub.JUMP_SOUND, AudioHub.HURT_SOUND,
        AudioHub.DEAD_SOUND, AudioHub.SNOR_SOUND, AudioHub.COIN_SOUND, AudioHub.BOTL_PICK,
        AudioHub.BOTL_BREAK, AudioHub.CHIC_DEAD, AudioHub.BOSS_DEAD, AudioHub.BOSS_HURT,
        AudioHub.BOSS_ALERT, AudioHub.BOSS_ATTACK, AudioHub.WIN_SOUND
    ];

    static storageKey = 'elPolloLocoMuted';
    static isMuted = true;

    /** Reads the saved mute state and applies it to all sounds. */
    static loadMuteState() {
        let stored = null;
        try {
            stored = localStorage.getItem(AudioHub.storageKey);
        } catch (error) {
            stored = null;
        }
        AudioHub.setMuted(stored === null ? true : stored === 'true');
    }

    /**
     * Sets the mute state for all sounds and saves it in local storage.
     * @param {boolean} muted New state.
     */
    static setMuted(muted) {
        AudioHub.isMuted = muted;
        AudioHub.allSounds.forEach(sound => sound.file.muted = muted);
        try {
            localStorage.setItem(AudioHub.storageKey, String(muted));
        } catch (error) {
            return;
        }
    }

    /**
     * Mutes or unmutes all sounds together.
     * @returns {boolean} New mute state.
     */
    static toggleMute() {
        AudioHub.setMuted(!AudioHub.isMuted);
        return AudioHub.isMuted;
    }

    /**
     * Plays a sound from position zero.
     * @param {MyAudio} sound Audio object.
     */
    static playOne(sound) {
        sound.file.currentTime = 0;
        AudioHub.resume(sound);
    }

    /**
     * Resumes a sound at its current position and ignores autoplay restrictions.
     * @param {MyAudio} sound Audio object.
     */
    static resume(sound) {
        const playPromise = sound.file.play();
        if (playPromise) playPromise.catch(() => {});
    }

    /** Pauses all registered audio sources. */
    static stopAll() {
        AudioHub.allSounds.forEach(sound => sound.file.pause());
    }

    /**
     * Pauses a single audio source.
     * @param {MyAudio} sound Audio object.
     */
    static stopOne(sound) {
        sound.file.pause();
    }
}
