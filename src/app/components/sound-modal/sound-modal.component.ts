import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SoundService } from 'src/app/services/sound.service';

@Component({
  selector: 'app-sound-modal',
  templateUrl: './sound-modal.component.html',
  styleUrls: ['./sound-modal.component.scss'],
})
export class SoundModalComponent implements OnInit {


  constructor(
    private modalController: ModalController,
    public sound: SoundService
  ) { }


  ngOnInit() {
    // when app starts, load previously saved volume setting
    this.sound.loadVolumeSetting();
  }


  /**
   * save new sound volume setting
   * and update icons
   */
  onSoundChange() {
    this.sound.update();
  }

  onDissmissModal(): void {
    this.modalController.dismiss();
  }

}
