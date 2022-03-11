import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AboutModalComponent } from './components/about-modal/about-modal.component';
import { GamePackItemComponent } from './components/game-pack-item/game-pack-item.component';
import { GameSelectComponent } from './components/game-select-modal/game-select-modal.component';
import { HowToPlayModalComponent } from './components/how-to-play-modal/how-to-play-modal.component';
import { LevelSelectModalComponent } from './components/level-select-modal/level-select-modal.component';
import { SidemenuComponent } from './components/sidemenu/sidemenu.component';
import { SoundModalComponent } from './components/sound-modal/sound-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    SidemenuComponent,
    GameSelectComponent,
    GamePackItemComponent,
    LevelSelectModalComponent,
    SoundModalComponent,
    HowToPlayModalComponent,
    AboutModalComponent
  ],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, FormsModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
