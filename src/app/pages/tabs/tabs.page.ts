import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { UiService } from 'src/app/services/ui.service';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {


  constructor(
    private menu: MenuController,
    private game: GameService,
    private ui: UiService
  ) {}


  /**
   * click event to toggle the menu
   */
  onMenuToggle(): void {
    if(this.ui.blockFor === '') {
      this.menu.toggle('side-menu');
    }
  }

  /**
   * Undo event
   */
  onUndo(): void {
    this.game.undo();
  }

  /**
   * Reset event
   */
  onReset(): void {
    this.game.reset();
  }
}
