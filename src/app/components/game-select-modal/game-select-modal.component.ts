import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UiService } from '../../services/ui.service';
import { VexedService } from '../../services/vexed.service';

@Component({
  selector: 'app-game-select-modal',
  templateUrl: './game-select-modal.component.html',
  styleUrls: ['./game-select-modal.component.scss'],
})
export class GameSelectComponent implements OnInit {

  // vexed game packs
  packs = [];

  // show the spinner or not
  hideSpinner = false;

  constructor(
    private modalController: ModalController,
    private vexed: VexedService,
    public ui: UiService
  ) {}

  ngOnInit() {
    /*
      This is supposed to hide janky modal loading
      due to the large array that ngFor operates on
      when loading these components.
    */
    this.ui.hideSpinner.subscribe( (shouldHide) => {
      this.hideSpinner = shouldHide;
    });

    // load gamepack data
    this.packs = this.vexed.vexedLevels;
  }

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
