import { EventEmitter, Injectable } from '@angular/core';
import { Block } from '../models/block.model';



@Injectable({
  providedIn: 'root'
})
export class GameService {

  // state of the board is saved in an array of block lines,
  // which in turn is an array of strings denoting block type
  //startState = Array<Array<string>>();
  //currentState = Array<Array<string>>();

  // how many blocks per line, use this to track wall edge.
  blocksPerLine = 0;
  // how many lines for this board
  totalLines = 0;

  blocks: Array<Block> = [];


  // event used to tell blocks to move or disappear
  moveEvent = new EventEmitter<Block>();

  /**
   * when given board, parse board and display blocks on screen
   *
   * @param state string containing board state
   */
  loadLevel(state: string): void {
    // e.g. of board state: XXXXXXXX/X.....aX/X.XXXXXX/X......X/XXXXXX.X/Xa.....X/XXXXXXXX
    // X = wall, . = empty space, a-h = block

    // clear previous board state
    //this.startState = [];
    this.blocks = [];

    // split string into each line,
    const lines = state.split('/');
    // get blocks per line and total lines of board
    this.blocksPerLine = lines[0].length;
    // for each line....
    let lineNum = 0;
    for (const line of lines) {
      // add an array for each line

      //this.startState.push([]);
      //this.currentState.push([]);

      let positionNum = 0;
      for (const ch of line) {
        // add block into array for line

        //this.startState[lineNum].push(ch + '');
        //this.currentState[lineNum].push(ch + '');

        const id = lineNum + '' + positionNum; // generate id from line and position
        this.blocks.push( new Block( id, lineNum, positionNum, (ch + '') ) );
        positionNum++;
      }
      lineNum++;
    }
  }


/*
  tryMove(currentBlockLine: number, currentBlockPostition: number, type: string, direction: string): Array<number> {

    let newLine = currentBlockLine;
    let newPosition = currentBlockPostition;

    // a block can only move left or right if it has an empty space next to it.

    // find the position of the block next to the current block
    let spaceBeside = 0;
    if (direction === 'left') {
      spaceBeside = currentBlockPostition - 1;
    } else {
      spaceBeside = currentBlockPostition + 1;
    }
    // test if block is near edge
    if ( spaceBeside >= 0 && spaceBeside < this.blocksPerLine ) {
      // test if space is empty
      if(this.currentState[currentBlockLine][spaceBeside] === 'Y') {
        newPosition = spaceBeside;
        // a block keeps falling if it has an empty space below it.
        const totalLines = this.currentState.length;
        let checkLine = currentBlockLine + 1;
        while (checkLine < this.currentState.length) { // for each line below, check if empty space
          if (this.currentState[checkLine][newPosition] === 'Y') {
            newLine = checkLine;
          } else {
            break; // break out of while loop if we hit a wall or other block.
          }
          checkLine ++;
        }
        // update gameboard
        this.currentState[currentBlockLine][currentBlockPostition] = 'Y'; // current space is now empty
        this.currentState[newLine][newPosition] = type; // new position is now this block
        //console.log(this.blockLines);

        // return new postion and line in array
        //this.moveEvent.emit(new Move(0, newLine, newPosition, 1));
        return [1, newLine, newPosition];
      }
    }
    // if above return isn't called, return can't move.
    return [0];
  } */

}



