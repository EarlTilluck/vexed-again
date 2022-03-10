import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SoundService {

  // volume of audio
  volume = 1;

  // block sound if play called multiple times
  blockSound = false;

  // sound resources
  swish = new Audio('assets/sound/mixkit-arcade-game-jump-coin-216.ogg');
  vanish = new Audio('assets/sound/mixkit-unlock-game-notification-253.ogg');


  constructor() {
    // load all sounds over network and into memory
    // so it is ready to play immediately
    this.swish.load();
    this.vanish.load();
  }


  /**
   * Play given sound. Only plays one sound at a time.
   *
   * @param name name of sound
   */
  playSound(name: string): void {

    // do nothing if blocking sound
    if(this.blockSound === true) {
      return;
    }

    console.log('playing '+ name);

    // create temp holder for audio
    let audio: HTMLAudioElement = null;
    // load sound, if Y or X block calls this function,
    // it will do nothing.
    switch(name) {
      case 'vanish': audio = this.vanish; break;
      case 'swish': audio = this.swish; break;
    }

    audio.volume = this.volume;
    // block further sound play, then...
    this.blockSound = true;
    // play audio, then unblock sound play
    audio.play().then(()=>{
      this.blockSound = false;
    });

  }


}
