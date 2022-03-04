import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {


  constructor(private menu: MenuController) {}


  /**
   * click event to toggle the menu
   */
  onMenuToggle(): void {
    this.menu.toggle('side-menu');
  }

}
