import { Component, HostListener, OnInit } from '@angular/core';
import { ModalController, ViewDidEnter } from '@ionic/angular';
import { VexedService } from '../services/vexed.service';
import { GameService } from '../services/game.service';
import { UiService } from '../services/ui.service';

@Component({
  selector: 'app-game',
  templateUrl: 'game.page.html',
  styleUrls: ['game.page.scss'],
})
export class GamePage implements OnInit, ViewDidEnter {
  // size of game board
  boardWidth = '0px';
  boardHeight = '0px';

  // size of blocks (blocks are square)
  blockSize = '0px';

  // offset for displaying blocks on screen.
  // used for centering the blocks
  heightOffset = '0px';


  constructor(
    public vexed: VexedService,
    public game: GameService,
  ) { }

  /**
   * Listen to window resize event, change the
   * game board size accordingly
   */
  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.resizeGameBoard();
  }

  ngOnInit(): void {
    // when a new level event triggers (new game pack selected or level passed),
    // load the new level
    this.vexed.newLevelEvent.subscribe(() => {
      this.game.loadLevel();
    });
  }

  /**
   * Set the gameboard size and block size.
   */
  resizeGameBoard(): void {
    // get available view
    const innerWindow = document.querySelector('.tabs-inner');

    // get view dimensions
    innerWidth = innerWindow.clientWidth;
    innerHeight = innerWindow.clientHeight;

    // portrait mode or landscape?
    // in portrait, there is more height than width,
    // therefore we calculate block size based on width available.
    // We do the inverse for landscape.
    const isPortrait = innerWidth <= innerHeight ? true : false;

    // based on isPortrait, get total lenght of shorter dimension of screen
    const totalLenght = isPortrait ? innerWidth : innerHeight;

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
    this.blockSize = newLength / 10 + 'px';

    // note, we can use margin: auto to center the game board horizontally

    // calculate vertical offset, to center board vertically on screen
    const heightLeftOver = innerHeight - newHeight;
    this.heightOffset = Math.floor(heightLeftOver / 2) + 'px';
  }

  /**
   * Set gameboard dimensions when loaded.
   * And load the last level played.
   */
  ionViewDidEnter(): void {
    // wait a while the the view to load
    setTimeout(() => {
      // resize the game board
      this.resizeGameBoard();
      // load default level
      this.game.loadLevel();
    }, 500);
  }



}
