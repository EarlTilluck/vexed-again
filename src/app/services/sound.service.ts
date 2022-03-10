import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SoundService {

  // audio HTML element
  audio = new Audio();

  // block sound if play called multiple times
  blockSound = false;

  // sound resources
  swish = 'assets/sound/mixkit-arcade-game-jump-coin-216.ogg';
  vanish = 'assets/sound/mixkit-unlock-game-notification-253.ogg';


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
    // load sound, if Y or X block calls this function,
    // it will do nothing.
    switch(name) {
      case 'vanish': this.audio.src = this.vanish; break;
      case 'swish': this.audio.src = this.swish; break;
    }
    this.audio.load();
    this.audio.volume = 0.5;
    // block further sound play, then...
    this.blockSound = true;
    // play audio, then unblock sound play
    this.audio.play().then(()=>{
      this.blockSound = false;
    });

  }


}
