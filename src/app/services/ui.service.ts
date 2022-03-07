import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UiService {


  // events
  selectLevels = new EventEmitter();
  hideSpinner = new EventEmitter<boolean>();


}