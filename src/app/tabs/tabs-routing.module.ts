import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: '',
        loadChildren: () => import('../game/game.module').then(m => m.GamePageModule)
      },
      {
        path: '',
        redirectTo: '/game',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/game',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
