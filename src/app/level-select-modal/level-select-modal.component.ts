import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Level } from '../models/level.model';
import { UiService } from '../services/ui.service';
import { VexedService } from '../services/vexed.service';

@Component({
  selector: 'app-level-select-modal',
  templateUrl: './level-select-modal.component.html',
  styleUrls: ['./level-select-modal.component.scss'],
})
export class LevelSelectModalComponent implements OnInit {


  // last level available to be played
  lastAvailableLevel = 0;

  // array, each value corresponds to 'level passed' value
  // in corresponding level in levels array in
  // current game pack in vexed service.
  passArray: Array<boolean> = [];

  constructor(
    private modalController: ModalController,
    public vexed: VexedService,
    private ui: UiService
  ) { }

  ngOnInit() {

    // load data on init
    // selectLevels event may not be captured on first load.
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
     this.lastAvailableLevel = 0;
     for (let i = 0; i < levels.length; i++) {
       this.passArray[i] = this.vexed.getPass(i);
       if ( this.passArray[i] === true) {
         this.lastAvailableLevel = i;
       }
     }
     // add one to last available level so we can
     // select the first unpassed level to play as well.
     if(this.lastAvailableLevel !== 0) {
       this.lastAvailableLevel++;
     }
     console.log((this.lastAvailableLevel));
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

}
