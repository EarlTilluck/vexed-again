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

    // based on isPortrait, get total lenght of shorter dimension of screen
    let totalLenght = isPortrait ? innerWidth : innerHeight;
    totalLenght = totalLenght - 32; // substract the value of ion card padding

    // vexed levels can be 10 blocks wide at most
    // board lenght should be a multiple of 10
    // that way 10 blocks can comfortably fit onto screen.
    // below: with totalLenght of 512, newLenght = 510, remainder = 2
    const remainder = totalLenght % 10;
    const newLength = totalLenght - remainder;

    // set gameboard size to new lenght
    this.boardWidth = newLength + 'px';

    // vexed levels are also 10 blocks high at most
    const newHeight = newLength * 0.8;
    this.boardHeight = newHeight + 'px';

    // calculate a block size. blocks are square.
    // 10 blocks should fit comfortably on screen.
    const blockSize = newLength / 10;
    this.blockSize = blockSize + 'px';
    this.iconSize = Math.floor(blockSize * 0.65) + 'px';

    // note, we can use margin: auto to center the game board horizontally

    // calculate vertical offset, to center board vertically on screen
    let heightLeftOver = innerHeight - newHeight;
    // remove height of ion card header and tab bar
    heightLeftOver = heightLeftOver - 80 - 56;
    this.heightOffset = Math.floor(heightLeftOver / 2) + 'px';

  }



}// end class
