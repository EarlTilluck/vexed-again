import { AfterViewInit, Component, ElementRef, HostListener, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Gesture, GestureController, GestureDetail } from '@ionic/angular';
import { Block } from '../models/block.model';
import { GameService } from '../services/game.service';
import { UiService } from '../services/ui.service';

@Component({
  selector: 'app-game-block',
  templateUrl: './game-block.component.html',
  styleUrls: ['./game-block.component.scss'],
})
export class GameBlockComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('block') blockElementRef: ElementRef;

  // unique identifier for this block.
  @Input() gameBlock: Block;

  // current position (css)
  left = '0px';
  top = '0px';

  // current opacity (css)
  opacity = 1;

  // is selected?
  selected = 'not-selected';

  // for gesture input
  gesture: Gesture;

  constructor(
    private gestureCtrl: GestureController,
    public game: GameService,
    public ui: UiService
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
    // subscribe to deselect all blocks event
    this.ui.deselectAllBlocks.subscribe(()=>{
      this.selected = 'not-selected';
    });
    // move into position
    this.moveToPosition();
  }


  ngAfterViewInit() {
    // Create gesture for game when view enters
    this.gesture = this.gestureCtrl.create({
      el: this.blockElementRef.nativeElement,
      threshold: 5,
      gestureName: 'game-gesture',
      passive: false,
      direction: 'x',
      gesturePriority: 99,
      disableScroll: true,
      onStart: ev => this.onGestureStart(ev),
      onMove: ev => this.onGestureMove(ev),
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

  /**
   * When clicked, move cursor here
   */
  onClick() {
    // deselect all blocks
    this.ui.deselectAllBlocks.emit();
    // run same code as startGesture
    this.onGestureStart(null);
  }


  /**
   * what to do when start swiped.
   *
   * @param ev Gesture event
   */
  onGestureStart(ev: GestureDetail): void {

    // if movable block
    if(this.gameBlock.type !== 'X' && this.gameBlock.type !== 'Y') {
      // set cursor to hover over this block.
      this.ui.cursorLeft = this.left;
      this.ui.cursorTop = this.top;
      // fade in cursor
      this.ui.cursorOpacity = 1;
      this.selected = 'selected';
    }
  }


  /**
   * Move cursor along with swipe
   *
   * @param ev Gesture event
   */
  onGestureMove(ev: GestureDetail): void {

    // get left value
    let currentLeft = parseInt(this.left.replace('px', ''), 10);
    // get delta and distance of swipe
    const deltaX = Math.floor(ev.deltaX);
    const distance = Math.abs(deltaX);
    // get size of block
    const blockSize = parseInt(this.ui.blockSize.replace('px', ''), 10);
    // set new left
    // if distance is within single block size (give or take),
    // then set cursor to adjacent block
    if(distance <= (blockSize + 50)) {
      if(deltaX > 0) {
        currentLeft = currentLeft + blockSize;
      } else {
        currentLeft = currentLeft - blockSize;
      }
    } else {
      // distance is outside of adjacent block, so set it
      // to where the current gesture location
      currentLeft = currentLeft + deltaX;
    }
    this.ui.cursorLeft = currentLeft + 'px';

  }


  /**
   * What to do when a swipe of block occured.
   *
   * @param ev Gesture event
   */
  onGestureEnd(ev: GestureDetail): void {
    // do gesture only if is a movable block
    if (this.gameBlock.type !== 'X' && this.gameBlock.type !== 'Y') {

      // get distance, make it positive number.
      // note: velocity is negative when swiped to the left...
      const distance = Math.abs(ev.deltaX);
      const blockSize = parseInt(this.ui.blockSize.replace('px', ''), 10);
      if (distance > (blockSize + 50)) {
        console.log('big swipe');
      } else {
        console.log('small swipe');
      }

      // swipe right or left based on deltaX
      if (ev.deltaX > 0) {
        this.move('right');
      } else {
        this.move('left');
      }
    }
    // fade out cursor
    this.ui.cursorOpacity = 0;
    this.selected = 'not-selected';

  }




  /**
   * Move this block into position on screen based on
   * it's location in the BlockLines array.
   */
  moveToPosition(): void {
    // get size of block.
    let size = parseInt(this.ui.blockSize.replace('px', ''), 10);
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
