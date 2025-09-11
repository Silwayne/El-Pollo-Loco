class AudioManager {
    constructor() {
        this.sounds = {
            jump: new Audio("audio/sounds/sfx_jump.mp3"),
            throw: new Audio("audio/sounds/bottle-throw.mp3"),
            hurt: new Audio("audio/sounds/ough.mp3"),
            coin: new Audio("audio/sounds/coin.mp3"),
            bottle: new Audio("audio/sounds/bottle-up.mp3"),
            bottleSmash: new Audio("audio/sounds/glass-bottle-smash.mp3"),
            enemyDead: new Audio("audio/sounds/chick-sound.mp3"),
            boss: new Audio("audio/sounds/cocorico.mp3"),
            snoring: new Audio("audio/sounds/male-snoring.mp3"),
            background: new Audio("audio/music/acoustic-mexican-guitar.mp3"),
            win: new Audio("audio/music/brass-fanfare-with-timpani-and-winchimes-reverberated.mp3"),
            gameOver: new Audio("audio/music/game-over.mp3")
        };

        this.sounds.background.loop = true;
        this.sounds.boss.loop = true;
        this.sounds.boss.volume = 1.0;
    }

    play(name) {
    let sound = this.sounds[name];
    if (sound) {
        const clone = sound.cloneNode(); 
        clone.volume = sound.volume;     
        clone.play();
    }
}

    pause(name) {
        let sound = this.sounds[name];
        if (sound) {
            sound.pause();
        }
    }
}