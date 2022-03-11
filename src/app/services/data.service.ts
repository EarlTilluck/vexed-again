import { Injectable } from '@angular/core';
import { Block } from '../models/block.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  // error message if can't save data
  localStorageError = 'Could not access localStorage. Try clearing browser cache.';


  /**
   * Save the last GamePack played
   *
   * Call this when the the player progresses to new level or chooses
   * a new level to play.
   *
   * @param gamePackId zero based index of the pack
   */
  savelastGamePackPlayed(gamePackId: number): void {
    try {
      localStorage.setItem('last_game_pack', gamePackId + '');
    } catch (e) {
      console.log(this.localStorageError);
    }
  }


  /**
   * Get the last game pack played.
   *
   * @returns index of the game pack (0 by default)
   */
  getLastGamePackPlayed(): number {
    // get game pack from local storage
    const gamePack = parseInt(localStorage.getItem('last_game_pack'), 10);
    // parseInt may return NaN, return 0 if nan
    if (isNaN(gamePack)) {
      return 0;
    }
    return gamePack;
  }


  /**
   * Save the progess of each game pack. Saves the last
   * unpassed level. (or the current level being played)
   *
   * @param gamePackId zero base index of a game pack
   * @param progress zero based index of last unpassed level
   */
  saveProgressForGamePack(gamePackId: number, progress: number): void {
    try {
      localStorage.setItem('pack-' + gamePackId, progress + '');
    } catch (e) {
      console.log(this.localStorageError);
    }
  }


  /**
   * Get the progress for a gamepack.
   * This corresponds to the zero based index of
   * the last level not passed yet.
   *
   * Important! : If all levels passed, this
   * may return an out of bounds index.
   *
   * @param gamePackId zero based index of game pack
   * @returns zero based index of level not passed yet
   */
  getProgressForGamePack(gamePackId: number): number {
    const progress = parseInt(localStorage.getItem('pack-' + gamePackId), 10);
    if (isNaN(progress)) {
      return 0;
    }
    return progress;
  }


  /**
   * Save the history (undo states) for a level
   *
   * @param gamePackId id of game pack
   * @param level zero based index of level
   * @param history the history array
   */
  saveHistoryForLevel(gamePackId: number, level: number, history: Array<Array<Block>>) {
    try {
      localStorage.setItem('history-' + gamePackId + '-level-' + level, JSON.stringify(history));
    } catch (e) {
      console.log(this.localStorageError);
    }
  }

  /**
   * Get the history (undo states) for a level
   *
   * @param gamePackId
   * @param level
   * @returns History array
   */
  getHistoryForLevel(gamePackId: number, level: number) {
    const historyString = localStorage.getItem('history-' + gamePackId + '-level-' + level);
    try {
      const history: Array<Array<Block>> = JSON.parse(historyString);
      return history;
    } catch (e) {
      console.log(this.localStorageError);
    }
    return [];
  }


  /**
   * Switch the value of dark mode and save it.
   */
  toggleDarkMode(): void {
    let darkMode = this.getDarkMode();
    if (darkMode === 'true') {
      darkMode = 'false';
    } else {
      darkMode = 'true';
    }
    try {
      localStorage.setItem('dark-mode', darkMode);
    } catch (e) {
      console.log(this.localStorageError);
    }
  }

  /**
   * set the dark mode
   *
   * @param darkMode string 'true' or 'false'
   */
  setDarkMode(darkMode: string): void {
    try {
      localStorage.setItem('dark-mode', darkMode);
    } catch (e) {
      console.log(this.localStorageError);
    }
  }

  /**
   * Get value of dark mode.
   * Returns true if no value was set before, making
   * the app dark mode by default.
   *
   * @returns string, true if dark mode enabled.
   */
  getDarkMode(): string {
    const darkMode = localStorage.getItem('dark-mode');
    if (darkMode !== null) {
      return darkMode;
    }
    return 'true'; // dark mode by default
  }


  /**
   * Save a level as previously passed (successfully completed)
   *
   * @param packId
   * @param levelId
   */
  saveLevelAsPassed(packId: number, levelId: number): void {
    try {
      localStorage.setItem('levelPassed-' + packId + '-level-' + levelId, 'true');
    } catch (e) {
      console.log(this.localStorageError);
    }
  }


  /**
   * Get the whether a level has been passed or not
   *
   * @param packId
   * @param levelId
   * @returns true if level already completed.
   */
  getPassForLevel(packId: number, levelId: number): boolean {
    const passedString = localStorage.getItem('levelPassed-' + packId + '-level-' + levelId);
    if (passedString !== null && passedString === 'true') {
      return true;
    }
    return false;
  }


  /**
   * Set the best try for a level in a gamepack
   *
   * @param packId
   * @param levelId
   * @param best best attempt
   */
  setBestForLevel(packId: number, levelId: number, best: number): void {
    try {
      localStorage.setItem('levelBest-' + packId + '-level-' + levelId, best + '');
    } catch (e) {
      console.log(this.localStorageError);
    }
  }



  /**
   * Get best try for given pack level
   *
   * @param packId
   * @param levelId
   * @returns current best attempt
   */
  getBestForLevel(packId: number, levelId: number): number {
    const best = parseInt(localStorage.getItem('levelBest-' + packId + '-level-' + levelId), 10);
    if (isNaN(best)) {
      return 0;
    }
    return best;
  }


  /**
   * save sound volume
   *
   * @param volume
   */
  saveSound(volume: number): void {
    try {
      localStorage.setItem('sound-volume', volume + '');
    } catch (e) {
      console.log(this.localStorageError);
    }
  }


  /**
   * get the volume setting
   */
  getSound(): number {
    const volume = parseFloat(localStorage.getItem('sound-volume'));
    if (isNaN(volume)) {
      return 1;
    }
    return volume;
  }

  /**
   * Delete all data from localstorage
   */
  clearAll() {
    localStorage.clear();
  }
}
