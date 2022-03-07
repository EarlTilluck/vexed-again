import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UiService } from '../services/ui.service';
import { VexedService } from '../services/vexed.service';

@Component({
  selector: 'app-game-select',
  templateUrl: './game-select-modal.component.html',
  styleUrls: ['./game-select-modal.component.scss'],
})
export class GameSelectComponent implements OnInit {

  constructor(
    private modalController: ModalController,
    public vexed: VexedService,
    public ui: UiService
  ) {}

  ngOnInit() {}

  /**
   * Select a game pack to play
   *
   * @param id index in the game pack array
   */
  onSelectPack(id): void {
    this.vexed.selectGamePack(id);
    this.modalController.dismiss();
  }

  onDissmissModal(): void {
    this.modalController.dismiss();
  }
}
