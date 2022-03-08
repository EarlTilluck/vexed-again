import { Component, HostListener, OnInit } from '@angular/core';
import { ViewDidEnter } from '@ionic/angular';
import { VexedService } from '../services/vexed.service';
import { GameService } from '../services/game.service';
import { UiService } from '../services/ui.service';

@Component({
  selector: 'app-game',
  templateUrl: 'game.page.html',
  styleUrls: ['game.page.scss'],
})
export class GamePage implements OnInit, ViewDidEnter {


  constructor(
    public vexed: VexedService,
    public game: GameService,
    public ui: UiService
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
    // what to do when game data has been deleted
    this.ui.didClearSaveData.subscribe(()=>{
      // load the last game played, in this case will start over
      // with game pack 0 and level 0
      this.vexed.loadLastGame();
      // load game onto board
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

    // set size of the ion card
    this.ui.cardWidth = innerWidth + 'px';
    this.ui.cardHeight = innerHeight + 'px';

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
    this.ui.boardWidth = newLength + 'px';

    // vexed levels are also 10 blocks high at most
    const newHeight = newLength * 0.8;
    this.ui.boardHeight = newHeight + 'px';

    // calculate a block size. blocks are square.
    // 10 blocks should fit comfortably on screen.
    this.ui.blockSize = newLength / 10 + 'px';

    // note, we can use margin: auto to center the game board horizontally

    // calculate vertical offset, to center board vertically on screen
    let heightLeftOver = innerHeight - newHeight;
    // remove height of ion card header and tab bar
    heightLeftOver = heightLeftOver - 80 - 56;
    this.ui.heightOffset = Math.floor(heightLeftOver / 2) + 'px';
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
