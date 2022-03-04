import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {


  // error message if can't save data
  localStorageError = 'Could not save game progress. Try clearing browser cache.';

  constructor() { }


  /**
   * Save the progress of the player.
   *
   * Saves the game pack and the level.
   * Call this when the the player progresses to new level or chooses
   * a new level to play. Pass null if you want to skip saving one of
   * the values.
   *
   * @param gamePackId zero based index of the pack
   * @param level zero based index of the level
   */
  savelastGamePlayed(gamePackId: number | null, level: number | null): void {
    try {
      if (gamePackId !== null) {
        localStorage.setItem('last_game_pack', gamePackId + '');
      }
      if (level !== null) {
        localStorage.setItem('last_level', level + '');
      }
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
   * Get the last level played (for the last game pack played)
   *
   * @returns index of the last level (0 by default)
   */
  getLastLevelPlayed(): number {
    // get level from local storage
    const lastLevel = parseInt(localStorage.getItem('last_level'), 10);
    // parseInt may return NaN, return 0 if nan
    if (isNaN(lastLevel)) {
      return 0;
    }
    return lastLevel;
  }


  /**
   * Save the progess of each game pack. Saves the last
   * unpassed level.
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
   * Important: If all levels passed, this
   * may return an out of bounds index. Make sure
   * to account for this.
   *
   * @param gamePackId zero based index game pack
   * @returns zero based index of level not passed yet
   */
  getProgressForGamePack(gamePackId: number): number {
    const progress = parseInt(localStorage.getItem('pack-' + gamePackId), 10);
    if (isNaN(progress)) {
      return 0;
    }
    return progress;
  }

}
