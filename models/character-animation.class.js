Character.IMAGES_IDLE = [
  "img/2_character_pepe/1_idle/idle/I-1.png",
  "img/2_character_pepe/1_idle/idle/I-2.png",
  "img/2_character_pepe/1_idle/idle/I-3.png",
  "img/2_character_pepe/1_idle/idle/I-4.png",
  "img/2_character_pepe/1_idle/idle/I-5.png",
  "img/2_character_pepe/1_idle/idle/I-6.png",
  "img/2_character_pepe/1_idle/idle/I-7.png",
  "img/2_character_pepe/1_idle/idle/I-8.png",
  "img/2_character_pepe/1_idle/idle/I-9.png",
  "img/2_character_pepe/1_idle/idle/I-10.png",
];

Character.IMAGES_WALKING = [
  "img/2_character_pepe/2_walk/W-21.png",
  "img/2_character_pepe/2_walk/W-22.png",
  "img/2_character_pepe/2_walk/W-23.png",
  "img/2_character_pepe/2_walk/W-24.png",
  "img/2_character_pepe/2_walk/W-25.png",
  "img/2_character_pepe/2_walk/W-26.png",
];

Character.IMAGES_JUMPING = [
  "img/2_character_pepe/3_jump/J-31.png",
  "img/2_character_pepe/3_jump/J-32.png",
  "img/2_character_pepe/3_jump/J-33.png",
  "img/2_character_pepe/3_jump/J-34.png",
  "img/2_character_pepe/3_jump/J-35.png",
  "img/2_character_pepe/3_jump/J-36.png",
  "img/2_character_pepe/3_jump/J-37.png",
  "img/2_character_pepe/3_jump/J-38.png",
  "img/2_character_pepe/3_jump/J-39.png",
];

Character.IMAGES_DEAD = [
  "img/2_character_pepe/5_dead/D-51.png",
  "img/2_character_pepe/5_dead/D-52.png",
  "img/2_character_pepe/5_dead/D-53.png",
  "img/2_character_pepe/5_dead/D-54.png",
  "img/2_character_pepe/5_dead/D-55.png",
  "img/2_character_pepe/5_dead/D-56.png",
  "img/2_character_pepe/5_dead/D-57.png",
];

Character.IMAGES_HURT = [
  "img/2_character_pepe/4_hurt/H-41.png",
  "img/2_character_pepe/4_hurt/H-42.png",
  "img/2_character_pepe/4_hurt/H-43.png",
];

Character.IMAGES_DOZE = [
  "img/2_character_pepe/1_idle/idle/I-3.png",
  "img/2_character_pepe/1_idle/idle/I-5.png",
  "img/2_character_pepe/1_idle/idle/I-6.png",
  "img/2_character_pepe/1_idle/idle/I-7.png",
  "img/2_character_pepe/1_idle/idle/I-8.png",
  "img/2_character_pepe/1_idle/idle/I-9.png",
  "img/2_character_pepe/1_idle/idle/I-10.png",
];

Character.IMAGES_SLEEP = [
  "img/2_character_pepe/1_idle/long_idle/I-11.png",
  "img/2_character_pepe/1_idle/long_idle/I-12.png",
  "img/2_character_pepe/1_idle/long_idle/I-13.png",
  "img/2_character_pepe/1_idle/long_idle/I-14.png",
  "img/2_character_pepe/1_idle/long_idle/I-15.png",
  "img/2_character_pepe/1_idle/long_idle/I-16.png",
  "img/2_character_pepe/1_idle/long_idle/I-17.png",
  "img/2_character_pepe/1_idle/long_idle/I-18.png",
  "img/2_character_pepe/1_idle/long_idle/I-19.png",
  "img/2_character_pepe/1_idle/long_idle/I-20.png",
];

class CharacterAnimation {
  constructor(character) {
    this.character = character;
  }

  /** Main animation handler **/
  handleAnimation() {
    const c = this.character;

    if (c.isDead && c.isDead()) return this.playDeadAnimation();
    if (c.isHurt && c.isHurt()) return this.playHurtAnimation();
    if (c.isThrowing) return this.playThrowAnimation();

    this.handleStandardAnimations();
  }

  /** Handles walking, jumping or idle animations **/
  handleStandardAnimations() {
    const c = this.character;

    if (c.isAboveGround()) this.playJumpAnimation();
    else if (c.world && (c.world.keyboard.D || c.world.keyboard.A))
      this.playWalkAnimation();
    else this.handleIdleAnimations();
  }

  /** Plays idle, doze and sleep states **/
  handleIdleAnimations() {
    const c = this.character;
    const idleTime = c.getIdleTime();

    if (!c.isDozing && !c.isSleeping) c.playIdleAnimation();

    if (!c.isDozing && !c.isSleeping && idleTime >= c.DOZE_TIMEOUT) {
      c.startDoze();
    }

    if (!c.isSleeping && idleTime >= c.SLEEP_TIMEOUT) {
      c.startSleep();
    }

    if (c.isSleeping) c.playSleepAnimation();
    else if (c.isDozing) c.playDozeAnimation();
  }

  /** Plays death animation **/
  playDeadAnimation() {
    this.character.playAnimation(Character.IMAGES_DEAD);
  }

  /** Plays hurt animation **/
  playHurtAnimation() {
    const c = this.character;
    c.playAnimation(Character.IMAGES_HURT);
    setTimeout(() => {
      if (!c.isHurt()) c.resetAnimationState();
    }, 1000);
  }

  // /** Plays jumping animation **/
  // playJumpAnimation() {
  //   const c = this.character;
  //   const frames = Character.IMAGES_JUMPING;
  //   if (frames && frames.length > 0) {
  //     let frameIndex = Math.floor(Date.now() / 100) % frames.length;
  //     let imagePath = frames[frameIndex];
  //     if (c.imageCache[imagePath]) c.img = c.imageCache[imagePath];
  //   }
  // }

/** Plays jumping animation - super simple based on speedY */
playJumpAnimation() {
  const c = this.character;
  const frames = Character.IMAGES_JUMPING;
  
  if (frames && frames.length > 0) {
    let frameIndex = 0;
    
    if (c.isAboveGround()) {
      if (c.speedY > 20) frameIndex = 1;   
      else if (c.speedY > 10) frameIndex = 2;  
      else if (c.speedY > 0) frameIndex = 3;
      else if (c.speedY > -10) frameIndex = 4; 
      else if (c.speedY > -20) frameIndex = 5; 
      else if (c.speedY > -30) frameIndex = 6; 
      else frameIndex = 7;                     
    }
    
    frameIndex = Math.min(frameIndex, frames.length - 1);
    
    let imagePath = frames[frameIndex];
    if (c.imageCache[imagePath]) {
      c.img = c.imageCache[imagePath];
    }
  }
}

  /** Plays walking animation **/
  playWalkAnimation() {
    const c = this.character;
    const frames = Character.IMAGES_WALKING;
    if (frames && frames.length > 0) {
      let frameIndex = Math.floor(Date.now() / 150) % frames.length;
      let imagePath = frames[frameIndex];
      if (c.imageCache[imagePath]) c.img = c.imageCache[imagePath];
    }
  }

  /** Plays throw animation **/
  playThrowAnimation() {
    this.character.playAnimation(Character.IMAGES_JUMPING);
  }
}
