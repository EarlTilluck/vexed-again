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
  // array, each value corresponds to best try ...
  bestArray: Array<string> =[];
  // array, each value corresponds to par ...
  parArray: Array<number> = [];

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
     // as well as best try and par
     this.lastAvailableLevel = -1;
     for (let i = 0; i < levels.length; i++) {
       this.passArray[i] = this.vexed.getPass(i);
       const best = this.vexed.getBest(i);
       if (best === 0) {
         this.bestArray[i] = 'n/a';
       } else {
         this.bestArray[i] = this.vexed.getBest(i) + '';
       }
       this.parArray[i] = this.vexed.currentPack.levels[i].par;
       if ( this.passArray[i] === true) {
         this.lastAvailableLevel = i;
       }
     }
     // add one to last available level so we can
     // select the first unpassed level to play as well.
     this.lastAvailableLevel++;
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
