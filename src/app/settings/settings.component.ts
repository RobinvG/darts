import { Component, OnInit } from '@angular/core';
import { MQTT } from '../services/mqtt.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.less']
})
export class SettingsComponent implements OnInit {
  mqtt: MQTT=localStorage.getItem('MQTT') ? JSON.parse(localStorage.getItem('MQTT')!) : {
    enable: false,
    uri: "localhost",
    port: 1184,
    path: "/mqtt",

  }
  constructor() { }

  ngOnInit(): void {

  }
  saveSetting(){
    localStorage.setItem("MQTT", JSON.stringify(this.mqtt))
  }
}

