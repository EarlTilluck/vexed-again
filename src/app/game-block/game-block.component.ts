import { AfterViewInit, Component, ElementRef, HostListener, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Gesture, GestureController, GestureDetail } from '@ionic/angular';
import { GameService } from '../services/game.service';
import { VexedService } from '../services/vexed.service';

@Component({
  selector: 'app-game-block',
  templateUrl: './game-block.component.html',
  styleUrls: ['./game-block.component.scss'],
})
export class GameBlockComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('block') block: ElementRef;

  // size of block,
  //@Input() blockSize = '0px';
  // type of block, use this to style block
  //@Input() type = 'a';
  // use this to track wall edge
  //@Input() blocksPerLine = 0;
  //@Input() totalLines = 0;
  // starting position of block,
  // use this to calculate position on screen
  //@Input() startLine = 0; // use for y value
  //@Input() startPosition = 0; // use for x value

  // unique identifier for this block.
  //id = '0';

  // current place this block is in
  //currentLine = 0;
  //currentPosition = 0;

  // current position (css)
  left = '0';
  top = '0';

  // for gesture input
  gesture: Gesture;

  constructor(
    private gestureCtrl: GestureController,
    private vexed: VexedService,
    public game: GameService
  ) { }

  /**
   * Listen to window resize event, change the
   * game board size accordingly
   */
  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.moveToPosition();
  }

  ngOnInit() {
    this.id = this.startLine + '' + this.startPosition;
    this.currentLine = this.startLine;
    this.currentPosition = this.startPosition;
    this.moveToPosition();
  }


  /**
   * Create gesture for game when view enters
   */
  ngAfterViewInit() {


    this.gesture = this.gestureCtrl.create({
      el: this.block.nativeElement,
      threshold: 5,
      gestureName: 'game-gesture',
      onEnd: ev => this.onGestureEnd(ev)
    }, true);
    // The `true` above ensures that callbacks run inside NgZone.

    // enable above gesture
    this.gesture.enable();
  }

  // what to do when swipe a block
  onGestureEnd(ev: GestureDetail) {
    // do gesture only if is a movable block
    if (this.type !== 'X' && this.type !== 'Y') {

      // if swipted to the right, then...
      if (ev.deltaX > 0) {
        this.move('right');
      } else {
        this.move('left');
      }
      //this.gesture.enable();
      //this.moveToPosition();
      console.log(this.game.currentState);
    }
  }


  /**
   * Move this block into position on screen based on
   * it's location in the BlockLines array.
   */
  moveToPosition(): void {

    // get size of block.
    let size = parseInt(this.blockSize.replace('px', ''), 10);
    if (isNaN(size)) {
      size = 0;
    }

    // calculate the offset (padding) for placing blocks on screen

    // for width: 10 blocks fit comfortably on the screen.
    // get remainder of space available
    const extraWidth = 10 % this.blocksPerLine;
    const widthOffset = size * (extraWidth / 2);

    // for height, 8 blocks fit
    const extraHeight = 8 % this.totalLines;
    const heightOffset = size * (extraHeight / 2);

    // set the position
    this.left = widthOffset + (this.currentPosition * size) + 'px';
    this.top = heightOffset + (this.currentLine * size) + 'px';

  }

  /**
   * try to move a block left or right.
   *
   * @param direction left or right
   */
  move(direction: string) {
    // call trymove from game service, returns an array with new position values, or false.
    const newPos: Array<number> = this.game.tryMove(this.currentLine, this.currentPosition, this.type, direction);
    if (newPos[0] === 1) {
      this.currentLine = newPos[1]; // new line is index 1
      this.currentPosition = newPos[2]; // new position is index 2
      // move this block to it's new position.
      this.moveToPosition();
    }
    // check if block will fall

    // check surrounding blocks for deletion

  }


  /**
   * Destroy the gesture object on exit
   */
  ngOnDestroy(): void {
    this.gesture.destroy();
  }

}
