import { Component, Input, OnInit } from '@angular/core';
import { LevelPack } from '../models/LevelPack.model';
import { UiService } from '../services/ui.service';

@Component({
  selector: 'app-game-pack-item',
  templateUrl: './game-pack-item.component.html',
  styleUrls: ['./game-pack-item.component.scss'],
})
export class GamePackItemComponent implements OnInit {

  @Input() pack: LevelPack;
  @Input() id: number;
  @Input() end: number; // last index of all packs available

  constructor(public ui: UiService) { }

  ngOnInit() {
    // when last of these is loaded, hide spinner

    /*
      This is supposed to hide janky modal loading
      due to the large array that ngFor operates on
      when loading these components.
    */

    if( this.id === this.end ) {
      setTimeout(() => {
        this.ui.hideSpinner.emit(true);
      }, 1500);
    }
  }

}
