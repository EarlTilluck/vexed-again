import { EventEmitter, Injectable } from '@angular/core';
import { DataService } from '../services/data.service';


// import levels
import BoardInfo from '../models/board.info';
import LevelsInfo from '../models/level.info';
import { LevelPack } from '../models/LevelPack.model';
import { Level } from '../models/level.model';
import { Block } from '../models/block.model';


@Injectable({
  providedIn: 'root'
})
export class VexedService {

  // array of levels
  vexedLevels: Array<LevelPack> = [];

  // current level on screen
  currentLevelId: number;
  currentLevel: Level;

  // current pack
  currentPackId: number;
  currentPack: LevelPack;

  // new level event.
  newLevelEvent = new EventEmitter();

  constructor(private data: DataService) {
    // load vexed levels from converted files
    this.loadLevels();
    // load last level played
    this.loadLastGame(); // if never played before, starts at Tutorial 1;
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
        new LevelPack(packData.name, packData.by, packData.difficulty, packData.link, levels)
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
    this.currentPackId = id;
    this.currentPack = this.vexedLevels[id];
    // get last game played for this pack
    this.loadProgressForGamePack(id);
    // set last game played as this pack,
    this.data.savelastGamePackPlayed(id);
    this.newLevelEvent.emit();
  }


  /**
   * When app starts, Load the last game that was played
   */
  loadLastGame(): void {
    // load the last pack
    const lastPackId = this.data.getLastGamePackPlayed();
    this.currentPackId = lastPackId;
    this.currentPack = this.vexedLevels[lastPackId];
    // load the last game (check if out of bounds)
    this.loadProgressForGamePack(this.currentPackId);
  }

  /**
   * Get and set the last unpassed level for a game pack.
   *
   * @param gamePackId zero based index of game pack
   */
  loadProgressForGamePack(gamePackId: number) {
    // get last unpassed level for gamepack
    let level = this.data.getProgressForGamePack(gamePackId);
    // check if out of bounds (past last level)
    if(level >= this.currentPack.levels.length) {
      level = this.currentPack.levels.length -1; // set level to end level
    }
    // set level
    this.currentLevelId = level;
    this.currentLevel = this.currentPack.levels[level];
  }

  /**
   * Save the history (undo states) current level
   *
   * @param history history array
   */
  saveHistory(history: Array<Array<Block>>): void {
    this.data.saveHistoryForLevel(this.currentPackId, this.currentLevelId, history);
  }

  /**
   * Get the history for current level
   *
   * @returns history array
   */
  getHistory(): Array<Array<Block>> {
    return this.data.getHistoryForLevel(this.currentPackId, this.currentLevelId);
  }

  /**
   * Load the next level of the game after current
   * level has been won.
   *
   * @returns false if no more levels
   */
  loadNextLevel(): boolean {
    // add one to level id
    const newLevel = this.currentLevelId + 1;
    // if level available in array...
    if (newLevel < this.currentPack.levels.length) {
      // set new level
      this.currentLevelId = newLevel;
      this.currentLevel = this.currentPack.levels[newLevel];
      // update progress
      this.data.saveProgressForGamePack(this.currentPackId, this.currentLevelId);
      this.newLevelEvent.emit();
      return true;
    }
    return false;
  }


  /**
   * load a provided level onto the screen
   */
  loadLevel(id: number): boolean {
    // if in range
    if(id >= 0 && id < this.currentPack.levels.length) {
      this.currentLevelId = id;
      this.currentLevel = this.currentPack.levels[id];
      // update progress
      this.data.saveProgressForGamePack(this.currentPackId, this.currentLevelId);
      this.newLevelEvent.emit();
      return true;
    }
    return false;
  }


  /**
   * Save the level as passed
   */
  passLevel() {
    this.data.saveLevelAsPassed(this.currentPackId, this.currentLevelId);
  }

  /**
   * get whether a level in current selected game pack has passed.
   *
   * @param levelId
   * @returns true if level has already been completed.
   */
  getPass(levelId: number): boolean {
    return this.data.getPassForLevel(this.currentPackId, levelId);
  }

  /**
   * get whether a level has already been passed.
   */
  getPassForPackAndLevel(packId: number, levelId: number): boolean {
    return this.data.getPassForLevel(packId, levelId);
  }


  setBest(newBestTry: number) {
    // check if new try is less than previous best
    // or if there was no previous best try (best try value is 0)
    const currentBest = this.getBest(this.currentLevelId);
    if(currentBest === 0 || currentBest > newBestTry) {
      this.data.setBestForLevel(this.currentPackId, this.currentLevelId, newBestTry);
    }
  }

  /**
   * Get best try for give level in current pack
   *
   * @param levelId
   * @returns best try
   */
  getBest(levelId: number) {
    return this.data.getBestForLevel(this.currentPackId, levelId);
  }


}// end class
