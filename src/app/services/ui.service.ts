import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UiService {

  // board size data
  // size of game board
  boardWidth = '0px';
  boardHeight = '0px';

  // size of screen
  cardHeight = '0';
  cardWidth = '0';

  // block size data
  blockSize = '0px';
  iconSize = '0px';

  // offset for displaying blocks on screen.
  // used for centering the blocks
  heightOffset = '0px';

  // border size and postion
  borderHeight = '0px';
  borderWidth = '0px';
  borderLeft = '0px';
  borderTop = '0px';

  // cursor data
  cursorTop = '0px';
  cursorLeft = '0px';
  cursorOpacity = 0;

  // gesture blocking to prevent multiple moves
  blockFor = '';

  // darkmode ?
  darkMode = 'true';

  // events
  selectLevels = new EventEmitter();
  selectGamePack = new EventEmitter();
  hideSpinner = new EventEmitter<boolean>();
  didClearSaveData = new EventEmitter();

  constructor() {}


  /**
   * Set the gameboard size and block size.
   */
  resizeGameBoard(): void {

    // get available view
    const innerWindow = document.querySelector('.tabs-inner');

    // get view dimensions
    const innerWidth = innerWindow.clientWidth;
    const innerHeight = innerWindow.clientHeight;

    // set size of the ion card
    this.cardWidth = innerWidth + 'px';
    this.cardHeight = innerHeight + 'px';

    // portrait mode or landscape?
    // in portrait, there is more height than width,
    // therefore we calculate block size based on width available.
    // We do the inverse for landscape.
    const isPortrait = innerWidth <= innerHeight ? true : false;

    // set the lenght available to use
    let lenght = isPortrait ? innerWidth : innerHeight;

    // subtract the value of ion card padding
    lenght = lenght - 32;

    // subtract the value of the 10 px border
    lenght = lenght - 20;

    // vexed levels can be 10 blocks wide at most
    // and they are 8 blocks large at most
    // lenght used should be a multiple of 10
    // that way 10 blocks can comfortably fit onto screen.
    // we divide by 10, and drop the remainder to get blocksize.
    const blockSize = Math.floor(lenght/10);
    this.blockSize = blockSize + 'px';

    // set gameboard width to 10x blocksize plus border
    const bWidth = (blockSize * 10) + 20;
    this.boardWidth = bWidth + 'px';

    // set gameboard height to 8x blocksize plus border
    const bHeight = (blockSize * 8) + 20;
    this.boardHeight = bHeight + 'px';

    // set icon size to be a bit smaller that block size
    this.iconSize = Math.floor(blockSize * 0.65) + 'px';

    // We can use margin: auto to center the game board horizontally,
    // but we need to calculate the vertical offset,
    // to center board vertically on screen
    let heightLeftOver = innerHeight - bHeight;
    // remove height of ion card header and tab bar
    heightLeftOver = heightLeftOver - 80 - 56;
    // set the value for margin top of gameboard
    this.heightOffset = Math.floor(heightLeftOver / 2) + 'px';
  }

}// end class
