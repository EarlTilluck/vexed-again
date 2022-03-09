import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GamePage } from './game.page';

import { GamePageRoutingModule } from './game-routing.module';
import { GameBlockComponent } from '../game-block/game-block.component';
import { CursorComponent } from '../cursor/cursor.component';
import { BorderComponent } from '../border/border.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    GamePageRoutingModule
  ],
  declarations: [GamePage, GameBlockComponent, CursorComponent, BorderComponent]
})
export class GamePageModule {}
