import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UiService {


  // board size data

  // size of game board
  boardWidth = '0px';
  boardHeight = '0px';
  // size of screen
  cardHeight = '0';
  cardWidth = '0';
  // size of blocks (and cursor) (both are square)
  blockSize = '0px';
  // offset for displaying blocks on screen.
  // used for centering the blocks
  heightOffset = '0px';


  // cursor data
  cursorTop = '0px';
  cursorLeft = '0px';
  cursorOpacity = 0;


  // events
  selectLevels = new EventEmitter();
  selectGamePack = new EventEmitter();
  hideSpinner = new EventEmitter<boolean>();
  didClearSaveData = new EventEmitter();
  deselectAllBlocks = new EventEmitter();



}
