import { Component, Input, OnInit } from '@angular/core';
import { Level } from '../models/level.model';
import { LevelPack } from '../models/LevelPack.model';
import { UiService } from '../services/ui.service';
import { VexedService } from '../services/vexed.service';

@Component({
  selector: 'app-game-pack-item',
  templateUrl: './game-pack-item.component.html',
  styleUrls: ['./game-pack-item.component.scss'],
})
export class GamePackItemComponent implements OnInit {

  @Input() pack: LevelPack;
  @Input() id: number;
  @Input() end: number; // last index of all packs available

  // progress (how many levels passed)
  progress = 0;
  progressPercent = 0;
  totalLevels = 0;

  constructor(public ui: UiService, private vexed: VexedService) { }

  ngOnInit() {

    // load data on init
    // selectGamePack event may not be captured on first load.
    this.loadPackData();

    // load data when menu button clicked
    this.ui.selectGamePack.subscribe(() => {
      this.loadPackData();
    });
  }

  /**
   * load pack data for display on screen
   */
  loadPackData(): void {
    // get totalLevels
    this.totalLevels = this.pack.levels.length;
    // get progress for this pack
    const levels: Array<Level> = this.pack.levels;
    this.progress = 0;
    for(let i=0; i<levels.length; i++) {
      if(this.vexed.getPassForPackAndLevel(this.id, i)) {
        // increment progress for each level passed
        this.progress++;
      }
    }
    this.progressPercent = this.progress/this.totalLevels;

    /*
      This is supposed to hide janky modal loading
      due to the large array that ngFor operates on
      when loading these components.
    */
    if( this.id === this.end ) { // if last level
      setTimeout(() => {
        this.ui.hideSpinner.emit(true);
      }, 1500);
    }
  }

}
