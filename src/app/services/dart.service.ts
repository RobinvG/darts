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
export class DartService implements OnDestroy{
  private subs:  Subscription[] = []
  stat = {
    highestOut: 0,
    nineDarter: 0,
    180: 0,
    "140+": 0,
    "100+": 0,
    "80+": 0,
    "60+": 0,
    lolly: 0,
    shots: 0,
  }
  unfinishable = [169, 168, 166, 165, 163, 162, 159]
  game = new BehaviorSubject<Game>({
    legs: 3, 
    gameType: 501,
    started: 1,
    playing: 1,
    players: 2,
    player1: {
      name: "player1",
      won:0,
      average:0,
      playerNumber:1, 
      stats: this.stat,
      scoreLeft: 0, 
      thrown: 0,
      scores:[]
    },
    player2:{
      name: "player2",
      won:0,
      average:0,
      playerNumber:2, 
      stats: this.stat,
      scoreLeft: 0, 
      thrown: 0,
      scores:[]
    }
  })

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
      let game = {...this.game.value}
      if (command.topic == 'shot'){
        const pl ='player' + game.playing
        let player = {...game[pl]}
        let stats = {...player.stats}
        stats.shots =  stats.shots + 1
        player.stats = stats
        game[pl] = player
        console.log(player)
      }
      
      this.game.next(game)
    }))
  }
  startGame(legs: number, gameType: number, player1: string, player2?: string, player3?:string, player4?:string){
    this.mqttService.publishScore({message:"Game on"})
    
    const playerStats = {stats:this.stat, scoreLeft:gameType, scores:[], won:0, average:0, thrown: 0}
    let game: Game ={
      legs: legs,
      gameType: gameType,
      started: 1,
      playing: 1,
      players: 1,
      player1:{ name: player1, playerNumber:1, ...playerStats}
    }
    let players = 1
    if (player2){
      players = 2
      game.player2={ name: player2, playerNumber:2, ...playerStats}
    }
    if (player3){
      players = 3
      game.player3={ name: player3, playerNumber:3, ...playerStats}
    }
    if (player4){
      players = 4
      game.player4={ name: player4, playerNumber:4, ...playerStats}
    }
    game.players =players
    this.game.next(game)
    setTimeout(()=>{
      this.mqttService.publishScore({
        player: player1,
        score: gameType
      })
    }, 1000)
  }

  setScore(playerNumber: number, score:number){
    let game  = {...this.game.value}
    const pl ='player' + playerNumber 
    let player = {...game[pl]}
    let stats = {...player.stats}

    if (player.scoreLeft - score == 0){
      if (this.unfinishable.indexOf(player.scoreLeft - score) === -1){
        player.scoreLeft = 0
        if (score > stats.highestOut){
          stats.highestOut = score
        }
        if (player.thrown == 6){
          stats.nineDarter = stats.nineDarter + 1
        }       
      }
    }else if (player.scoreLeft - score > 1 ){
      player.scoreLeft = player.scoreLeft - score
    }
    player.thrown = player.thrown + 3
    player.scores = [score, ...player.scores]

    player.average = (game.gameType - player.scoreLeft) / player.thrown

    if (score == 3){
      stats.lolly = stats.lolly  +1
    }
    if (score == 180 ){
      stats["180"] = stats["180"]  +1
      this.mqttService.publishScore({message:"180"})
    }
    else if (score >= 140 ){
      stats["140+"] = stats["140+"] +1
    }
    else if (score >= 100 ){
      stats["100+"] = stats["100+"] +1
    }
    else if (score >= 80 ){
      stats["80+"] = stats["80+"] +1
    }
    else if (score >= 60 ){
      stats["60+"] = stats["60+"] +1
    }
    player.stats = stats
    game[pl] = player

    let playing  =  game.playing + 1
    if (playing > game.players){
      playing = 1
    }
    game.playing = playing
    
    this.game.next(game)

    const newPlay = game['player' + playing]
    
    this.mqttService.publishScore({
      player: newPlay.name,
      score: newPlay.scoreLeft,
      scoreLeft: this.getThrowOut(newPlay.scoreLeft),
      // stats: newPlay.stats,
      // scores: newPlay.scores.slice(Math.max(newPlay.scores.length - 3, 1))
    })

    if (player.scoreLeft === 0){
      this.newLeg(playerNumber)
    }
  }


  newLeg(playerNumber:number){
    let game ={...this.game.value}
    const pl ='player' + playerNumber 
    let player = {...game[pl]}
    player.won = player.won + 1    
    game[pl] = player
    if (player.won == game.legs){
      const dialogRef =  this.dialog.open(PopupComponent, {
        data: {title:player.name + " Won", message: "Play again"}
       }) 
       this.mqttService.publishScore({message: player.name + " won"})
       dialogRef.afterClosed().subscribe(result => {
        if (result){
          this.startGame(game.legs, game.gameType, game.player1.name, game.player2?.name, game.player3?.name, game.player4?.name)
        }else{
          this.router.navigate(['/'])
        }
      });
      return
    }
    let player1= {...game.player1}
    player1.scoreLeft = game.gameType
    player1.scores = []
    player1.average = 0
    player1.thrown = 0
    game.player1 = player1
    if (game.player2){
      let player2 = {...game.player2}
      player2.scoreLeft = game.gameType
      player2.scores =[]
      player2.average = 0
      player2.thrown = 0
      game.player2 = player2
    }
    if (game.player3){
      let player3 = {...game.player3}
      player3.scoreLeft = game.gameType
      player3.scores =[]
      player3.average = 0
      player3.thrown = 0
      game.player3 = player3
    }
    if (game.player4){
      let player4 = {...game.player4}
      player4.scoreLeft = game.gameType
      player4.scores =[]
      player4.average = 0
      player4.thrown = 0
      game.player4 = player4
    }
    let started = game.started + 1
    if (started > game.players){
      started = 1
    }
    game.started = started
    game.playing = started
    this.game.next(game)
    const newPlay = game['player' + started]
    this.mqttService.publishScore({
      player: newPlay.name,
      score: newPlay.scoreLeft,
      // stats: newPlay.stats
    })
  }

  getThrowOut(score:number|undefined){
    if (!score){
      return
    }
    return throwOut[score]? throwOut[score] : null
  }

  revertLastScore(newScore:number, playerNumber:number){
    let game ={...this.game.value}
    const pl ='player' + playerNumber 
    let player = {...game[pl]}
    var lastScore = player.scores.shift(); 
    player.scoreLeft = player.scoreLeft +  lastScore - newScore
    player.scores = [newScore , ...player.scores]
    
    game[pl] = player
    this.game.next(game)
  }
  ngOnDestroy(){
    this.subs.forEach(sub => sub.unsubscribe())
  }
}


export interface Game {
  [key: string]: any; 
  legs: number
  gameType: number
  playing: number
  started: number
  players: number
  player1: DartPlayer
  player2?: DartPlayer
  player3?: DartPlayer
  player4?: DartPlayer
}

export interface DartPlayer {
  name: string
  won: number
  average: number
  playerNumber: number
  scoreLeft?: number
  scores: number[]
  thrown?: number
  stats: Stats
}

export interface Stats {
  highestOut?: number
  nineDarter?: number
  180?: number
  "140+"?: number
  "100+"?: number
  "80+"?: number
  "60+"?: number
  lolly?: number
  shots?: number
}
