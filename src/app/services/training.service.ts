import { Injectable, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { PopupComponent } from '../popup/popup.component';
import { MQTT, MQTTService } from './mqtt.service';
import {throwOut} from './throwout'

@Injectable({
  providedIn: 'root'
})
export class TrainingService {
  private subs:  Subscription[] = []

  training = new BehaviorSubject<training>({
    finishes: [
      {finish: 100, scoreLeft: 100, throws: [], locked: false},
    ]
  })
  maxFinish: number =  172
  easy_mode:  boolean = false
  constructor(
    public dialog: MatDialog,
    private router: Router,
    private mqttService: MQTTService,
  ) {
    if (this.mqttService.mqtt.enable){
      this.mqttService.subscribeShot()
      this.externalCommands()

    }
  }

  externalCommands(){
    this.subs.push(this.mqttService.externalCommands.subscribe(command => {

    }))
  }

  startTraining(starts: number, easy_mode: boolean|  undefined){
    this.easy_mode =  easy_mode ? easy_mode : false
    this.training.next({
      finishes: [{finish: starts, scoreLeft: starts,  throws: [], locked: false}]
    })
    this.mqttService.publishScore({
      player: "",
      score: starts,
      scoreLeft: this.getThrowOut(starts),
    })
  } 

  setScore(score:number){
    let training = {...this.training.value}
    let lastFinish = training.finishes[training.finishes.length-1]
    training.finishes[training.finishes.length-1].throws.push(score)
    if (lastFinish.scoreLeft - score === 0){
      if (lastFinish.throws.length === 1){
        training.finishes[training.finishes.length-1].locked = true
      }
      this.training.next(training)
      this.nextFinish()
      return
    }

    if (lastFinish.throws.length === 3 && lastFinish.scoreLeft - score !== 0 ){
      if (!this.easy_mode){
        if (training.finishes.length === 1){
          training.finishes[training.finishes.length-1].scoreLeft = lastFinish.finish
          training.finishes[training.finishes.length-1].throws = []
        }else{
          for (var i = training.finishes.length - 1; i >= 0; i--) {
            if (!training.finishes[i].locked){
              training.finishes.splice(i, i)
            }else{
              break
            }
          }
          let newFinish =  training.finishes[training.finishes.length-1].finish + 1
          let test  = {finish: newFinish, scoreLeft: newFinish, throws: [], locked: false}
          training.finishes.push(test)
        }

      }else{
        training.finishes[training.finishes.length-1].scoreLeft = lastFinish.finish
        training.finishes[training.finishes.length-1].throws = []
      }
     
    }
    else{
      if (lastFinish.scoreLeft - score !== 1 &&  lastFinish.scoreLeft - score >= 0){
        training.finishes[training.finishes.length-1].scoreLeft =  lastFinish.scoreLeft - score
      }
    }
    this.mqttService.publishScore({
      player: "",
      score: training.finishes[training.finishes.length-1].scoreLeft,
      scoreLeft: this.getThrowOut(training.finishes[training.finishes.length-1].scoreLeft),
    })
    this.training.next(training)

  }

  nextFinish(){
    let training = {...this.training.value}
    let lastFinish = training.finishes[training.finishes.length-1].finish

    if (lastFinish == this.maxFinish){
      const dialogRef =  this.dialog.open(PopupComponent, {
        data: {title:"", message: "Play again"}
       }) 
       dialogRef.afterClosed().subscribe(result => {
        if (result){
          this.startTraining(training.finishes[0].finish, this.easy_mode)
        }else{
          this.router.navigate(['/'])
        }
      });
    }
    let newScore = lastFinish + 1
    training.finishes.push({finish: newScore, scoreLeft: newScore, throws: [], locked: false})
    this.training.next(training)
    
    this.mqttService.publishScore({
      player: "",
      score: newScore,
      scoreLeft: this.getThrowOut(newScore),
    })
   
  }

  getThrowOut(score:number|undefined){
    if (!score){
      return
    }
    return throwOut[score]? throwOut[score] : null
  }

}

export interface training{
  finishes: finishes[]
}

export interface finishes{
  finish: number
  scoreLeft: number
  throws: number[]
  locked: boolean
}


