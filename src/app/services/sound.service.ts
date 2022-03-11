import { Injectable } from '@angular/core';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class SoundService {

  // volume of audio
  volume = 1;

  // ui range setting
  rangeValue = 100;

  // volume icon
  iconName = 'volume-high';


  // block sound if play called multiple times
  blockSound = false;

  // sound resources
  swish = new Audio('assets/sound/mixkit-arcade-game-jump-coin-216.ogg');
  vanish = new Audio('assets/sound/mixkit-unlock-game-notification-253.ogg');
  passLevel = new Audio('assets/sound/mixkit-winning-chimes-2015.ogg');
  winGamePack = new Audio('assets/sound/mixkit-wind-chimes-2014.ogg');


  constructor(private data: DataService) {
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
    // create temp holder for audio
    let audio: HTMLAudioElement = null;
    // load sound, if Y or X block calls this function,
    // it will do nothing.
    switch(name) {
      case 'vanish': audio = this.vanish; break;
      case 'swish': audio = this.swish; break;
      case 'passLevel': audio = this.passLevel; break;
      case 'winGamePack': audio = this.winGamePack; break;
    }

    audio.volume = this.volume;
    // block further sound play, then...
    this.blockSound = true;
    // play audio, then unblock sound play
    audio.play().catch((err) => {
      console.log(err);
    }).then(()=>{
      this.blockSound = false;
    });

  }

  /**
   * Load volume setting from local storage.
   */
  loadVolumeSetting() {
    this.volume = this.data.getSound();
    this.rangeValue = this.volume * 100;
    this.updateIcon();
  }

  /**
   * When volume is adjusted,
   * save to local disk,
   * and update icon
   */
  update() {
    this.volume = this.rangeValue/100;
    this.data.saveSound(this.volume);
    this.updateIcon();
  }

  /**
   * adjust icon based on volume
   */
  updateIcon() {

    if (this.volume === 0 ) {
      this.iconName = 'volume-mute';
      return;
    }
    if(this.volume < 0.5) {
      this.iconName = 'volume-low';
      return;
    }
    if(this.volume < 0.9) {
      this.iconName = 'volume-medium';
      return;
    }
    this.iconName = 'volume-high';

  }

}
