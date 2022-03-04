import { EventEmitter, Injectable } from '@angular/core';
import { DataService } from '../services/data.service';


// import levels
import BoardInfo from '../models/board-info';
import LevelsInfo from '../models/level-info';
import { LevelPack } from '../models/LevelPack.model';
import { Level } from '../models/level.model';


@Injectable({
  providedIn: 'root'
})
export class VexedService {

  // array of levels
  vexedLevels: Array<LevelPack> = [];

  // current level on screen
  currentLevel: Level;

  // current pack
  currentPack: LevelPack;

  newLevelEvent = new EventEmitter<string>();

  constructor(private data: DataService) {
    // load vexed levels from converted files
    this.loadLevels();
    // load last level played
    this.loadLastLevelPlayed(); // if never played before, starts at Tutorial 1;
  }

  /**
   * Load the levels for use in game.
   *
   * Call this function before any game logic. It
   * Loads the levels from level-info.ts and levels.ts
   * and makes it available in game.
   */
  loadLevels(): void {
    // load levels and sort them into ordered array
    // for each level in level info
    // eslint-disable-next-line guard-for-in
    for (const key in LevelsInfo) {
      // get the data describing the pack,
      const packData = LevelsInfo[key];
      // get the corresponding board data
      const boardData = BoardInfo[packData.key];
      // for each board, add it to an array
      const levels: Level[] = [];
      let count = 0;
      // eslint-disable-next-line guard-for-in
      for (const name in boardData) {
        count++;
        levels.push(
          new Level(count, name, boardData[name].board, boardData[name].par )
      );
      }
      // create the LevelPack and add it to array
      this.vexedLevels.push(
        new LevelPack(packData.name, packData.total, packData.by, packData.difficulty, packData.link, levels)
      );

    }// end for levels info
  }


  /**
   * Select a game pack, call this from menu.
   * Emits event to let game subscriber know
   *
   * @param id id of pack
   */
  selectGamePack(id: number) {
    // set the current pack
    this.currentPack = this.vexedLevels[id];
    // get last game played for this pack
    let lastLevel = this.data.getProgressForGamePack(id);
    if (lastLevel > this.currentPack.levels.length) {
      lastLevel = this.currentPack.levels.length - 1;
    }
    this.currentLevel = this.currentPack.levels[lastLevel];
    // set last game played as this pack, with last level played for this pack
    this.data.savelastGamePlayed(id, lastLevel);
    this.newLevelEvent.emit(this.currentLevel.board);
  }


  /**
   * Load the last game that was played
   */
  loadLastLevelPlayed(): void {
    // load the last pack
    this.currentPack = this.vexedLevels[this.data.getLastGamePackPlayed()];
    // load the last game (check if out of bounds)
    let lastLevel = this.data.getLastLevelPlayed();
    if (lastLevel >= this.currentPack.levels.length) {
      lastLevel = this.currentPack.levels.length -1;
    }
    this.currentLevel = this.currentPack.levels[lastLevel];
  }


}// end class
