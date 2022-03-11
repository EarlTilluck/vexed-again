import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-about-modal',
  templateUrl: './about-modal.component.html',
  styleUrls: ['./about-modal.component.scss'],
})
export class AboutModalComponent implements OnInit {

  constructor(private modalController: ModalController) { }

  ngOnInit() {}

  onDissmissModal(): void {
    this.modalController.dismiss();
  }

}
