import { EventEmitter, Injectable, Output } from '@angular/core';
import { Block } from '../models/block.model';



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

  // Array of blocks that should be displayed on screen
  blocks: Array<Block> = [];

  /**
   * when given board, parse board and display blocks on screen
   *
   * @param state string containing board state
   */
  loadLevel(state: string): void {
    // e.g. of board state: XXXXXXXX/XYYYYYaX/XYXXXXXX/XYYYYYYX/XXXXXXYX/XaYYYYYX/XXXXXXXX
    // X = wall, Y = empty space, a-h = block

    // for testing...
    //state = 'XXXXXYaX/XYYYYYbX/XYXXXYcX/aYYYYYdX/aaXXXYeX/aaaaaYfX/YYYYYYgX';

    // clear previous board state
    this.blocks = [];

    // split string into each line,
    const lines = state.split('/');
    // get blocks per line and total lines of board
    this.blocksPerLine = lines[0].length;
    this.totalLines = lines.length;

    // for each line...
    let lineNum = 0;
    for (const line of lines) {
      // for each char in line...
      let positionNum = 0;
      for (const ch of line) {
        // add block into array
        const id = lineNum + '' + positionNum; // generate unique id from line and position
        this.blocks.push(new Block(id, lineNum, positionNum, (ch + '')));
        positionNum++;
      }
      lineNum++;
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
   * After a move, have all blocks standing on air fall.
   */
  fallBlocks(): void {
    console.log('falling');
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
   * check all blocks and make them dissappear
   * if they are next to another block of the same type
   */
  vanishBlocks(): void {
    console.log('vanishing');
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
          // winning code here...
          console.log('Level Passed..');
        } else {
          this.fallBlocks();
        }
      }, 500);
    }
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

}// end class



