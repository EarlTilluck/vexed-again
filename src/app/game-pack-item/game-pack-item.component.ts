import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { LevelPack } from '../models/LevelPack.model';
import { UiService } from '../services/ui.service';

@Component({
  selector: 'app-game-pack-item',
  templateUrl: './game-pack-item.component.html',
  styleUrls: ['./game-pack-item.component.scss'],
})
export class GamePackItemComponent implements OnInit, AfterViewInit {

  @Input() pack: LevelPack;

  constructor(public ui: UiService) { }

  ngOnInit() {}

  ngAfterViewInit() {
      this.ui.hideSpinner();
  }

}
