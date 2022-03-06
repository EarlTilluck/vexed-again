import { EventEmitter, Injectable, Output } from '@angular/core';
import { Block } from '../models/block.model';
import { VexedService } from './vexed.service';



@Injectable({
  providedIn: 'root'
})
export class GameService {

  // event used to tell blocks to move or disappear
  @Output() moveEvent = new EventEmitter<Block>();

  // how many blocks per line, use this to track wall edge.
  blocksPerLine = 0;
  // how many lines for this board
  totalLines = 0;

  // undo history
  history: Array<Array<Block>> = [];

  // Array of blocks that should be displayed on screen
  blocks: Array<Block> = [];


  constructor(
    private vexed: VexedService
  ){};


  /**
   * Load game blocks onto screen,
   * First check to see if there is history for current level, and load that
   * otherwise, parse board and display blocks on screen
   *
   */
  loadLevel(): void {

    // clear previous board state
    this.blocks = [];

    // e.g. of board string:
    // XXXXXXXX/XYYYYYaX/XYXXXXXX/XYYYYYYX/XXXXXXYX/XaYYYYYX/XXXXXXXX
    // X = wall, Y = empty space, a-h = block
    const board = this.vexed.currentLevel.board;

    // split string into each line,
    const lines = board.split('/');
    // get blocks per line and total lines of board
    this.blocksPerLine = lines[0].length;
    this.totalLines = lines.length;


    // get the history for the current level
    this.history = this.vexed.getHistory();
    // if history is not empty,
    // then set the current state as the first block array in history
    if (this.history !== null && this.history.length > 0) {
      this.blocks = this.cloneBlocks(this.history[0]);
    } else {
      // if no history, then load the board data from the level string
      // for each line...
      let lineNum = 0;
      for (const line of lines) {
        // for each char in line...
        let positionNum = 0;
        for (const ch of line) {
          // add block into array
          const id = lineNum + '' + positionNum; // generate unique id from line and position
          this.blocks.push(new Block(id, lineNum, positionNum, (ch + ''), 1));
          positionNum++;
        }
        lineNum++;
      }
      // add current state to history
      // clear any previous history ( this is a new game )
      this.history = [];
      // clone the array, then push to history
      this.pushHistory();
    }
  }


  /**
   * Try to move a block either left or right.
   *
   * @param gameBlock
   * @param direction
   * @returns
   */
  tryMove(gameBlock: Block, direction: string): boolean {

    // a block can only move left or right if it has an empty space next to it.

    // find the position of the block next to the current block
    let adjacentBlockPosition = 0;
    if (direction === 'left') {
      adjacentBlockPosition = gameBlock.position - 1;
    } else {
      adjacentBlockPosition = gameBlock.position + 1;
    }

    // find the block on the same line, in that position.
    const adjacentBlock = this.getBlock(gameBlock.line, adjacentBlockPosition);

    // test if can move into adjacent square
    // block must exist
    if (adjacentBlock !== null) {
      // block must be within board left and right edges
      if (adjacentBlock.position >= 0 && adjacentBlock.position < this.blocksPerLine) {
        // block must be empty space
        if (adjacentBlock.type === 'Y') {
          // the current block can be swapped with the adjacent block.
          this.swapBlock(gameBlock, adjacentBlock);
          // wait a second for css animation to finish, then...
          setTimeout(() => {
            // find blocks that should fall and have them fall
            this.fallBlocks();
          }, 500);
          return true;
        }
      }
    }
    // if above doesn't excecute, we coudn't move block into new position.
    return false;
  }

  /**
   * Have a block fall due to gravity, if there is empty space below it.
   *
   * @param gameBlock
   * @returns true if did fall
   */
  tryFall(gameBlock: Block): boolean {

    // get the block below this one
    const lineBelow = gameBlock.line + 1;
    const belowBlock = this.getBlock(lineBelow, gameBlock.position);
    if (belowBlock !== null) {
      // only do fall for a block that is not empty space or wall.
      if (gameBlock.type !== 'Y' && gameBlock.type !== 'X' && belowBlock.type === 'Y') {
        this.swapBlock(gameBlock, belowBlock);
        return true;
      }
    }
    return false;
  }


  /**
   * After a move, have all blocks standing on air fall.
   */
  fallBlocks(): void {
    // loop through all blocks...
    let didFall = false;
    for (const block of this.blocks) {
      // find if block should fall and break out of loop if found
      didFall = this.tryFall(block);
      if (didFall) {
        break;
      }
    }
    if (didFall) {
      // wait for animation to finish, then
      // repeat until no blocks can fall anymore
      setTimeout(() => {
        this.fallBlocks();
      }, 250);
    } else {
      // if no more blocks can fall, vanish blocks of the same type next to eachother
      this.vanishBlocks();
    }
  }




