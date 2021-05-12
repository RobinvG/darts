import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GameComponent } from './game/game.component';
import { HomeComponent } from './home/home.component';
import { SettingsComponent } from './settings/settings.component';
import { TraningComponent } from './traning/traning.component';
// import { StatsComponent } from './stats/stats.component';

const routes: Routes = [
  {path: "", component: HomeComponent},
  {path: "settings", component:SettingsComponent},
  {path: "stats", component:HomeComponent},
  {path: "game", component:GameComponent},
  {path: "training", component:TraningComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
