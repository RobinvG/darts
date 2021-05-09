import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SettingsComponent } from './settings/settings.component';
import { GameComponent } from './game/game.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HomeComponent } from './home/home.component';
import { MatCardModule} from '@angular/material/card';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatDialogModule} from '@angular/material/dialog';
import { PopupComponent } from './popup/popup.component';
import { PlayerComponent } from './game/player/player.component';
import { ThemingService } from './services/theming.service';
import {MatMenuModule} from '@angular/material/menu';
import { MqttModule, IMqttServiceOptions } from "ngx-mqtt";
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

export const MQTT_SERVICE_OPTIONS: IMqttServiceOptions = {
  connectOnCreate: false,
 
}

@NgModule({
  declarations: [
    AppComponent,
    SettingsComponent,
    GameComponent,
    HomeComponent,
    PopupComponent,
    PlayerComponent,
  ],
  imports: [
    BrowserModule,
    MatToolbarModule,
    FormsModule,
    AppRoutingModule,
    MatButtonModule,
    MatIconModule,
    FlexLayoutModule,
    MatCardModule,
    MatDialogModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatInputModule,
    BrowserAnimationsModule,
    MatRadioModule,
    MatButtonToggleModule,
    MatMenuModule,
    MqttModule.forRoot(MQTT_SERVICE_OPTIONS)
  ],
  providers: [ThemingService],
  bootstrap: [AppComponent]
})
export class AppModule { }
