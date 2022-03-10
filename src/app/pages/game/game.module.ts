import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GamePage } from './game.page';

import { GamePageRoutingModule } from './game-routing.module';
import { GameBlockComponent } from '../../components/game-block/game-block.component';
import { CursorComponent } from '../../components/cursor/cursor.component';
import { BorderComponent } from '../../components/border/border.component';

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