  /**
   * check all blocks and make them dissappear
   * if they are next to another block of the same type
   */
  vanishBlocks(): void {
    let didVanish = false;
    for (const block of this.blocks) {
      // get adjacent blocks
      const aboveBlock = this.getBlock(block.line - 1, block.position);
      const belowBlock = this.getBlock(block.line + 1, block.position);
      const leftBlock = this.getBlock(block.line, block.position - 1);
      const rightBlock = this.getBlock(block.line, block.position + 1);
      // set opacity if they are the same
      if (aboveBlock !== null) {
        if (aboveBlock.type === block.type && aboveBlock.type !== 'X' && aboveBlock.type !== 'Y') {
          block.opacity = 0;
          aboveBlock.opacity = 0;
          didVanish = true;
        }
      }
      if (belowBlock !== null) {
        if (belowBlock.type === block.type && belowBlock.type !== 'X' && belowBlock.type !== 'Y') {
          block.opacity = 0;
          belowBlock.opacity = 0;
          didVanish = true;
        }
      }
      if (leftBlock !== null) {
        if (leftBlock.type === block.type && leftBlock.type !== 'X' && leftBlock.type !== 'Y') {
          block.opacity = 0;
          leftBlock.opacity = 0;
          didVanish = true;
        }
      }
      if (rightBlock !== null) {
        if (rightBlock.type === block.type && rightBlock.type !== 'X' && rightBlock.type !== 'Y') {
          block.opacity = 0;
          rightBlock.opacity = 0;
          didVanish = true;
        }
      }
      // update the block
      this.moveEvent.emit(block);
    }// end for

    // if a vanish occurred, check if we won,
    // if not, check if other blocks should fall
    if(didVanish) {
      // wait for vanishing animation to finish.
      setTimeout(() => {
        // check if win first
        if (this.checkWin()) {
          this.win();
        } else {
          this.fallBlocks();
        }
      }, 500);
    } else {
      // No more blocks can fall, and no blocks can vanish anymore...
      // update the history of the board.
      this.pushHistory();
    }
  }

  /**
   * Swap two blocks and tell them to update
   *
   * @param blockA
   * @param blockB
   */
  swapBlock(blockA: Block, blockB: Block) {
    const tempLine = blockA.line;
    const tempPosition = blockA.position;
    blockA.line = blockB.line;
    blockA.position = blockB.position;
    blockB.line = tempLine;
    blockB.position = tempPosition;
    this.moveEvent.emit(blockA);
    this.moveEvent.emit(blockB);
  }

  /**
   * Check if there are any playable blocks left.
   *
   * @returns true if board cleared
   */
  checkWin(): boolean {
    let win = true;
    for (const block of this.blocks) {
      if (block.type !== 'X' && block.type !== 'Y') {
        win = false;
        break;
      }
    }
    return win;
  }

  /**
   * Pass this level, then load the next level.
   */
  win() {
    // push blank history for this level, so if this level
    // is selected again, we can start from the begining
    this.history = [];
    this.vexed.saveHistory(this.history);
    // load next level,
    // returns false if we are at the end of the game pack
    if(this.vexed.loadNextLevel()) {
      this.loadLevel();
    } else {
      // we are at the end of this board.
      console.log('gamepack won');
    }
  }


  /**
   * Given a postion, find the corresponding block.
   *
   * @param line line the block is in
   * @param position position of block
   * @returns Block or null
   */
  getBlock(line: number, position: number) {
    let newBlock = null;
    for (const block of this.blocks) {
      if (block.position === position && block.line === line) {
        newBlock = block;
      }
    }
    return newBlock;
  }


  /**
   * Undo last move.
   */
  undo(): void {
    // if we have at least two states in history,
    // we can remove one of them and go back to the previous.
    // if we only have one state, then do nothing, this is the begin state
    if (this.history.length > 1) {
      this.blocks = []; // reset blocks array
      this.history.shift(); // remove current state
      this.blocks = this.cloneBlocks(this.history[0]); // set blocks to state before
      this.vexed.saveHistory(this.history);
    }
  }

  /**
   * Reset the game
   */
  reset(): void {
    // pop all history until only begin state left
    while (this.history.length > 1) {
      this.history.shift();
    }
    // set current state to begin state
    this.blocks = []; // empty blocks array first
    this.blocks = this.cloneBlocks(this.history[0]);
    // save the new history
    this.vexed.saveHistory(this.history);
  }


  /**
   * Add current state of board to history
   */
  pushHistory() {
    // clone the blocks array
    // then place that array at start of the history array
    this.history.unshift(this.cloneBlocks(this.blocks));
    // save the history to local storage
    this.vexed.saveHistory(this.history);
  }

  /**
   * Make a copy of the given array of blocks
   *
   * @returns new Array of blocks.
   */
  cloneBlocks(blocks: Array<Block>): Array<Block> {
    const newArray: Array<Block> = [];
    for(const block of blocks) {
      const temp = new Block(block.blockId, block.line, block.position, block.type, block.opacity);
      newArray.push(temp);
    }
    return newArray;
  }

}// end class



