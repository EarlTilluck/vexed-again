import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-how-to-play-modal',
  templateUrl: './how-to-play-modal.component.html',
  styleUrls: ['./how-to-play-modal.component.scss'],
})
export class HowToPlayModalComponent implements OnInit {

  constructor(private modalController: ModalController) { }

  ngOnInit() {}
  onDissmissModal(): void {
    this.modalController.dismiss();
  }
}
