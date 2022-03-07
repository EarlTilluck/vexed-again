import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { Level } from '../models/level.model';
import { LevelPack } from '../models/LevelPack.model';
import { UiService } from '../services/ui.service';
import { VexedService } from '../services/vexed.service';

@Component({
  selector: 'app-level-select-modal',
  templateUrl: './level-select-modal.component.html',
  styleUrls: ['./level-select-modal.component.scss'],
})
export class LevelSelectModalComponent implements OnInit {


  selectedLevel = '0';

  // array, each value corresponds to 'level passed' value
  // in corresponding level in levels array in
  // current game pack in vexed service.
  passArray: Array<boolean> = [];

  constructor(
    private modalController: ModalController,
    private toastController: ToastController,
    public vexed: VexedService,
    private ui: UiService
  ) { }

  ngOnInit() {

    // load data on init
    // selectLevels event is not captured on first load.
    this.loadLevelData();

    // load data when menu button clicked
    this.ui.selectLevels.subscribe(()=>{
      this.loadLevelData();
    });
   }

   /**
    * load the data for each level from
    * local storage to display on screen
    */
   loadLevelData(): void {
     // get levels for currently selected game pack...
     const levels: Array<Level> = this.vexed.currentPack.levels;
     // for each level find and place 'already passed' value
     for (let i = 0; i < levels.length; i++) {
       this.passArray[i] = this.vexed.getPass(i);
     }
   }


   /**
    * Load the level selected on screen
    *
    * @param id index of level
    */
   onSelectLevel(id: number): void {
    this.modalController.dismiss();
    this.vexed.loadLevel(id);
   }


  onDissmissModal(): void {
    this.modalController.dismiss();
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'You must clear previous level first.',
      duration: 2000
    });
    toast.present();
  }
}
