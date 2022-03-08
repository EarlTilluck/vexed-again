import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UiService {


  // events
  selectLevels = new EventEmitter();
  selectGamePack = new EventEmitter();
  hideSpinner = new EventEmitter<boolean>();
  didClearSaveData = new EventEmitter();


}
