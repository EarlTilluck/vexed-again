import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { VexedService } from '../services/vexed.service';


@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss'],
})
export class SidemenuComponent implements OnInit {

  // mode of the side menu.
  selectGamePackMode = false;

  // vexed levels
  vexedLevels = [];

  constructor(
    private menu: MenuController,
    private vexed: VexedService
  ) {}

  ngOnInit(): void {
    this.vexedLevels = this.vexed.vexedLevels;
  }


  toggleSelectMode(): void {
    this.selectGamePackMode = !this.selectGamePackMode;
  }

  /**
   * Select a game pack to play
   *
   * @param id index in the game pack array
   */
  onSelectPack(id): void {
    this.menu.close('side-menu');
    this.vexed.selectGamePack(id);
  }


  resetMenu(): void {
    this.selectGamePackMode = false;
  }



}
