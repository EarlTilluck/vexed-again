import { Component, OnInit } from '@angular/core';
import { UiService } from '../services/ui.service';

@Component({
  selector: 'app-cursor',
  templateUrl: './cursor.component.html',
  styleUrls: ['./cursor.component.scss'],
})
export class CursorComponent implements OnInit {

  left = 0;
  top = 0;
  opacity = 1;

  constructor(public ui: UiService) { }

  ngOnInit() { }

}
