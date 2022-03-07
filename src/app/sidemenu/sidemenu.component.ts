import { Component, OnInit, Renderer2 } from '@angular/core';
import { AlertController, MenuController } from '@ionic/angular';
import { DataService } from '../services/data.service';
import { UiService } from '../services/ui.service';


@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss'],
})
export class SidemenuComponent implements OnInit {

  // dark mode enabled?
  darkMode = true;

  // play sounds
  isSoundOn = true;

  constructor(
    private menu: MenuController,
    private alertController: AlertController,
    private ui: UiService,
    private data: DataService,
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
    this.setDarkMode();
  }

  /**
   * Close menu button
   */
  onCloseMenu(): void {
    this.menu.close('side-menu');
  }

  /**
   * Select new game pack
   */
  onSelectGamePack() {
    this.menu.close('side-menu');
    // show spinner before content loads.
    this.ui.hideSpinner.emit(false);
  }

  /**
   * Select level for current game pack.
   */
  onSelectLevel() {
    this.menu.close('side-menu');
    // emit select levels event so
    // modal will load level data.
    this.ui.selectLevels.emit();
  }

  /**
   * toggle dark mode
   */
  onToggleDarkMode(): void {
    // toggle and save the new mode
    this.data.toggleDarkMode();
    // update css
    this.setDarkMode();
  }

  /**
   * Read the value of dark mode saved in
   * local storage and set the css styles
   * accordingly
   */
  setDarkMode() {
    const darkMode = this.data.getDarkMode();
    try {
      this.darkMode = JSON.parse(darkMode);
    } catch (e) {
      this.darkMode = true; // dark mode by default
    }
    if (this.darkMode === true) {
      this.renderer.setAttribute(document.body, 'color-theme', 'dark');
    } else {
      this.renderer.setAttribute(document.body, 'color-theme', 'light');
    }
  }


  /**
   * toggle the sounds on/off
   */
  onToggleSounds() {
    // todo
    // this function not needed, since isSoundOn is bound to toggle button
    // if ( this. sound is on... play ) else don't.
  }

  /**
   * Present an alert,
   * If user confirms, delete everything from
   * local storagee.
   */
  async onClearGameData() {

    // close menu
    this.menu.close('side-menu');

    // present alert
    const alert = await this.alertController.create({
      header: 'Delete Saved Game Data?',
      message: 'Progress for all levels will be reset. This <strong>Cannot be undone.<strong>',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          id: 'cancel-button',
          handler: () => {
            //console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          id: 'confirm-button',
          handler: () => {
            // clear data, the emit event to reset game board
            this.data.clearAll();
            this.ui.didClearSaveData.emit(); // subscribed by game.page.ts
          }
        }
      ]
    });

    await alert.present();
  }

}
