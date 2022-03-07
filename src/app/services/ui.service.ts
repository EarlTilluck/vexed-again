import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UiService {


  shouldHideSpinner = false;


  /**
   * hide the spinner after game packs are loaded
   * into select game modal
   */
  hideSpinner() {
    this.shouldHideSpinner = true;
  }

  showSpinner() {
    this.shouldHideSpinner = false;
  }



}
