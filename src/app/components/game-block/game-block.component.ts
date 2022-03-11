import { AfterViewInit, Component, ElementRef, HostListener, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Gesture, GestureController, GestureDetail } from '@ionic/angular';
import { Block } from '../../models/block.model';
import { GameService } from '../../services/game.service';
import { UiService } from '../../services/ui.service';

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

  // Gesture data
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
   * what to do when start swiped.
   *
   * @param ev Gesture event
   */
  onGestureStart(ev: GestureDetail): void {

    // if gesture blocked, do nothing
    if (this.ui.blockFor !== '') {
      return;
    }
    // if block is not movable, do nothing
    if (this.gameBlock.movable === false) {
      return;
    }
    // start gesture blocking
    this.ui.blockFor = this.gameBlock.blockId;
    // set cursor to hover over this block.
    this.ui.cursorLeft = this.left;
    this.ui.cursorTop = this.top;
    // fade in cursor
    this.ui.cursorOpacity = 1;
  }


  /**
   * Move cursor along with swipe
   *
   * @param ev Gesture event
   */
  onGestureMove(ev: GestureDetail): void {

    // do nothing if gesture isn't for current moving block
    if (this.ui.blockFor !== this.gameBlock.blockId) {
      return;
    }

    // do nothing for unmovable blocks
    if(this.gameBlock.movable === false) {
      return;
    }

    // get current left value
    let currentLeft = parseInt(this.left.replace('px', ''), 10);
    // get deltaX, this is the distance the cursor traveled
    // it is a positive number if user swipped right, and negative if user swipped left
    const deltaX = Math.floor(ev.deltaX);
    // convert deltaX to positive number to distance travelled
    const distance = Math.abs(deltaX);
    // get size of block
    const blockSize = parseInt(this.ui.blockSize.replace('px', ''), 10);
    // set new left based on distance travelled and direction.
    // find how many blocks worth of distance traveled
    const blocksDistance = (Math.floor(distance/blockSize))+1;

    // find furthest block to highlight along distance
    // repeat for each empty block along distance
    let positionToCheck = 0;
    let distanceToMove = 0;
    for(let i=1; i<=blocksDistance; i++) {
      // if right or left swipe... get next block position
      if(deltaX > 0) {
        positionToCheck = this.gameBlock.position + i;
      } else {
        positionToCheck = this.gameBlock.position - i;
      }
      // get block at that position
      const blockUnderCursor = this.game.getBlock(this.gameBlock.line, positionToCheck);
      // if block is an empty space, the cursor can move into that space
      if (blockUnderCursor !== null && blockUnderCursor.type === 'Y') {
        distanceToMove++;
      } else {
        // break out of for loop if encountered solid block
        i = blocksDistance + 1;
      }
    }

    // if swiped right or left ...
    // update direction and cursor position
    if (deltaX > 0) {
      // right swipe,
      this.game.direction = 'right';
      currentLeft = currentLeft + (distanceToMove * blockSize);
    } else {
      // left swipe
      this.game.direction = 'left';
      currentLeft = currentLeft - (distanceToMove * blockSize);
    }

    // set move repeats based on distance
    // value will be zero if user didn't swipe very far
    this.game.moveRepeat = blocksDistance;
    // update the left value
    this.ui.cursorLeft = currentLeft + 'px';
  }


  /**
   * What to do when a swipe of block occured.
   *
   * @param ev Gesture event
   */
  onGestureEnd(ev: GestureDetail): void {

    // do nothing if gesture isn't for current moving block
    if (this.ui.blockFor !== this.gameBlock.blockId) {
      return;
    }
    // if block is not movable, do nothing
    // this check should not be needed, but we do it anyway just to make sure
    if (this.gameBlock.movable === false) {
      return;
    }

    // set the current block to be moved, and call the try move method
    this.game.currentBlock = this.gameBlock;
    this.game.tryMove();
    // fade out cursor
    this.ui.cursorOpacity = 0;
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
    let widthOffset = size * (extraWidth / 2);

    // for height, 8 blocks fit
    const extraHeight = 8 % this.game.totalLines;
    let heightOffset = size * (extraHeight / 2);

    // add 10 for border
    heightOffset = heightOffset + 10;
    widthOffset = widthOffset + 10;

    // set the position
    this.top = heightOffset + (this.gameBlock.line * size) + 'px';
    this.left = widthOffset + (this.gameBlock.position * size) + 'px';

    // set the border position, minus pixels for border
    this.ui.borderTop = (heightOffset-10) + 'px';
    this.ui.borderLeft = (widthOffset-10) + 'px';
    this.ui.borderHeight = ((this.game.totalLines * size)+20) + 'px';
    this.ui.borderWidth = ((this.game.blocksPerLine * size)+20)+ 'px';
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
      // wait for animation to finish before setting type
      // thw type is set to Y, css is set to display: none
      setTimeout(()=>{
        this.gameBlock.movable = false;
        this.gameBlock.type = 'Y';
        this.gameBlock.name = '';
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
