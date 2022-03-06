import { AfterViewInit, Component, ElementRef, HostListener, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Gesture, GestureController, GestureDetail } from '@ionic/angular';
import { Block } from '../models/block.model';
import { GameService } from '../services/game.service';
import { VexedService } from '../services/vexed.service';

@Component({
  selector: 'app-game-block',
  templateUrl: './game-block.component.html',
  styleUrls: ['./game-block.component.scss'],
})
export class GameBlockComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('block') blockElementRef: ElementRef;

  // unique identifier for this block.
  @Input() gameBlock: Block;

  // size of block,
  @Input() blockSize = '0px';

  // current position (css)
  left = '0';
  top = '0';

  // current opacity (css)
  opacity = 1;

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
    this.moveToPosition();
  }


  ngAfterViewInit() {
    // Create gesture for game when view enters
    this.gesture = this.gestureCtrl.create({
      el: this.blockElementRef.nativeElement,
      threshold: 5,
      gestureName: 'game-gesture',
      onEnd: ev => this.onGestureEnd(ev)
    }, true);
    // The `true` above ensures that callbacks run inside NgZone.
    // enable above gesture
    this.gesture.enable();

    // subscribe to move event
    this.game.moveEvent.subscribe( (eventBlock) => {
      // update this block if the event refers to it.
      if (eventBlock.blockId === this.gameBlock.blockId) {
        this.update();
      }
    });

  }

  // what to do when swipe a block
  onGestureEnd(ev: GestureDetail) {
    // do gesture only if is a movable block
    if (this.gameBlock.type !== 'X' && this.gameBlock.type !== 'Y') {

      // if swipted to the right, then...
      if (ev.deltaX > 0) {
        this.move('right');
      } else {
        this.move('left');
      }
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
    const extraWidth = 10 % this.game.blocksPerLine;
    const widthOffset = size * (extraWidth / 2);

    // for height, 8 blocks fit
    const extraHeight = 8 % this.game.totalLines;
    const heightOffset = size * (extraHeight / 2);

    // set the position
    this.top = heightOffset + (this.gameBlock.line * size) + 'px';
    this.left = widthOffset + (this.gameBlock.position * size) + 'px';

  }

  /**
   * try to move a block left or right.
   *
   * @param direction left or right
   */
  move(direction: string) {
    // call trymove from game service, returns true or false.
    this.game.tryMove(this.gameBlock, direction);
  }


  /**
   * Update this block on the screen.
   * The Game Service should have updated values in
   * the block object,
   */
  update() {
    // move to new postion, does nothing if value of block didn't change.
    this.moveToPosition();
    // if opacity changed, set the opacity,
    // then set the block to be empty space.
    this.opacity = this.gameBlock.opacity;
    if(this.opacity === 0) {
      setTimeout(()=>{
        this.gameBlock.type = 'Y';
      }, 500);
    }
  }

  /**
   * Destroy the gesture object on exit
   */
  ngOnDestroy(): void {
    this.gesture.destroy();
  }

}
