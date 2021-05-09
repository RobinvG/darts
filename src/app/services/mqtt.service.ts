import { Injectable, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { IMqttMessage, MqttService, IMqttServiceOptions } from 'ngx-mqtt';

@Injectable({
  providedIn: 'root'
})
export class MQTTService implements OnDestroy {
  private subscription!: Subscription;
  public mqtt: MQTT = localStorage.getItem('MQTT') ? JSON.parse(localStorage.getItem('MQTT')!) : {}
  public externalCommands = new Subject<ExternalCMD>();
   
  constructor(private _mqttService: MqttService) {
    if (this.mqtt.enable){
      let connect:IMqttServiceOptions ={
        hostname: this.mqtt.uri,
        port: this.mqtt.port,
        protocol: this.mqtt.ssl ? 'wss' : 'ws',
        path: this.mqtt.path,
      }
      if (this.mqtt.username){
        connect.username = this.mqtt.username 
        connect.password = this.mqtt.password
      }
      _mqttService.connect(connect);
    }
  }

  private publishAndForget(topic:string, msg:object){
    if (!this.mqtt.enable) return 

      this._mqttService.unsafePublish(topic, JSON.stringify(msg), {qos:0})
    
  } 

  publishScore(message: object){
    this.publishAndForget('darts/score', message)
  }

  subscribeShot(){
    this.subscription = this._mqttService.observe('darts/shot').subscribe((message: IMqttMessage) => {
      this.externalCommands.next({topic:'shot', value:message.payload})
    });
  }

  ngOnDestroy(){
    if (this.subscription)
      this.subscription.unsubscribe()
  }
  
}

export interface ExternalCMD{
  topic: string
  value: any
}


export interface MQTT{
  enable: boolean
  uri: string
  port: number
  ssl: boolean
  path: string
  username?: string
  password?: string
  publish?: {
    startGame?: Publish
    score?: Publish
    throwOut?: Publish
    finish?: Publish
  }
}

interface Publish{
  topic: string
  msg: string
}