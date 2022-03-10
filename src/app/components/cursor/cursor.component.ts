import { Component, OnInit } from '@angular/core';
import { GameService } from '../../services/game.service';
import { UiService } from '../../services/ui.service';

@Component({
  selector: 'app-cursor',
  templateUrl: './cursor.component.html',
  styleUrls: ['./cursor.component.scss'],
})
export class CursorComponent implements OnInit {


  constructor(public ui: UiService, public game: GameService) { }

  ngOnInit() { }

}
