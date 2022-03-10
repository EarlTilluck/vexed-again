import { Component, HostListener, OnInit } from '@angular/core';
import { ViewDidEnter } from '@ionic/angular';
import { VexedService } from '../../services/vexed.service';
import { GameService } from '../../services/game.service';
import { UiService } from '../../services/ui.service';

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
    this.ui.resizeGameBoard();
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
   * Set gameboard dimensions when loaded.
   * And load the last level played.
   */
  ionViewDidEnter(): void {
    // wait a while for the the view to load
    setTimeout(() => {
      // resize the game board
      this.ui.resizeGameBoard();
      // load default level
      this.game.loadLevel();
    }, 500);
  }

}
